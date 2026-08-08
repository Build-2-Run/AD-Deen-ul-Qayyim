# ADQ Component Library

This document serves as the visual and behavioral documentation for the ADQ UI Foundation components.

All components are built using React, styled with semantic Tailwind CSS (v4) tokens, and leverage Radix UI for strict WCAG/ARIA accessibility compliance without dictating the styling.

## 1. Primitives

Primitives are the bedrock of the design system. Do not use plain HTML `<div>` for layout; use primitives to ensure consistent spacing and grid gaps.

### Box
The generic container.
```tsx
import { Box } from "@/design/primitives/Box";
<Box className="p-4 bg-red-500">Content</Box>
```

### Flex
Typed flexbox container.
```tsx
import { Flex } from "@/design/primitives/Flex";
<Flex direction="col" align="center" justify="between">...</Flex>
```

### Stack
Vertical flex with unified gap spacing (multiplier of 4px).
```tsx
import { Stack } from "@/design/primitives/Stack";
<Stack space={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

### Surface
Elevated structural layers strictly respecting Dark Mode and borders.
```tsx
import { Surface } from "@/design/primitives/Surface";
<Surface elevation="medium" rounded="lg" interactive>
  Hoverable Card
</Surface>
```

## 2. Typography

All typography is tokenized. Never use hard-coded font families. 

### ArabicText
For primary text. Automatically enforces RTL and Uthmanic/Naskh line heights.
```tsx
import { ArabicText } from "@/design/typography/ArabicText";
<ArabicText size="3xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</ArabicText>
```

### TranslationText
For LTR translations, utilizing the elegant Serif font stack.
```tsx
import { TranslationText } from "@/design/typography/TranslationText";
<TranslationText>In the name of Allah...</TranslationText>
```

### UI Text (Heading, Body)
```tsx
import { Heading, Body } from "@/design/typography/BasicText";
<Heading level={1}>Dashboard</Heading>
<Body variant="secondary">This is subtle secondary text.</Body>
```

## 3. Base Components

### Button
```tsx
import { Button, IconButton } from "@/design/components/Button";
<Button variant="primary">Calculate Zakat</Button>
<IconButton variant="ghost"><Icon name="Menu" /></IconButton>
```

### Input & Search
```tsx
import { Input, SearchInput } from "@/design/components/Input";
<SearchInput placeholder="Search Surahs..." />
```

### Tabs (Accessible via Radix UI)
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/design/components/Tabs";
<Tabs defaultValue="quran">
  <TabsList>
    <TabsTrigger value="quran">Quran</TabsTrigger>
    <TabsTrigger value="hadith">Hadith</TabsTrigger>
  </TabsList>
  <TabsContent value="quran">Surah Al-Fatiha...</TabsContent>
  <TabsContent value="hadith">Sahih Bukhari...</TabsContent>
</Tabs>
```

### Dialog (Accessible Modal)
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/design/components/Dialog";
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Settings</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Reader Settings</DialogTitle>
    </DialogHeader>
    {/* Settings form */}
  </DialogContent>
</Dialog>
```

## 4. Icons
All icons must be rendered using the unified `Icon` wrapper around Lucide React to ensure consistent stroke widths across the platform.

```tsx
import { Icon } from "@/design/icons/Icon";
<Icon name="BookOpen" size={24} variant="primary" />
```

## 5. Motion Utilities
Animations respect the user's `prefers-reduced-motion` settings automatically through standard CSS media queries defined in `index.css`.

For complex components (like Accordions or Dialogs), we utilize `tailwindcss-animate` utility classes (`animate-in`, `fade-in`, `slide-in`) combined with Radix's unmount lifecycles.

```tsx
import { transitions, animations } from "@/design/motion/transitions";
// Applied internally inside components.
```
