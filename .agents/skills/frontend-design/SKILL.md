---
name: frontend-design
description: >-
  Guidance for distinctive, intentional visual design when building new UI or
  reshaping an existing interface. Use when the user wants to build, redesign,
  or improve a frontend with a focus on aesthetics, design systems, component
  architecture, typography, color, spacing, motion, and visual identity. Covers
  React, Vue, Svelte, HTML/CSS, and any UI framework. Activate when the user
  asks to "design a UI", "improve the look", "create a design system", "make
  it look better", or needs frontend visual guidance.
---

# Frontend Design Skill

This skill provides a structured, opinionated framework for creating visually
distinctive, production-quality frontend interfaces. It covers design systems,
component architecture, typography, color theory, spacing, motion, and the
full implementation workflow.

---

## Design Philosophy

Good frontend design is **intentional** — every visual decision carries meaning.

Core principles:
1. **Identity over convention** — Avoid generic patterns. Every project deserves a distinct visual voice.
2. **Hierarchy drives comprehension** — Users scan, not read. Make the most important thing the most obvious thing.
3. **Constraint creates beauty** — A tight, consistent design system produces better results than ad-hoc styling.
4. **Motion has meaning** — Animation should guide, not distract. Every transition should serve the user.
5. **Accessibility is quality** — Beautiful design that excludes people isn't excellent design.

---

## Design System Foundation

Always start by establishing a design system before writing components.

### Color System

```css
:root {
  /* Primary palette — pick ONE hue, derive the rest */
  --hue: 220;  /* Brand hue (0–360) */
  
  --color-brand-50:  hsl(var(--hue), 90%, 95%);
  --color-brand-100: hsl(var(--hue), 85%, 88%);
  --color-brand-200: hsl(var(--hue), 80%, 75%);
  --color-brand-300: hsl(var(--hue), 75%, 62%);
  --color-brand-400: hsl(var(--hue), 70%, 50%);  /* Primary action */
  --color-brand-500: hsl(var(--hue), 72%, 40%);
  --color-brand-600: hsl(var(--hue), 75%, 30%);
  
  /* Neutrals — slightly tinted, never pure gray */
  --color-neutral-0:   hsl(var(--hue), 10%, 100%);
  --color-neutral-50:  hsl(var(--hue), 10%, 97%);
  --color-neutral-100: hsl(var(--hue), 8%, 92%);
  --color-neutral-200: hsl(var(--hue), 7%, 82%);
  --color-neutral-500: hsl(var(--hue), 5%, 50%);
  --color-neutral-800: hsl(var(--hue), 5%, 18%);
  --color-neutral-900: hsl(var(--hue), 8%, 10%);
  
  /* Semantic tokens */
  --color-bg:      var(--color-neutral-0);
  --color-surface: var(--color-neutral-50);
  --color-border:  var(--color-neutral-100);
  --color-text:    var(--color-neutral-900);
  --color-muted:   var(--color-neutral-500);
  --color-primary: var(--color-brand-400);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:      var(--color-neutral-900);
    --color-surface: hsl(var(--hue), 8%, 14%);
    --color-border:  hsl(var(--hue), 8%, 20%);
    --color-text:    var(--color-neutral-50);
    --color-muted:   var(--color-neutral-200);
  }
}
```

### Typography Scale

```css
:root {
  /* Scale: 1.25 (Major Third) */
  --text-xs:   0.64rem;   /* 10.24px */
  --text-sm:   0.80rem;   /* 12.8px  */
  --text-base: 1.00rem;   /* 16px    */
  --text-md:   1.25rem;   /* 20px    */
  --text-lg:   1.563rem;  /* 25px    */
  --text-xl:   1.953rem;  /* 31.25px */
  --text-2xl:  2.441rem;  /* 39px    */
  --text-3xl:  3.052rem;  /* 48.8px  */
  
  /* Font families */
  --font-sans:  'Inter', 'Outfit', system-ui, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;
  
  /* Line heights */
  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Letter spacing */
  --tracking-tight:  -0.025em;
  --tracking-normal:  0;
  --tracking-wide:    0.05em;
  --tracking-widest:  0.15em;
}
```

### Spacing System

```css
:root {
  /* 4px base unit */
  --space-1:  0.25rem;   /* 4px  */
  --space-2:  0.5rem;    /* 8px  */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}
```

### Motion Tokens

```css
:root {
  --duration-instant:  50ms;
  --duration-fast:    150ms;
  --duration-normal:  250ms;
  --duration-slow:    400ms;
  --duration-slower:  600ms;
  
  --ease-out:    cubic-bezier(0, 0, 0.2, 1);
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);
  --ease-inout:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

---

## Component Patterns

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.5rem;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0 var(--color-brand-300);
}

.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 3px var(--color-brand-200);
  transform: translateY(-1px);
}

.btn-primary:active { transform: translateY(0); }
```

### Cards

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--space-6);
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}
```

---

## Layout Principles

- **Use CSS Grid** for 2D layouts (page structure, dashboards, galleries)
- **Use Flexbox** for 1D alignment (nav bars, button groups, form rows)
- **Prefer `gap`** over margin for spacing between flex/grid children
- **Container max-width**: `--container-max: min(90vw, 1200px); margin: 0 auto;`
- **Always design mobile-first**: Start with the narrowest viewport, add breakpoints upward

```css
/* Responsive grid — auto-fit, no media queries needed */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

---

## Visual Quality Checklist

Before declaring a design done, verify:

- [ ] **Typography**: Max 2 fonts; consistent size scale; no body text below 14px
- [ ] **Color contrast**: AA minimum (4.5:1 for text, 3:1 for UI elements)
- [ ] **Spacing**: Consistent use of spacing tokens; no arbitrary pixel values
- [ ] **Hover states**: Every interactive element has a visible hover state
- [ ] **Focus styles**: Keyboard users see clear focus rings
- [ ] **Loading states**: Skeletons or spinners for async content
- [ ] **Empty states**: Helpful content when there's no data
- [ ] **Error states**: Clear, actionable error messages
- [ ] **Mobile**: Layout works at 320px minimum width
- [ ] **Dark mode**: If applicable, verify all tokens shift correctly

---

## Anti-Patterns to Avoid

❌ Pure black (`#000000`) or pure white (`#ffffff`) — use slightly tinted neutrals  
❌ Generic blue (`#0000ff`) or red (`#ff0000`) for brand colors — use HSL-crafted palettes  
❌ System fonts without declaration — always specify a font stack  
❌ Fixed pixel layouts — use relative units (`rem`, `%`, `fr`, `vw`)  
❌ No visual hierarchy — make the primary action the most visually prominent  
❌ Gradient abuse — use gradients sparingly; 1–2 per page maximum  
❌ Icon-only buttons without `aria-label`  
❌ Animations longer than 600ms for UI transitions  

---

## Google Fonts Quick Start

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## Recommended Font Pairings

| Use Case | Heading | Body |
|----------|---------|------|
| SaaS / Product | Outfit | Inter |
| Editorial / Blog | Playfair Display | Source Serif 4 |
| Developer Tool | Space Grotesk | JetBrains Mono |
| Luxury / Brand | Cormorant Garamond | Jost |
| Web3 / Tech | Syne | DM Sans |
