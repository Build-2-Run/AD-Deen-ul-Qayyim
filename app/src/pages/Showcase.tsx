import { useState, useEffect } from 'react';
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
