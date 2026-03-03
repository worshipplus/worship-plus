# US-002: [Feature Name] - BDD Scenarios
# Language: pt-BR
# Framework: Cucumber/Jest/Vitest
# Bounded Context: [Context]

Feature: [Nome da Feature]
  Como [tipo de usuário]
  Quero [objetivo]
  Para [benefício]

  Background: Contexto Comum
    Given o sistema está online
    And o usuário "[user]" está autenticado
    And [pré-condição adicional]

  # ============================================================================
  # HAPPY PATH (Fluxos de Sucesso)
  # ============================================================================

  @happy-path @smoke
  Scenario: [Cenário principal de sucesso]
    Given [estado inicial]
    When [ação do usuário]
    And [ação adicional]
    Then [resultado esperado]
    And [efeito colateral verificável]
  
  # ============================================================================
  # VALIDATION (Validações de Input)
  # ============================================================================

  @validation
  Scenario Outline: Validação de campos obrigatórios
    Given estou na tela de [feature]
    When preencho <campo> com "<valor>"
    And clico em "Salvar"
    Then devo ver mensagem de erro "<mensagem>"
    And os dados não devem ser salvos
    
    Examples:
      | campo     | valor | mensagem                          |
      | email     |       | Campo email é obrigatório         |
      | email     | abc   | Formato de email inválido         |
      | password  | 123   | Senha deve ter no mínimo 8 chars  |
  
  # ============================================================================
  # ERROR HANDLING (Tratamento de Erros)
  # ============================================================================

  @error-handling
  Scenario: [Cenário de erro esperado]
    Given [pré-condição de erro]
    When [ação que causa erro]
    Then devo ver mensagem de erro "[mensagem]"
    And o sistema deve permanecer em estado consistente
  
  # ============================================================================
  # EDGE CASES (Casos Extremos)
  # ============================================================================

  @edge-case
  Scenario: [Caso extremo - ex: lista vazia]
    Given não existem [recursos] cadastrados
    When acesso a lista de [recursos]
    Then devo ver mensagem "Nenhum [recurso] encontrado"
    And devo ver botão "Criar [Recurso]"
  
  # ============================================================================
  # AUTHORIZATION (Permissões)
  # ============================================================================

  @authorization
  Scenario: Usuário sem permissão não pode [ação]
    Given estou autenticado como "member" (não "admin")
    When tento [ação restrita]
    Then devo ver mensagem "Você não tem permissão para esta ação"
    And a ação não deve ser executada
  
  # ============================================================================
  # INTEGRATION (Integrações Entre Contextos)
  # ============================================================================

  @integration
  Scenario: [Feature] dispara evento de domínio
    Given [pré-condição]
    When [ação que dispara evento]
    Then o evento "[EventName]" deve ser disparado
    And o contexto "[TargetContext]" deve receber o evento
    And [ação consequente] deve ocorrer
  
  # ============================================================================
  # PERFORMANCE (Casos de Performance)
  # ============================================================================

  @performance
  Scenario: Lista com muitos itens carrega em tempo aceitável
    Given existem 1000 [recursos] cadastrados
    When acesso a lista de [recursos]
    Then a página deve carregar em menos de 2 segundos
    And devo ver os primeiros 20 itens
    And deve haver paginação funcional

  # ============================================================================
  # ACCESSIBILITY (Acessibilidade)
  # ============================================================================

  @accessibility
  Scenario: Navegação por teclado funciona corretamente
    Given estou na tela de [feature]
    When navego com a tecla TAB
    Then os campos devem receber foco na ordem correta
    And os elementos focados devem ter indicador visual
    And posso submeter o formulário com ENTER

  # ============================================================================
  # MOBILE / RESPONSIVE
  # ============================================================================

  @mobile @responsive
  Scenario: Feature funciona em mobile
    Given estou acessando de um dispositivo mobile (360x640)
    When acesso [feature]
    Then os elementos devem estar visíveis sem scroll horizontal
    And botões devem ter área mínima de toque de 44x44px
    And textos devem ser legíveis (>= 16px)
