# US-051: Guard Rails de CI e Branch Protection - BDD Scenarios
# Language: pt-BR
# Framework: Cucumber/Jest/Vitest
# Bounded Context: Team

Feature: Guard Rails de CI e Branch Protection
  Como Tech Lead do contexto Team
  Quero guard rails de CI e governança de branches
  Para reduzir quebras de pipeline e retrabalho

  Background: Repositório configurado
    Given o repositório possui workflow de CI configurado
    And o workspace possui dependências instaladas via npm

  # ============================================================================
  # HAPPY PATH (Fluxos de Sucesso)
  # ============================================================================

  @happy-path @smoke
  Scenario: CI executa build com scripts canônicos
    Given que o pipeline roda "npm ci"
    When o job executa "npm run tsc:build"
    And o job executa "npm run build"
    Then o build deve finalizar com sucesso
  
  # ============================================================================
  # ERROR HANDLING (Tratamento de Erros)
  # ============================================================================

  @error-handling
  Scenario: Pre-push bloqueia push quando TypeScript build falha
    Given que um desenvolvedor alterou um tsconfig para uma opção inválida
    When ele executa "git push"
    Then o hook pre-push deve falhar
    And o push não deve ser enviado ao remoto

  # ============================================================================
  # BRANCH PROTECTION (Governança de main)
  # ============================================================================

  @branch-protection
  Scenario: Branch protection impede push direto em main
    Given branch protection está habilitado para a branch "main"
    When um desenvolvedor tenta fazer push direto em "main"
    Then o push deve ser recusado
    And o desenvolvedor deve abrir um Pull Request

  @branch-protection
  Scenario: Branch protection exige checks obrigatórios para merge
    Given existe um Pull Request aberto para "main"
    And pelo menos um check obrigatório do workflow de CI falhou
    When o desenvolvedor tenta mergear o Pull Request
    Then o merge deve ser bloqueado

  @branch-protection
  Scenario: Merge é permitido quando checks obrigatórios passam
    Given existe um Pull Request aberto para "main"
    And todos os checks obrigatórios do workflow de CI passaram
    When o desenvolvedor tenta mergear o Pull Request
    Then o merge deve ser permitido
