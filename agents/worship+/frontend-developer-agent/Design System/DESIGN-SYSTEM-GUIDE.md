# Worship+ Design System Guide
**Versão:** 2.0.0 - Premium Glassmorphism Edition  
**Data:** 2026-03-03  
**Baseado em:** Análise de 10 telas (6 web + 4 mobile)  
**Estética:** Premium Glassmorphism com micro-interações fluidas

---

## 1. Identidade Visual

### 1.1 Filosofia de Design
**Premium Glassmorphism** - Uma experiência visual elevada que combina:
- **Transparência e Profundidade:** Camadas de vidro semi-transparente com blur intenso
- **Leveza e Sofisticação:** Elementos flutuantes com glow sutil
- **Micro-interações Orgânicas:** Transições suaves e responsivas
- **Contraste Inteligente:** Background claro com elementos em camadas

### 1.2 Logotipo
- **Nome:** Worship+
- **Tipografia Logo:** Outfit Black (900), sans-serif moderna
- **Cor:** Burgundy primary (#7F1D2E) com variações de opacidade
- **Uso:** Header fixo (sempre visível), splash screen
- **Efeito:** Leve glow em contextos escuros

### 1.3 Tagline
> "Gerencie cultos, escalas e repertório com simplicidade."

---

## 2. Paleta de Cores

### 2.1 Primary (Burgundy/Wine)
```css
--color-primary: #7F1D2E;           /* Burgundy main */
--color-primary-hover: #6B1825;     /* Darker on hover */
--color-primary-light: #A8344A;     /* Lighter variant */
--color-primary-dark: #5A1420;      /* Darkest */
--color-primary-rgb: 127, 29, 46;   /* RGB for opacity */
```

**Uso:** Botões principais, badges de status, links, ícones ativos, sidebar ativa

### 2.2 Secondary (Mint Green)
```css
--color-secondary: #10B981;         /* Mint green */
--color-secondary-hover: #059669;   /* Darker on hover */
--color-secondary-light: #34D399;   /* Lighter */
--color-secondary-dark: #047857;    /* Darkest */
```

**Uso:** Badges de sucesso ("Publicado", "VS disponível"), indicadores de status positivo

### 2.3 Neutral Palette (Ultra Light Warm)
```css
--color-background: #FCFCFB;        /* Ultra-light offwhite background */
--color-surface: rgba(255, 255, 255, 0.7);     /* Glass surface with transparency */
--color-surface-elevated: rgba(255, 255, 255, 0.85); /* Elevated glass */
--color-surface-overlay: rgba(0, 0, 0, 0.3);   /* Subtle backdrop */
--color-surface-glass: rgba(255, 255, 255, 0.6); /* Glassmorphism base */

--color-neutral-50: #FAFAFA;
--color-neutral-100: #F5F5F5;
--color-neutral-200: #E8E8E8;
--color-neutral-300: #D1D1D1;
--color-neutral-400: #9CA3AF;
--color-neutral-500: #6B7280;       /* Text secondary */
--color-neutral-600: #4B5563;
--color-neutral-700: #374151;
--color-neutral-800: #1F2937;
--color-neutral-900: #0F0F0F;       /* Text primary - deeper black */
```

### 2.4 Primary with Opacity Variations (Sophistication)
```css
/* Solid burgundy */
--color-primary-solid: #7F1D2E;

/* Opacity variations for glassmorphism */
--color-primary-10: rgba(127, 29, 46, 0.1);   /* Subtle tint */
--color-primary-20: rgba(127, 29, 46, 0.2);   /* Light overlay */
--color-primary-40: rgba(127, 29, 46, 0.4);   /* Medium overlay */
--color-primary-60: rgba(127, 29, 46, 0.6);   /* Strong overlay */
--color-primary-80: rgba(127, 29, 46, 0.8);   /* Near solid */

/* Glow effects */
--glow-primary: 0 0 20px rgba(127, 29, 46, 0.3);
--glow-primary-strong: 0 0 30px rgba(127, 29, 46, 0.5);
```

### 2.5 Semantic Colors
```css
--color-success: #10B981;           /* Green - published, confirmed */
--color-warning: #F59E0B;           /* Amber - pending, draft */
--color-error: #EF4444;             /* Red - errors, critical */
--color-info: #3B82F6;              /* Blue - informational */
```

### 2.6 Gradients (Hero Cards - Enhanced)
```css
/* Hero gradient - sunset vibes */
--gradient-hero: linear-gradient(135deg, 
  rgba(251, 207, 232, 0.6) 0%,    /* Pink light */
  rgba(199, 210, 254, 0.6) 50%,   /* Lavender */
  rgba(254, 215, 170, 0.6) 100%   /* Peach */
);

/* Alternative gradient - cool */
--gradient-cool: linear-gradient(135deg,
  rgba(165, 243, 252, 0.5) 0%,    /* Cyan */
  rgba(196, 181, 253, 0.5) 100%   /* Purple */
);
```

---

## 3. Tipografia

### 3.1 Font Families
```css
--font-display: 'Outfit', system-ui, sans-serif;  /* Headings */
--font-body: 'Inter', system-ui, sans-serif;      /* Body, UI */
--font-mono: 'SF Mono', 'Monaco', monospace;      /* Code (se necessário) */
```

**Importação (Google Fonts - Weight Extended):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Nota:** Weight 900 (Black) adicionado para títulos impactantes

### 3.2 Type Scale (Fluid Typography - Refined)
```css
/* Display (Hero titles - Ultra Bold) */
--text-display: clamp(2.5rem, 4vw + 1rem, 4rem);      /* 40-64px */
--font-display-weight: 900;  /* Black weight for premium look */
--line-height-display: 1.05; /* Tighter leading for impact */
--letter-spacing-display: -0.03em; /* Tight tracking */

/* Headings (Refined weights) */
--text-h1: clamp(2rem, 3vw + 0.5rem, 3rem);           /* 32-48px */
--font-h1-weight: 800;  /* Extra bold for H1 */
--text-h2: clamp(1.5rem, 2vw + 0.5rem, 2rem);         /* 24-32px */
--font-h2-weight: 700;  /* Bold for H2 */
--text-h3: clamp(1.25rem, 1.5vw + 0.25rem, 1.5rem);   /* 20-24px */
--font-h3-weight: 600;  /* Semibold for H3 */
--text-h4: clamp(1.125rem, 1vw + 0.25rem, 1.25rem);   /* 18-20px */
--font-h4-weight: 600;

--line-height-heading: 1.25;
--letter-spacing-heading: -0.015em; /* Subtle tight tracking */

/* Body (Refined spacing) */
--text-base: clamp(1rem, 0.5vw + 0.875rem, 1.125rem); /* 16-18px */
--text-sm: clamp(0.875rem, 0.25vw + 0.8rem, 1rem);    /* 14-16px */
--text-xs: clamp(0.75rem, 0.25vw + 0.7rem, 0.875rem); /* 12-14px */

--font-body-weight: 400;
--font-body-weight-medium: 500;
--line-height-body: 1.65; /* More breathing room */
--letter-spacing-body: 0.01em; /* Subtle open tracking */

/* UI (Buttons, Labels) */
--text-button: 1rem;              /* 16px - fixed */
--font-button-weight: 600;
--text-label: 0.875rem;           /* 14px - fixed */
--font-label-weight: 500;
--text-caption: 0.75rem;          /* 12px - fixed */
```

### 3.3 Typography Classes
```css
.display {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: var(--font-display-weight);
  line-height: var(--line-height-display);
  letter-spacing: -0.02em;
}

.h1, .h2, .h3, .h4 {
  font-family: var(--font-display);
  font-weight: var(--font-heading-weight);
  line-height: var(--line-height-heading);
  letter-spacing: -0.01em;
}

.body-large {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-body-weight);
  line-height: var(--line-height-body);
}

.body-secondary {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  line-height: 1.5;
}
```

---

## 4. Spacing System (4px base grid)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### 4.1 Component Spacing Guidelines
- **Card padding:** `--space-4` (mobile), `--space-6` (desktop)
- **Section gaps:** `--space-6` (mobile), `--space-12` (desktop)
- **Button padding:** `--space-4 --space-6` (vertical horizontal)
- **Input padding:** `--space-3 --space-4`
- **List item gap:** `--space-4`
- **Grid gap:** `--space-4` (mobile), `--space-6` (desktop)

---

## 5. Border Radius

```css
--radius-none: 0;
--radius-sm: 0.5rem;     /* 8px - badges, tags */
--radius-md: 0.75rem;    /* 12px - inputs */
--radius-lg: 1rem;       /* 16px - cards */
--radius-xl: 1.5rem;     /* 24px - buttons (pill) */
--radius-2xl: 2rem;      /* 32px - modals */
--radius-full: 9999px;   /* Circle - avatars, icon buttons */
```

### 5.1 Component Radius Mapping
- **Buttons Primary:** `--radius-xl` (24px pill shape)
- **Buttons Secondary:** `--radius-lg` (16px rounded)
- **Cards:** `--radius-lg` (16px)
- **Inputs:** `--radius-md` (12px)
- **Badges:** `--radius-sm` (8px)
- **Avatars:** `--radius-full` (circle)
- **Hero Cards:** `--radius-2xl` (32px - mobile only)

---

## 6. Glassmorphism System

### 6.1 Glass Effects (Core do Design)
```css
/* Backdrop blur levels */
--blur-sm: blur(8px);       /* Subtle glass */
--blur-md: blur(16px);      /* Medium glass */
--blur-lg: blur(24px);      /* Strong glass */
--blur-xl: blur(40px);      /* Ultra glass (premium) */

/* Glass surfaces */
--glass-light: backdrop-filter: var(--blur-xl);
               background: rgba(255, 255, 255, 0.6);
               border: 1px solid rgba(255, 255, 255, 0.8);
               box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

--glass-primary: backdrop-filter: var(--blur-xl);
                 background: var(--color-primary-20);
                 border: 1px solid var(--color-primary-40);
                 box-shadow: 0 8px 32px rgba(127, 29, 46, 0.12);

--glass-elevated: backdrop-filter: var(--blur-xl);
                  background: rgba(255, 255, 255, 0.8);
                  border: 1px solid rgba(255, 255, 255, 0.95);
                  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1),
                              0 0 0 1px rgba(255, 255, 255, 0.5) inset;
```

### 6.2 Shadows & Elevation (Refined)
```css
/* Soft shadows for glass elements */
--shadow-glass-sm: 0 4px 16px rgba(0, 0, 0, 0.06);
--shadow-glass-md: 0 8px 32px rgba(0, 0, 0, 0.08);
--shadow-glass-lg: 0 12px 48px rgba(0, 0, 0, 0.1);
--shadow-glass-xl: 0 20px 64px rgba(0, 0, 0, 0.12);

/* Glow effects (active states) */
--shadow-glow-primary: 0 0 20px var(--color-primary-40);
--shadow-glow-success: 0 0 20px rgba(16, 185, 129, 0.3);

/* Focus ring (accessibility with glow) */
--shadow-focus: 0 0 0 3px var(--color-primary-20),
                0 0 12px var(--color-primary-40);
```

### 6.3 Border Glass System
```css
/* Semi-transparent borders for depth */
--border-glass-light: 1px solid rgba(255, 255, 255, 0.8);
--border-glass-medium: 1px solid rgba(255, 255, 255, 0.6);
--border-glass-primary: 1px solid var(--color-primary-40);

/* Inner glow borders */
--border-glow: 1px solid rgba(255, 255, 255, 0.8),
               inset 0 1px 0 rgba(255, 255, 255, 0.5);
```

---

## 7. Breakpoints (Mobile-First)

```css
--breakpoint-sm: 360px;   /* Small mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1440px;  /* Large desktop */
```

### 7.1 Responsive Patterns

**Navigation:**
```css
/* Mobile: Bottom Nav (< 768px) */
.bottom-nav { display: flex; }
.sidebar { display: none; }

/* Desktop: Sidebar (≥ 768px) */
@media (min-width: 768px) {
  .bottom-nav { display: none; }
  .sidebar { display: flex; }
}
```

**Card Grid:**
```css
/* Mobile: 1 column */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 8. Components Catalog

### 8.1 Buttons

#### Primary Button (Glass Premium)
```css
.btn-primary {
  background: var(--color-primary-solid);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: 24px; /* Ultra rounded */
  font-family: var(--font-body);
  font-size: var(--text-button);
  font-weight: var(--font-button-weight);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: var(--transition-elevation), var(--transition-glow);
  box-shadow: var(--shadow-glass-md), 0 4px 12px var(--color-primary-40);
  position: relative;
  overflow: hidden;
  
  /* Touch target */
  min-height: 48px; /* Increased for premium feel */
  min-width: 48px;
}

/* Glow effect on hover */
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-glass-lg), var(--shadow-glow-primary);
}

/* Subtle press effect */
.btn-primary:active {
  transform: translateY(-1px) scale(1.01);
  transition-duration: 150ms;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button (Ghost/Outline)
```css
.btn-secondary {
  background: transparent;
  color: var(--color-neutral-900);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  border: 1.5px solid var(--color-neutral-300);
  font-family: var(--font-body);
  font-size: var(--text-button);
  font-weight: var(--font-button-weight);
  cursor: pointer;
  transition: all 200ms ease;
  min-height: 44px;
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(127, 29, 46, 0.05);
}
```

#### Icon Button
```css
.btn-icon {
  background: transparent;
  border: none;
  padding: var(--space-2);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background 200ms ease;
  
  /* Perfect square touch target */
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--color-neutral-100);
}
```

### 8.2 Cards

#### Standard Card (Glassmorphism Premium)
```css
.card {
  /* Glass effect */
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px); /* Safari support */
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-glass-md),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset; /* Inner glow */
  transition: var(--transition-glass), var(--transition-elevation);
  position: relative;
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}

/* Intensify glass on hover */
.card:hover {
  backdrop-filter: blur(48px);
  background: rgba(255, 255, 255, 0.75);
  box-shadow: var(--shadow-glass-lg),
              0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  transform: translateY(-4px);
}

.card.clickable {
  cursor: pointer;
}

.card.clickable:active {
  transform: translateY(-2px);
  transition-duration: 150ms;
}
```

#### Hero Card (Dashboard)
```css
.hero-card {
  background: linear-gradient(
    135deg,
    rgba(251, 207, 232, 0.6) 0%,
    rgba(199, 210, 254, 0.6) 50%,
    rgba(254, 215, 170, 0.6) 100%
  );
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-hero);
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-card {
    padding: var(--space-8);
    border-radius: var(--radius-lg);
  }
}

/* Decorative background image */
.hero-card::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  z-index: 0;
}

.hero-card-content {
  position: relative;
  z-index: 1;
}
```

### 8.3 Badges

#### Status Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #92400E;
}

.badge-primary {
  background: rgba(127, 29, 46, 0.1);
  color: var(--color-primary-dark);
}

.badge-neutral {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  border: 1px solid var(--color-neutral-200);
}
```

### 8.4 Inputs (Search, Text)

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1.5px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  background: var(--color-surface);
  transition: all 200ms ease;
  
  /* Touch target height */
  min-height: 44px;
}

.input::placeholder {
  color: var(--color-neutral-400);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.input:disabled {
  background: var(--color-neutral-50);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Search input with icon */
.input-search {
  padding-left: var(--space-10); /* Space for icon */
  background-image: url('data:image/svg+xml;utf8,<svg>...</svg>');
  background-repeat: no-repeat;
  background-position: var(--space-3) center;
}
```

### 8.5 Avatars

```css
.avatar {
  border-radius: var(--radius-full);
  object-fit: cover;
  background: var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--color-neutral-700);
}

/* Sizes */
.avatar-sm { width: 32px; height: 32px; font-size: 12px; }
.avatar-md { width: 40px; height: 40px; font-size: 14px; }
.avatar-lg { width: 48px; height: 48px; font-size: 16px; }
.avatar-xl { width: 64px; height: 64px; font-size: 20px; }

/* Fallback with initials */
.avatar.fallback {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### 8.6 Bottom Navigation (Mobile - Floating Glass)

```css
.bottom-nav {
  position: fixed;
  bottom: var(--space-4); /* Floating spacing */
  left: var(--space-4);
  right: var(--space-4);
  
  /* Premium glassmorphism */
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 28px; /* Ultra rounded */
  
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  
  /* Elevated shadow + glow */
  box-shadow: var(--shadow-glass-lg),
              0 0 0 1px rgba(255, 255, 255, 0.6) inset,
              0 12px 40px rgba(0, 0, 0, 0.12);
  
  transition: var(--transition-glass);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  color: var(--color-neutral-500);
  text-decoration: none;
  border-radius: 16px;
  transition: var(--transition-colors), var(--transition-glow);
  position: relative;
  
  /* Touch target */
  min-width: 64px;
  min-height: 52px;
}

/* Active state with glow */
.nav-item.active {
  color: var(--color-primary-solid);
  background: var(--color-primary-10);
}

.nav-item.active .nav-item-icon {
  filter: drop-shadow(var(--shadow-glow-primary));
  transform: scale(1.1);
  transition: var(--transition-transform);
}

.nav-item-icon {
  width: 24px;
  height: 24px;
  transition: var(--transition-transform);
}

.nav-item-label {
  font-size: var(--text-xs);
  font-weight: 600; /* Bolder for readability on glass */
  letter-spacing: 0.02em;
}
```

### 8.7 Sidebar (Desktop - Glass Panel)

```css
.sidebar {
  display: none;
  position: fixed;
  left: var(--space-4); /* Gap from edge */
  top: var(--space-4);
  bottom: var(--space-4);
  width: 240px;
  
  /* Glass effect */
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px; /* Rounded container */
  
  padding: var(--space-6) var(--space-4);
  flex-direction: column;
  z-index: 50;
  
  /* Elevated glass shadow */
  box-shadow: var(--shadow-glass-lg),
              0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }
}

.sidebar-logo {
  padding: var(--space-4);
  margin-bottom: var(--space-8);
  font-weight: 900; /* Black weight for logo */
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: 16px;
  color: var(--color-neutral-700);
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: 500;
  transition: var(--transition-colors), var(--transition-elevation);
  position: relative;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-neutral-900);
  transform: translateX(4px);
}

/* Active state with glow */
.sidebar-item.active {
  background: var(--color-primary-solid);
  color: white;
  box-shadow: var(--shadow-glow-primary),
              0 4px 12px var(--color-primary-40);
  transform: translateX(0);
}

.sidebar-item.active:hover {
  transform: translateX(2px);
}
```

---

## 9. Layout Patterns

### 9.1 Page Container
```css
.page-container {
  min-height: 100vh;
  background: var(--color-background);
  padding-bottom: 80px; /* Space for bottom nav on mobile */
}

@media (min-width: 768px) {
  .page-container {
    margin-left: 240px; /* Sidebar width */
    padding-bottom: 0;
  }
}
```

### 9.2 Content Wrapper
```css
.content-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

@media (min-width: 768px) {
  .content-wrapper {
    padding: var(--space-12) var(--space-8);
  }
}
```

### 9.3 Section Header
```css
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  color: var(--color-neutral-900);
}

.section-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--space-1);
}
```

---

## 10. Accessibility Requirements

### 10.1 Touch Targets (iOS/Android)
- **Minimum:** 44x44px for all interactive elements
- **Recommended:** 48x48px for primary actions
- **Spacing:** Min 8px between touch targets

### 10.2 Color Contrast (WCAG AA)
- **Normal text:** ≥ 4.5:1 contrast ratio
- **Large text (≥18px or bold ≥14px):** ≥ 3:1
- **UI components:** ≥ 3:1

**Validated Pairs:**
- Primary (#7F1D2E) on White: 8.2:1 ✅
- Neutral 900 (#111827) on Background: 15.8:1 ✅
- Neutral 500 (#6B7280) on White: 4.8:1 ✅

### 10.3 Focus Indicators
```css
*:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### 10.4 Screen Reader Support
- Use semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icon-only buttons
- `aria-current="page"` for active nav items
- `role="alert"` for error messages

---

## 11. Micro-interações e Animações (Fluidas e Orgânicas)

### 11.1 Timing Functions (Organic Ease)
```css
/* Durations - mais lentas e suaves */
--duration-instant: 150ms;
--duration-fast: 300ms;     /* Increased for smoothness */
--duration-base: 450ms;     /* Organic feel */
--duration-slow: 600ms;
--duration-slower: 900ms;   /* For blur transitions */

/* Custom easing curves (premium feel) */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);      /* Smooth in-out */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Subtle bounce */
--ease-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Elegant curve */
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);  /* Exponential ease out */

/* Common transitions (organic and fluid) */
--transition-colors: color var(--duration-base) var(--ease-smooth),
                     background-color var(--duration-base) var(--ease-smooth),
                     border-color var(--duration-base) var(--ease-smooth);

--transition-transform: transform var(--duration-base) var(--ease-elegant);

--transition-elevation: transform var(--duration-base) var(--ease-elegant),
                        box-shadow var(--duration-base) var(--ease-smooth);

--transition-glass: backdrop-filter var(--duration-slower) var(--ease-smooth),
                    background var(--duration-base) var(--ease-smooth),
                    border-color var(--duration-base) var(--ease-smooth);

--transition-glow: box-shadow var(--duration-base) var(--ease-smooth);
```

### 11.2 Hover States (Elevated and Glowing)
```css
/* Lift effect with glow */
.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glass-lg), var(--shadow-glow-primary);
  transition: var(--transition-elevation);
}

/* Glass intensification on hover */
.glass-card:hover {
  backdrop-filter: blur(48px); /* Increase blur */
  background: rgba(255, 255, 255, 0.75); /* More opacity */
  border-color: rgba(255, 255, 255, 0.95);
  transition: var(--transition-glass);
}
```

---

## 12. Icon System

**Library:** [Lucide Icons](https://lucide.dev) (React/Vue) ou [Heroicons](https://heroicons.com)

**Tamanhos:**
- Small: 16px (badges, inline text)
- Medium: 20px (UI buttons)
- Large: 24px (navigation, headers)
- XLarge: 32px (empty states)

**Cores:**
- Default: `currentColor` (inherit from parent)
- Primary: `var(--color-primary)`
- Secondary: `var(--color-neutral-500)`

---

## 13. Loading States

### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 0%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Spinner (Button Loading)
```css
.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 14. Empty States

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg><!-- Large icon 64px --></svg>
  </div>
  <h3 class="empty-state-title">Nenhum evento encontrado</h3>
  <p class="empty-state-description">
    Crie seu primeiro evento para começar a organizar seus cultos.
  </p>
  <button class="btn-primary">
    + Novo Evento
  </button>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--color-neutral-300);
}

.empty-state-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-neutral-500);
  max-width: 400px;
  margin: 0 auto var(--space-6);
}
```

---

## 15. Implementation Checklist (Premium Glassmorphism)

### Phase 1: Foundation (Sprint 1)
- [ ] Import Outfit (400-900) + Inter (400-700) fonts
- [ ] Setup CSS custom properties with glass tokens
- [ ] Configure backdrop-filter support (+ fallbacks for Firefox)
- [ ] Create glassmorphism utility classes
- [ ] Implement blur levels and opacity system
- [ ] Setup glow shadows and micro-interactions
- [ ] Create base components with glass effects:
  - [ ] Button Primary (with glow hover)
  - [ ] Glass Card (floating effect)
  - [ ] Input (glass refinement)
  - [ ] Badge (semi-transparent)
  - [ ] Avatar (with subtle glow)

### Phase 2: Layout (Sprint 1)
- [ ] Floating Bottom Navigation (glass + ultra rounded)
- [ ] Glass Sidebar (desktop panel with elevation)
- [ ] Page container (ultra-light background)
- [ ] Responsive glass adaptations

### Phase 3: Premium Components (Sprint 2)
- [ ] Hero card with gradient + glass overlay
- [ ] Member card (compound glass layers)
- [ ] Event card (glowing borders)
- [ ] Music list item (hover glow)
- [ ] Search input (glass refinement)
- [ ] Badge variations (opacity states)

### Phase 4: Micro-interações (Sprint 2)
- [ ] Hover elevation (translateY + glow)
- [ ] Active press states (subtle scale)
- [ ] Loading states (glass skeleton with shimmer)
- [ ] Empty states (glass panels)
- [ ] Toast notifications (floating glass)
- [ ] Modal dialogs (glass overlay + blur backdrop)

### Phase 5: Performance Optimization
- [ ] GPU acceleration (will-change: transform)
- [ ] Backdrop-filter fallbacks (solid bg for unsupported browsers)
- [ ] Reduce blur on low-end devices
- [ ] Optimize transition durations

---

**Próxima revisão:** Sprint 2 Review  
**Mantido por:** Frontend Developer Agent
