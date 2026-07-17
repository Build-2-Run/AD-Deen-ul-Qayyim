const fs = require('fs');
const path = require('path');

const files = {
  'src/styles/index.css': `@import "tailwindcss";

@theme {
  --color-primary: var(--gold);
  --color-secondary: var(--bg-secondary);
  --color-accent: var(--gold-light);
  --color-background: var(--bg-primary);
  --color-surface: var(--bg-card);
  --color-surface-elevated: var(--bg-card-hover);
  --color-border: var(--border);

  --color-tx-primary: var(--text-primary);
  --color-tx-secondary: var(--text-secondary);

  --font-display: 'Outfit', sans-serif;
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-arabic: 'Amiri', serif;

  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.3);
  --shadow-glass: 0 0 35px rgba(224, 169, 34, 0.18);
}

@layer base {
  :root {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-card: rgba(255, 255, 255, 0.8);
    --bg-card-hover: rgba(255, 255, 255, 1);
    --gold: #c98a1a;
    --gold-light: #dfa032;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --border: rgba(0, 0, 0, 0.1);
  }

  .dark {
    --bg-primary: #0c101b;
    --bg-secondary: #101625;
    --bg-card: rgba(20, 27, 46, 0.45);
    --bg-card-hover: rgba(26, 36, 61, 0.55);
    --gold: #e0a922;
    --gold-light: #f5c75d;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.65);
    --border: rgba(255, 255, 255, 0.08);
  }

  body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
}
`,
  'src/components/ui/Button.tsx': `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-accent",
    secondary: "bg-secondary text-tx-primary hover:bg-surface-elevated border border-border",
    glass: "bg-surface backdrop-blur-md border border-border text-tx-primary hover:border-primary",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  return (
    <button className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`} {...props}>
      {children}
    </button>
  );
}
`,
  'src/components/ui/Typography.tsx': `import React from 'react';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';

interface TypographyProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
  lang?: 'en' | 'ar' | 'ur';
}

export function Typography({ variant, children, className = '', lang = 'en' }: TypographyProps) {
  const base = lang === 'ar' || lang === 'ur' ? 'font-arabic' : 'font-body';
  const variants = {
    display: "font-display text-5xl font-bold md:text-7xl",
    h1: "font-heading text-4xl font-bold md:text-5xl",
    h2: "font-heading text-3xl font-semibold md:text-4xl",
    h3: "font-heading text-2xl font-semibold md:text-3xl",
    body: "text-base md:text-lg",
    small: "text-sm",
    caption: "text-xs text-tx-secondary",
  };
  
  const Tag = (variant === 'body' || variant === 'small' || variant === 'caption') ? 'p' : (variant === 'display' ? 'h1' : variant) as any;
  return <Tag className={\`\${base} \${variants[variant]} \${className}\`}>{children}</Tag>;
}
`,
  'src/components/ui/Divider.tsx': `import React from 'react';

export function Divider({ className = '' }: { className?: string }) {
  return <div className={\`w-16 h-1 bg-gradient-to-r from-primary to-transparent rounded \${className}\`} />;
}
`,
  'src/components/ui/Spinner.tsx': `import React from 'react';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={\`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary \${className}\`}></div>
  );
}
`,
  'src/components/layout/AppContainer.tsx': `import React from 'react';

export function AppContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={\`min-h-screen bg-background text-tx-primary transition-colors duration-300 \${className}\`}>{children}</div>;
}
`,
  'src/components/layout/Section.tsx': `import React from 'react';

export function Section({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <section className={\`py-12 md:py-24 px-4 max-w-7xl mx-auto \${className}\`}>{children}</section>;
}
`,
  'src/components/layout/Stack.tsx': `import React from 'react';

export function Stack({ children, spacing = 4, className = '' }: { children: React.ReactNode, spacing?: number, className?: string }) {
  // Tailwind v4 uses arbitrary values natively well, or we can use standard classes
  return <div className={\`flex flex-col gap-4 \${className}\`}>{children}</div>;
}
`,
  'src/components/layout/Grid.tsx': `import React from 'react';

export function Grid({ children, cols = 1, mdCols = 2, lgCols = 3, gap = 6, className = '' }: { children: React.ReactNode, cols?: number, mdCols?: number, lgCols?: number, gap?: number, className?: string }) {
  return <div className={\`grid grid-cols-\${cols} md:grid-cols-\${mdCols} lg:grid-cols-\${lgCols} gap-\${gap} \${className}\`}>{children}</div>;
}
`,
  'src/components/common/KnowledgeSurface.tsx': `import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function KnowledgeSurface({ children, className = '', onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className={\`bg-surface backdrop-blur-md border border-border rounded-xl p-6 shadow-medium transition-all hover:bg-surface-elevated hover:shadow-glass hover:-translate-y-1 \${onClick ? 'cursor-pointer' : ''} \${className}\`}
    >
      {children}
    </div>
  );
}
`,
  'src/pages/Showcase.tsx': `import React, { useState, useEffect } from 'react';
import { AppContainer } from '../components/layout/AppContainer';
import { Section } from '../components/layout/Section';
import { Stack } from '../components/layout/Stack';
import { Grid } from '../components/layout/Grid';
import { Button } from '../components/ui/Button';
import { Typography } from '../components/ui/Typography';
import { Divider } from '../components/ui/Divider';
import { Spinner } from '../components/ui/Spinner';
import { KnowledgeSurface } from '../components/common/KnowledgeSurface';

export function Showcase() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <AppContainer>
      <Section>
        <div className="flex justify-between items-center mb-12">
          <Typography variant="display">ADQ Design System</Typography>
          <div className="flex gap-2">
            <Button size="sm" variant={theme === 'light' ? 'primary' : 'glass'} onClick={() => setTheme('light')}>Light</Button>
            <Button size="sm" variant={theme === 'dark' ? 'primary' : 'glass'} onClick={() => setTheme('dark')}>Dark</Button>
            <Button size="sm" variant={theme === 'system' ? 'primary' : 'glass'} onClick={() => setTheme('system')}>System</Button>
          </div>
        </div>

        <Stack spacing={12}>
          {/* Typography */}
          <div>
            <Typography variant="h2" className="mb-4">Typography</Typography>
            <Divider className="mb-6" />
            <Stack spacing={4}>
              <Typography variant="display">Display Text</Typography>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="body">Body text. Technology exists to serve knowledge.</Typography>
              <Typography variant="small">Small text for captions or metadata.</Typography>
              <Typography variant="caption">Caption text.</Typography>
            </Stack>
          </div>

          {/* Buttons */}
          <div className="mt-12">
            <Typography variant="h2" className="mb-4">Buttons</Typography>
            <Divider className="mb-6" />
            <div className="flex gap-4 items-center">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="glass">Glass</Button>
              <Spinner />
            </div>
          </div>

          {/* Knowledge Surfaces */}
          <div className="mt-12">
            <Typography variant="h2" className="mb-4">Knowledge Surfaces</Typography>
            <Divider className="mb-6" />
            <Grid cols={1} mdCols={2} lgCols={2} gap={6}>
              <KnowledgeSurface onClick={() => {}}>
                <Typography variant="h3" className="text-primary mb-2">Interactive Surface</Typography>
                <Typography variant="body" className="text-tx-secondary">This card has hover effects and is clickable.</Typography>
              </KnowledgeSurface>
              <KnowledgeSurface>
                <Typography variant="h3" className="text-primary mb-2">Static Surface</Typography>
                <Typography variant="body" className="text-tx-secondary">This card is for display only.</Typography>
              </KnowledgeSurface>
            </Grid>
          </div>
        </Stack>
      </Section>
    </AppContainer>
  );
}
`,
  'src/App.tsx': `import { Showcase } from './pages/Showcase';

export default function App() {
  return <Showcase />;
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Component generation complete.');
