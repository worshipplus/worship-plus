Feature: Definicao de papel de integrante na Escala por Event
  Como admin ou Owner/Ministro
  Quero definir o papel do integrante por Event
  Para que cada integrante execute apenas um papel na Escala

  Background:
    Given existe um integrante com papel principal "violao"
    And o integrante possui papel secundario "voz"
    And existe um Event aberto para planejamento

  @happy-path
  Scenario: Sugerir papel principal na insercao na Escala
    Given estou editando a Escala como admin
    When adiciono o integrante no Event
    Then o papel sugerido deve ser "violao"
    And a atribuicao inicial deve ser salva com sucesso

  @happy-path
  Scenario: Alterar para papel secundario permitido
    Given estou editando a Escala como Owner do Event
    And o integrante ja esta na Escala com papel "violao"
    When altero o papel para "voz"
    Then a alteracao deve ser salva com sucesso

  @validation
  Scenario: Rejeitar papel invalido para o integrante
    Given estou editando a Escala como admin
    And o integrante nao possui habilidade "bateria"
    When tento definir o papel "bateria"
    Then devo receber erro DOMAIN-013
    And devo ver mensagem amigavel de validacao

  @authorization
  Scenario: Bloquear team-member na edicao de papel de terceiros
    Given estou autenticado como team-member
    And existe um integrante na Escala de um Event
    When tento editar o papel desse integrante
    Then devo receber erro DOMAIN-005
    And a alteracao nao deve ser aplicada

  @state
  Scenario: Bloquear mutacao em Event Locked
    Given o Event esta marcado como Locked Event
    And estou editando a Escala como admin
    When tento alterar o papel de um integrante
    Then devo receber erro DOMAIN-014
    And o papel atual deve ser mantido

  @consistency
  Scenario: Garantir um unico papel por integrante no mesmo Event
    Given estou editando a Escala como admin
    And o integrante ja possui papel "violao" no Event
    When tento atribuir um segundo papel adicional
    Then o sistema deve manter apenas um papel ativo para o integrante
    And nao deve haver duplicidade de papel por integrante no Event
