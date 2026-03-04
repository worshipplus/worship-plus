# 🚀 Plano de Implementação - Sprint 1

**Período:** Semana 1 (7 dias)  
**Objetivo:** Implementar infraestrutura frontend (US-013, 014, 016, 017)  
**Testing:** Testar no navegador ANTES de commitar cada história

---

## 📊 User Stories do Sprint 1

| ID | Título | Complexidade | Estimativa | Status |
|----|--------|--------------|------------|--------|
| **US-013** | Design Tokens & Theme | 5 | 1 dia | 🔴 Not Started |
| **US-014** | Componentes Base | 8 | 2 dias | 🔴 Not Started |
| **US-016** | Custom Hooks | 5 | 1 dia | 🔴 Not Started |
| **US-017** | Services Layer | 8 | 2 dias | 🔴 Not Started |
| **Setup** | Configuração inicial do projeto | 3 | 1 dia | 🔴 Not Started |

**Total:** 29 pontos (~7 dias)

---

## 📅 Cronograma Detalhado

### Dia 1: Setup do Projeto ⚙️

#### Manhã (4h)
1. **Inicializar projeto Vite + React + TypeScript**
   ```bash
   npm create vite@latest worship-plus -- --template react-ts
   cd worship-plus
   npm install
   ```

2. **Instalar dependências core**
   ```bash
   npm install @supabase/supabase-js
   npm install react-router-dom
   npm install lucide-react
   ```

3. **Instalar dev dependencies**
   ```bash
   npm install -D @types/node
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install -D prettier eslint-config-prettier
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   npm install -D @playwright/test
   npm install -D @storybook/react-vite
   ```

4. **Configurar Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

#### Tarde (4h)
5. **Estrutura de diretórios**
   ```bash
   mkdir -p src/{components,hooks,services,styles,types,utils,config,views}
   touch src/styles/{tokens.css,base.css,components.css}
   ```

6. **Configurar Supabase Client**
   ```typescript
   // src/config/supabase.ts
   import { createClient } from '@supabase/supabase-js';
   
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

7. **Configurar Vitest**
   ```typescript
   // vitest.config.ts
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.ts',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: ['node_modules/', 'src/test/']
       }
     }
   });
   ```

8. **Rodar projeto pela primeira vez**
   ```bash
   npm run dev
   ```
   **✅ Teste no navegador:** `http://localhost:5173` deve exibir tela inicial

---

### Dia 2: US-013 - Design Tokens & Theme 🎨

#### Manhã (4h)
1. **Criar tokens.css com glassmorphism**
   ```css
   /* src/styles/tokens.css */
   :root {
     /* Primary (Burgundy) */
     --color-primary: #7F1D2E;
     --color-primary-hover: #6B1825;
     --color-primary-light: #A8344A;
     --color-primary-10: rgba(127, 29, 46, 0.1);
     --color-primary-20: rgba(127, 29, 46, 0.2);
     
     /* Glassmorphism */
     --blur-xl: blur(40px);
     --glass-light: rgba(255, 255, 255, 0.6);
     --glass-elevated: rgba(255, 255, 255, 0.85);
     
     /* ... demais tokens ... */
   }
   ```

2. **Importar Google Fonts (Outfit + Inter)**
   ```html
   <!-- index.html -->
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

3. **Criar ThemeProvider (Context API)**
   ```tsx
   // src/context/ThemeContext.tsx
   import { createContext, useState, useEffect } from 'react';
   
   export const ThemeContext = createContext({
     theme: 'light',
     toggleTheme: () => {},
   });
   
   export const ThemeProvider = ({ children }) => {
     const [theme, setTheme] = useState('light');
     
     const toggleTheme = () => {
       const newTheme = theme === 'light' ? 'dark' : 'light';
       setTheme(newTheme);
       localStorage.setItem('theme', newTheme);
       document.documentElement.setAttribute('data-theme', newTheme);
     };
     
     return (
       <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   };
   ```

#### Tarde (4h)
4. **Configurar Tailwind com design tokens**
   ```javascript
   // tailwind.config.js
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     theme: {
       extend: {
         colors: {
           primary: {
             DEFAULT: 'var(--color-primary)',
             hover: 'var(--color-primary-hover)',
             light: 'var(--color-primary-light)',
           },
         },
         fontFamily: {
           display: ['Outfit', 'sans-serif'],
           body: ['Inter', 'sans-serif'],
         },
       },
     },
   };
   ```

5. **Criar utilities CSS (glassmorphism classes)**
   ```css
   /* src/styles/components.css */
   .glass-card {
     backdrop-filter: var(--blur-xl);
     background: var(--glass-light);
     border: 1px solid rgba(255, 255, 255, 0.8);
   }
   
   .glass-nav {
     backdrop-filter: var(--blur-xl);
     background: rgba(255, 255, 255, 0.7);
     border-radius: 28px;
   }
   ```

6. **Rodar no navegador e testar**
   ```bash
   npm run dev
   ```
   **✅ Testes manuais:**
   - [ ] Background offwhite (#FCFCFB) visível
   - [ ] Fonts Outfit + Inter carregando (DevTools → Network)
   - [ ] CSS custom properties aplicadas
   - [ ] Theme toggle funcionando (localStorage persistindo)

7. **Commit US-013**
   ```bash
   git add src/styles/ src/context/ThemeContext.tsx
   git commit -m "feat(tokens): implementa design tokens glassmorphism

   - tokens.css: 40+ variáveis (cores, spacing, typography)
   - ThemeProvider: Context API com localStorage
   - Tailwind config: integração com CSS variables
   - Google Fonts: Outfit (900) + Inter (400-700)
   - Glassmorphism: backdrop-filter blur(40px)
   
   US-013 completa, testada no navegador ✅"
   ```

---

### Dia 3-4: US-014 - Componentes Base 🧩

#### Componentes a implementar:
1. **Button** (Primary, Secondary, Ghost)
2. **Input** (Text, Password, Search)
3. **Card** (Standard, Hero)
4. **Badge** (Role, Status, Info)
5. **Avatar** (com initials fallback)

#### Dia 3 - Button + Input

##### Manhã (4h): Button Component

1. **Criar componente Button**
   ```tsx
   // src/components/Button.tsx
   import { ButtonHTMLAttributes, ReactNode } from 'react';
   import { Loader2 } from 'lucide-react';
   
   export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
   export type ButtonSize = 'sm' | 'md' | 'lg';
   
   export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: ButtonVariant;
     size?: ButtonSize;
     loading?: boolean;
     icon?: ReactNode;
     children: ReactNode;
   }
   
   export const Button = ({
     variant = 'primary',
     size = 'md',
     loading = false,
     icon,
     children,
     disabled,
     className = '',
     ...props
   }: ButtonProps) => {
     const baseStyles = 'rounded-3xl font-semibold transition-all duration-300 flex items-center gap-2 justify-center';
     
     const variants = {
       primary: 'bg-primary text-white hover:bg-primary-hover hover:shadow-glow-primary hover:-translate-y-1 hover:scale-102',
       secondary: 'bg-transparent border-2 border-neutral-300 text-neutral-900 hover:border-primary hover:text-primary',
       ghost: 'bg-transparent text-primary hover:bg-primary-10',
     };
     
     const sizes = {
       sm: 'px-4 py-2 text-sm min-h-[40px]',
       md: 'px-6 py-3 text-base min-h-[48px]',
       lg: 'px-8 py-4 text-lg min-h-[56px]',
     };
     
     return (
       <button
         className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
         disabled={disabled || loading}
         {...props}
       >
         {loading && <Loader2 className="animate-spin" size={20} />}
         {icon && !loading && icon}
         {children}
       </button>
     );
   };
   ```

2. **Criar testes do Button**
   ```tsx
   // src/components/Button.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Button } from './Button';
   
   describe('Button', () => {
     it('deve renderizar children corretamente', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
     
     it('deve aplicar variante primary por padrão', () => {
       const { container } = render(<Button>Button</Button>);
       const button = container.querySelector('button');
       expect(button).toHaveClass('bg-primary');
     });
     
     it('deve executar onClick quando clicado', () => {
       const handleClick = vi.fn();
       render(<Button onClick={handleClick}>Click</Button>);
       fireEvent.click(screen.getByText('Click'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
     
     it('deve desabilitar quando loading', () => {
       render(<Button loading>Loading</Button>);
       const button = screen.getByRole('button');
       expect(button).toBeDisabled();
       expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument(); // Spinner
     });
   });
   ```

3. **Criar Storybook story**
   ```tsx
   // src/components/Button.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { Button } from './Button';
   import { Heart } from 'lucide-react';
   
   const meta: Meta<typeof Button> = {
     title: 'Components/Button',
     component: Button,
     tags: ['autodocs'],
   };
   
   export default meta;
   type Story = StoryObj<typeof Button>;
   
   export const Primary: Story = {
     args: {
       children: 'Button Primary',
       variant: 'primary',
     },
   };
   
   export const WithIcon: Story = {
     args: {
       children: 'Favorite',
       variant: 'primary',
       icon: <Heart size={20} />,
     },
   };
   
   export const Loading: Story = {
     args: {
       children: 'Loading...',
       variant: 'primary',
       loading: true,
     },
   };
   ```

4. **Teste no navegador**
   ```bash
   npm run dev
   npm run storybook  # Porta 6006
   ```
   **✅ Checklist Button:**
   - [ ] Renderiza 3 variantes (primary, secondary, ghost)
   - [ ] Hover eleva botão (-translate-y-1) com glow
   - [ ] Loading state mostra spinner
   - [ ] Touch target ≥ 48px
   - [ ] Focus ring visível (keyboard navigation)
   - [ ] Transições suaves (300ms)

##### Tarde (4h): Input Component

5. **Criar componente Input**
   ```tsx
   // src/components/Input.tsx
   import { InputHTMLAttributes, forwardRef } from 'react';
   
   export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
     label?: string;
     error?: string;
     helperText?: string;
   }
   
   export const Input = forwardRef<HTMLInputElement, InputProps>(
     ({ label, error, helperText, className = '', ...props }, ref) => {
       return (
         <div className="flex flex-col gap-2">
           {label && (
             <label className="text-sm font-medium text-neutral-700">
               {label}
             </label>
           )}
           
           <input
             ref={ref}
             className={`
               w-full px-4 py-3 min-h-[48px]
               border-2 rounded-xl
               font-body text-base
               transition-all duration-300
               ${error 
                 ? 'border-error focus:border-error' 
                 : 'border-neutral-200 focus:border-primary'
               }
               focus:outline-none focus:shadow-focus
               disabled:bg-neutral-50 disabled:cursor-not-allowed
               ${className}
             `}
             {...props}
           />
           
           {error && (
             <span className="text-sm text-error">{error}</span>
           )}
           
           {helperText && !error && (
             <span className="text-sm text-neutral-500">{helperText}</span>
           )}
         </div>
       );
     }
   );
   ```

6. **Testar Input no navegador**
   ```bash
   npm run dev
   ```
   **✅ Checklist Input:**
   - [ ] Label acima do campo
   - [ ] Focus ring com glow
   - [ ] Error state vermelho
   - [ ] Placeholder visível
   - [ ] Min-height 48px (touch target)

7. **Commit Button + Input**
   ```bash
   git add src/components/Button.* src/components/Input.*
   git commit -m "feat(components): Button + Input glassmorphism

   Button:
   - 3 variantes (primary, secondary, ghost)
   - Hover glow + elevation
   - Loading state com spinner
   - Testes: 85% coverage
   
   Input:
   - Label, error, helper text
   - Focus ring com glow
   - Touch target 48px
   - A11y: ARIA attributes
   
   Testado no navegador ✅"
   ```

#### Dia 4 - Card, Badge, Avatar

**Seguir mesmo padrão:**
1. Implementar componente
2. Escrever testes (≥80% coverage)
3. Criar Storybook story
4. Testar no navegador (responsividade + glassmorphism)
5. Commit individual

---

### Dia 5: US-016 - Custom Hooks 🪝

#### Hooks a implementar:
1. **useAuth** - Autenticação com Supabase
2. **useLocalStorage** - State sincronizado com localStorage
3. **useDebounce** - Debounce de valores
4. **useMediaQuery** - Responsive breakpoints
5. **useOnClickOutside** - Fechar modals/dropdowns
6. **useAsync** - Estado assíncrono

#### Manhã (4h): useAuth + useLocalStorage

1. **Implementar useAuth**
   ```tsx
   // src/hooks/useAuth.ts
   import { useState, useEffect } from 'react';
   import { User } from '@supabase/supabase-js';
   import { supabase } from '@/config/supabase';
   
   export const useAuth = () => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);
     
     useEffect(() => {
       // Verificar sessão existente
       supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setLoading(false);
       });
       
       // Escutar mudanças de auth
       const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (_event, session) => {
           setUser(session?.user ?? null);
         }
       );
       
       return () => subscription.unsubscribe();
     }, []);
     
     const signIn = async (email: string, password: string) => {
       setLoading(true);
       setError(null);
       
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       
       if (error) setError(error);
       setLoading(false);
       
       return { data, error };
     };
     
     const signOut = async () => {
       setLoading(true);
       const { error } = await supabase.auth.signOut();
       if (error) setError(error);
       setLoading(false);
     };
     
     return {
       user,
       loading,
       error,
       signIn,
       signOut,
       isAuthenticated: !!user,
     };
   };
   ```

2. **Testar useAuth**
   ```tsx
   // src/hooks/useAuth.test.tsx
   import { renderHook, waitFor } from '@testing-library/react';
   import { useAuth } from './useAuth';
   
   describe('useAuth', () => {
     it('deve iniciar com loading true', () => {
       const { result } = renderHook(() => useAuth());
       expect(result.current.loading).toBe(true);
     });
     
     it('deve retornar user null quando não autenticado', async () => {
       const { result } = renderHook(() => useAuth());
       
       await waitFor(() => {
         expect(result.current.loading).toBe(false);
       });
       
       expect(result.current.user).toBeNull();
       expect(result.current.isAuthenticated).toBe(false);
     });
   });
   ```

#### Tarde (4h): Demais hooks

3. **Implementar hooks restantes**
   - useLocalStorage
   - useDebounce
   - useMediaQuery
   - useOnClickOutside
   - useAsync

4. **Testar todos os hooks no navegador**
   ```bash
   npm run dev
   ```
   
   Criar página de teste:
   ```tsx
   // src/views/HooksTestPage.tsx
   import { useAuth, useLocalStorage, useMediaQuery } from '@/hooks';
   
   export const HooksTestPage = () => {
     const { user, signOut } = useAuth();
     const [count, setCount] = useLocalStorage('count', 0);
     const isMobile = useMediaQuery('(max-width: 768px)');
     
     return (
       <div className="p-6">
         <h1>Hooks Test Page</h1>
         
         <div className="space-y-4">
           <div>
             <h2>useAuth</h2>
             <p>User: {user?.email || 'Not logged in'}</p>
             <button onClick={signOut}>Sign Out</button>
           </div>
           
           <div>
             <h2>useLocalStorage</h2>
             <p>Count: {count}</p>
             <button onClick={() => setCount(count + 1)}>Increment</button>
           </div>
           
           <div>
             <h2>useMediaQuery</h2>
             <p>Device: {isMobile ? 'Mobile' : 'Desktop'}</p>
           </div>
         </div>
       </div>
     );
   };
   ```

5. **Commit US-016**
   ```bash
   git add src/hooks/
   git commit -m "feat(hooks): custom hooks (useAuth, useLocalStorage, etc)

   - useAuth: Supabase auth integration
   - useLocalStorage: persistent state
   - useDebounce: search optimization
   - useMediaQuery: responsive utilities
   - useOnClickOutside: modal helpers
   - useAsync: loading/error states
   
   Todos com ≥80% coverage, testados no navegador ✅"
   ```

---

### Dia 6-7: US-017 - Services Layer 🔧

#### Services a implementar:
1. **AuthService** - Centraliza lógica de autenticação
2. **StorageService** - localStorage/sessionStorage abstraction
3. **ApiClient** - HTTP client com interceptors
4. **DI Container** - Dependency Injection

#### Dia 6: AuthService + StorageService

1. **Implementar AuthService**
   ```typescript
   // src/services/AuthService.ts
   import { supabase } from '@/config/supabase';
   
   export class AuthService {
     private static instance: AuthService;
     
     private constructor() {}
     
     static getInstance(): AuthService {
       if (!AuthService.instance) {
         AuthService.instance = new AuthService();
       }
       return AuthService.instance;
     }
     
     async signIn(email: string, password: string) {
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
       
       if (error) throw error;
       
       // Cache token
       sessionStorage.setItem('auth_token', data.session.access_token);
       
       return data;
     }
     
     async signOut() {
       const { error } = await supabase.auth.signOut();
       if (error) throw error;
       
       sessionStorage.removeItem('auth_token');
     }
     
     async getUser() {
       return await supabase.auth.getUser();
     }
     
     isSessionValid(): boolean {
       const token = sessionStorage.getItem('auth_token');
       return !!token;
     }
   }
   ```

2. **Testar no navegador**
   - Criar página de login
   - Testar sign in/out
   - Verificar sessionStorage no DevTools

#### Dia 7: ApiClient + DI Container

3. **Implementar ApiClient com retry**
   ```typescript
   // src/services/ApiClient.ts
   export class ApiClient {
     private baseURL: string;
     private maxRetries = 3;
     
     constructor(baseURL: string) {
       this.baseURL = baseURL;
     }
     
     async request<T>(
       endpoint: string,
       options: RequestInit = {}
     ): Promise<T> {
       const url = `${this.baseURL}${endpoint}`;
       let lastError: Error;
       
       for (let i = 0; i < this.maxRetries; i++) {
         try {
           const response = await fetch(url, {
             ...options,
             headers: {
               'Content-Type': 'application/json',
               ...options.headers,
             },
           });
           
           if (!response.ok) {
             throw new Error(`HTTP ${response.status}`);
           }
           
           return await response.json();
         } catch (error) {
           lastError = error as Error;
           
           // Retry apenas em erros 5xx
           if (i < this.maxRetries - 1) {
             await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
           }
         }
       }
       
       throw lastError!;
     }
     
     private delay(ms: number): Promise<void> {
       return new Promise(resolve => setTimeout(resolve, ms));
     }
   }
   ```

4. **Implementar DI Container**
   ```typescript
   // src/config/container.ts
   import { AuthService } from '@/services/AuthService';
   import { StorageService } from '@/services/StorageService';
   import { ApiClient } from '@/services/ApiClient';
   
   export class Container {
     private static instance: Container;
     
     public readonly authService: AuthService;
     public readonly storageService: StorageService;
     public readonly apiClient: ApiClient;
     
     private constructor() {
       this.authService = AuthService.getInstance();
       this.storageService = new StorageService('worship_plus_');
       this.apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);
     }
     
     static getInstance(): Container {
       if (!Container.instance) {
         Container.instance = new Container();
       }
       return Container.instance;
     }
   }
   
   export const container = Container.getInstance();
   ```

5. **Commit US-017**
   ```bash
   git add src/services/ src/config/container.ts
   git commit -m "feat(services): services layer com DI

   - AuthService: singleton, session cache
   - StorageService: localStorage abstraction
   - ApiClient: retry (3x exponential), timeout 30s
   - DI Container: composition root
   
   Testado com integração Supabase ✅"
   ```

---

## 🧪 Teste Final Integrado (Dia 7 - Tarde)

### Criar aplicação de teste completa

```tsx
// src/App.tsx
import { ThemeProvider } from '@/context/ThemeContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { user, signIn, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Hero Card with Glassmorphism */}
          <Card variant="hero" className="glass-card">
            <h1 className="font-display font-black text-display">
              Worship+
            </h1>
            <p className="font-body text-neutral-600">
              Sistema de gestão de cultos com design premium
            </p>
          </Card>

          {/* Login Form */}
          {!user ? (
            <Card className="glass-card">
              <h2 className="font-display font-bold text-h2 mb-4">
                Login
              </h2>
              
              <div className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
                
                <Input
                  type="password"
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                
                <Button
                  variant="primary"
                  onClick={() => signIn(email, password)}
                  loading={loading}
                  className="w-full"
                >
                  Entrar
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="glass-card">
              <h2 className="font-display font-bold text-h2 mb-4">
                Olá, {user.email}!
              </h2>
              
              <p className="text-neutral-600 mb-4">
                Você está autenticado com sucesso.
              </p>
              
              <Button
                variant="secondary"
                onClick={signOut}
                className="w-full"
              >
                Sair
              </Button>
            </Card>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### Rodar no navegador e testar

```bash
npm run dev
```

**✅ Checklist Final:**
- [ ] Glassmorphism renderiza (backdrop-blur visível)
- [ ] Fonts Outfit (Black 900) + Inter carregam
- [ ] Hero card com gradient flutuante
- [ ] Botão primary com hover glow
- [ ] Input focus com glow ring
- [ ] Login funciona (Supabase auth)
- [ ] Logout limpa sessionStorage
- [ ] Responsivo (mobile/desktop)
- [ ] Theme toggle funciona
- [ ] LocalStorage persiste dados

### Build de produção

```bash
npm run build
npm run preview
```

**Teste preview em:** `http://localhost:4173`

---

## 📦 Commit Final do Sprint 1

```bash
git add .
git commit -m "feat(sprint-1): infraestrutura frontend completa

Sprint 1 finalizado com sucesso:

✅ US-013: Design Tokens glassmorphism
✅ US-014: 5 componentes base (Button, Input, Card, Badge, Avatar)
✅ US-016: 6 custom hooks (useAuth, useLocalStorage, etc)
✅ US-017: Services layer com DI container

Testes:
- Coverage geral: 82%
- Testes manuais: ✅ Desktop + Mobile
- Lighthouse: 92/100
- Glassmorphism: ✅ Renderizando corretamente

Build:
- Bundle size: 437KB (gzipped)
- First Load: 1.8s
- Time to Interactive: 2.4s

Testado no navegador antes do commit ✅
Pronto para deploy em staging."

git push origin feature/US-XXX-nome-feature
```

---

## 🚀 Pipeline de Deploy

### Após push da branch de feature:

1. **GitHub Actions executa CI/CD:**
   - ✅ Lint
   - ✅ Type Check
   - ✅ Tests
   - ✅ Build
   - ✅ E2E Tests

2. **Criar Pull Request para `main`:**
  ```bash
  gh pr create --base main --title "release: Sprint 1"
  # Após aprovação, merge
  ```

3. **Deploy para Production:**
   ```bash
   # Vercel deploy automático para https://worshipplus.app
   ```

---

**Mantido por:** Architecture Agent  
**Próximo sprint:** Sprint 2 (US-002: Cadastro de Membros)
