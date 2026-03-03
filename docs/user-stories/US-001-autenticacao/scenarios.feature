# US-001: Autenticação Básica - BDD Scenarios
# Language: pt-BR
# Framework: Cucumber/Jest/Vitest
# Bounded Context: User Management

Feature: Autenticação de Usuário
  Como usuário registrado
  Quero fazer login no sistema
  Para acessar minhas funcionalidades de forma segura

  Background: Contexto Comum
    Given o sistema está online
    And o usuário "jubarte@adpg.com" está cadastrado com senha "SecurePass123"
    And o usuário "jubarte@adpg.com" tem role "ministro"

  # ============================================================================
  # HAPPY PATH (Fluxos de Sucesso)
  # ============================================================================

  @happy-path @smoke @critical
  Scenario: Login bem-sucedido com credenciais corretas
    Given estou na página de login "/login"
    When preencho o campo "Email" com "jubarte@adpg.com"
    And preencho o campo "Senha" com "SecurePass123"
    And clico no botão "Entrar"
    Then devo ser redirecionado para "/dashboard"
    And devo ver mensagem de boas-vindas "Bem-vindo, Jubarte!"
    And o token JWT deve estar armazenado no httpOnly cookie
    And devo ver meu avatar no header

  @happy-path
  Scenario: Sessão persiste após reload da página
    Given estou autenticado como "jubarte@adpg.com"
    And estou na página "/dashboard"
    When recarrego a página (F5)
    Then devo permanecer autenticado
    And devo continuar vendo meu dashboard
    And meu token JWT deve permanecer válido

  @happy-path
  Scenario: Logout encerra sessão com sucesso
    Given estou autenticado como "jubarte@adpg.com"
    And estou na página "/dashboard"
    When clico no botão "Logout" no header
    Then devo ser redirecionado para "/login"
    And meu token JWT deve ser invalidado
    And devo ver mensagem "Você foi desconectado com sucesso"
    When tento acessar "/dashboard"
    Then devo ser redirecionado para "/login"

  # ============================================================================
  # VALIDATION (Validações de Input)
  # ============================================================================

  @validation
  Scenario Outline: Validação de campos obrigatórios
    Given estou na página de login
    When preencho o campo "Email" com "<email>"
    And preencho o campo "Senha" com "<senha>"
    And clico no botão "Entrar"
    Then devo ver mensagem de erro "<mensagem>"
    And o botão "Entrar" deve permanecer habilitado
    And devo permanecer na página de login
    
    Examples: Casos de validação
      | email             | senha          | mensagem                                |
      |                   | SecurePass123  | Campo email é obrigatório               |
      | invalido          | SecurePass123  | Formato de email inválido               |
      | jubarte@adpg.com  |                | Campo senha é obrigatório               |
      | jubarte@adpg.com  | 123            | Senha deve ter no mínimo 8 caracteres   |

  @validation @client-side
  Scenario: Validação client-side antes de submeter
    Given estou na página de login
    When preencho o campo "Email" com "invalido"
    And o campo "Email" perde o foco (blur)
    Then devo ver feedback de erro abaixo do campo "Email"
    And o feedback deve dizer "Formato de email inválido"
    And nenhuma requisição HTTP deve ser feita

  # ============================================================================
  # ERROR HANDLING (Tratamento de Erros)
  # ============================================================================

  @error-handling @critical
  Scenario: Credenciais inválidas - senha incorreta
    Given estou na página de login
    When preencho o campo "Email" com "jubarte@adpg.com"
    And preencho o campo "Senha" com "SenhaErrada123"
    And clico no botão "Entrar"
    Then devo ver mensagem de erro "Email ou senha incorretos"
    And devo permanecer na página de login
    And o campo "Senha" deve ser limpo
    And o campo "Email" deve manter o valor preenchido

  @error-handling
  Scenario: Email não cadastrado no sistema
    Given estou na página de login
    When preencho o campo "Email" com "naoexiste@adpg.com"
    And preencho o campo "Senha" com "QualquerSenha123"
    And clico no botão "Entrar"
    Then devo ver mensagem de erro "Email não encontrado"
    And devo permanecer na página de login

  @error-handling @security @critical
  Scenario: Bloqueio após múltiplas tentativas falhas
    Given estou na página de login
    And já tentei fazer login 5 vezes com senha incorreta
    When preencho o campo "Email" com "jubarte@adpg.com"
    And preencho o campo "Senha" com "QualquerSenha"
    And clico no botão "Entrar"
    Then devo ver mensagem de erro "Múltiplas tentativas de login falhas. Aguarde 15 minutos."
    And o botão "Entrar" deve estar desabilitado
    And devo ver countdown de "15:00" até liberar novo login

  @error-handling @network
  Scenario: Erro de rede durante autenticação
    Given estou na página de login
    And o servidor Supabase está inacessível (mock 500)
    When preencho o campo "Email" com "jubarte@adpg.com"
    And preencho o campo "Senha" com "SecurePass123"
    And clico no botão "Entrar"
    Then devo ver mensagem de erro "Erro ao conectar. Verifique sua conexão e tente novamente."
    And devo ver botão "Tentar Novamente"
    When clico em "Tentar Novamente"
    Then a requisição deve ser reenviada

  # ============================================================================
  # PASSWORD RECOVERY (Recuperação de Senha)
  # ============================================================================

  @password-recovery @happy-path
  Scenario: Recuperação de senha com email válido
    Given estou na página de login
    When clico no link "Esqueci minha senha"
    Then devo ser redirecionado para "/recover-password"
    When preencho o campo "Email" com "jubarte@adpg.com"
    And clico no botão "Enviar link de recuperação"
    Then devo ver mensagem de sucesso "Se o email estiver cadastrado, você receberá um link de recuperação"
    And um email deve ser enviado para "jubarte@adpg.com" (mock verificar)

  @password-recovery @security
  Scenario: Recuperação de senha com email não cadastrado (não expõe existência)
    Given estou na página "/recover-password"
    When preencho o campo "Email" com "naoexiste@adpg.com"
    And clico no botão "Enviar link de recuperação"
    Then devo ver mensagem de sucesso "Se o email estiver cadastrado, você receberá um link de recuperação"
    And nenhum email deve ser enviado (mock verificar)
    # Security: Não revelar se email existe ou não

  @password-recovery @validation
  Scenario: Rate limiting em recuperação de senha
    Given estou na página "/recover-password"
    And já solicitei recuperação de senha 3 vezes nos últimos 5 minutos
    When preencho o campo "Email" com "jubarte@adpg.com"
    And clico no botão "Enviar link de recuperação"
    Then devo ver mensagem de erro "Aguarde 5 minutos antes de solicitar novamente"
    And nenhum email deve ser enviado

  # ============================================================================
  # TOKEN REFRESH (Renovação de Token)
  # ============================================================================

  @token-refresh @integration
  Scenario: Token expirado é renovado automaticamente
    Given estou autenticado como "jubarte@adpg.com"
    And meu access token expirou (mock)
    And meu refresh token ainda é válido
    When faço uma requisição para "/api/events"
    Then o sistema deve renovar meu access token automaticamente
    And a requisição original deve ser completada com sucesso
    And devo ver os eventos carregados

  @token-refresh @error-handling
  Scenario: Refresh token expirado redireciona para login
    Given estou autenticado como "jubarte@adpg.com"
    And meu access token expirou
    And meu refresh token também expirou (7 dias)
    When faço uma requisição para "/api/events"
    Then devo ser redirecionado para "/login"
    And devo ver mensagem "Sua sessão expirou. Faça login novamente."

  # ============================================================================
  # EDGE CASES (Casos Extremos)
  # ============================================================================

  @edge-case
  Scenario: Email com espaços extras é normalizado
    Given estou na página de login
    When preencho o campo "Email" com "  jubarte@adpg.com  "
    And preencho o campo "Senha" com "SecurePass123"
    And clico no botão "Entrar"
    Then o sistema deve remover espaços extras do email
    And devo ser autenticado com sucesso
    And devo ser redirecionado para "/dashboard"

  @edge-case
  Scenario: Email case-insensitive (maiúsculas/minúsculas)
    Given o usuário "jubarte@adpg.com" está cadastrado
    And estou na página de login
    When preencho o campo "Email" com "JUBARTE@ADPG.COM"
    And preencho o campo "Senha" com "SecurePass123"
    And clico no botão "Entrar"
    Then devo ser autenticado com sucesso
    # Email deve ser case-insensitive

  # ============================================================================
  # AUTHORIZATION (Permissões)
  # ============================================================================

  @authorization
  Scenario: Usuário não autenticado não acessa rotas protegidas
    Given não estou autenticado
    When tento acessar "/dashboard"
    Then devo ser redirecionado para "/login?redirect=/dashboard"
    And devo ver mensagem "Você precisa estar autenticado para acessar esta página"
    When faço login com credenciais válidas
    Then devo ser redirecionado para "/dashboard" (redirect original)

  # ============================================================================
  # ACCESSIBILITY (Acessibilidade)
  # ============================================================================

  @accessibility @a11y
  Scenario: Navegação por teclado funciona corretamente
    Given estou na página de login
    When navego com a tecla TAB
    Then o foco deve seguir a ordem: Email → Senha → Entrar → Esqueci Senha
    And cada elemento focado deve ter indicador visual claro
    When pressiono ENTER no campo "Senha"
    Then o formulário deve ser submetido
    # Mesmo comportamento que clicar em "Entrar"

  @accessibility @a11y
  Scenario: Screen readers podem navegar o formulário
    Given estou usando um screen reader (mock VoiceOver)
    And estou na página de login
    When navego pelo formulário
    Then cada campo deve ter label associado anunciado
    And mensagens de erro devem ser anunciadas via aria-live
    And o título da página deve ser anunciado: "Login - Worship+"

  # ============================================================================
  # MOBILE / RESPONSIVE
  # ============================================================================

  @mobile @responsive
  Scenario: Login funciona em dispositivo mobile
    Given estou acessando de um dispositivo mobile (390x844)
    And estou na página de login
    When preencho os campos com credenciais válidas
    And clico no botão "Entrar" (área mínima 44x44px)
    Then devo ser autenticado com sucesso
    And todos os elementos devem estar visíveis sem zoom
    And não deve haver scroll horizontal

  @mobile @responsive
  Scenario: Teclado virtual não sobrepõe botão "Entrar"
    Given estou em um iPhone (viewport 390x844)
    And estou na página de login
    When clico no campo "Senha"
    Then o teclado virtual deve aparecer
    And o botão "Entrar" deve permanecer visível
    And devo conseguir clicar em "Entrar" sem fechar o teclado

  # ============================================================================
  # PERFORMANCE
  # ============================================================================

  @performance
  Scenario: Login completa em tempo aceitável
    Given estou na página de login
    When preencho credenciais válidas e submito
    Then a requisição de autenticação deve completar em menos de 1 segundo
    And o redirecionamento para dashboard deve ocorrer em até 500ms
    And o tempo total (submit → dashboard renderizado) deve ser < 2 segundos
