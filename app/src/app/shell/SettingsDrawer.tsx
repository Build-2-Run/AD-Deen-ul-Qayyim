import { Sheet, SheetContent, SheetTrigger } from "../../design/components/Sheet";
import { IconButton } from "../../design/components/Button";
import { Icon } from "../../design/icons/Icon";
import { Stack } from "../../design/primitives/Stack";
import { Body, Label } from "../../design/typography/BasicText";
import { Heading } from "../../design/typography/Heading";
import { Flex } from "../../design/primitives/Flex";
import { Divider } from "../../design/layout/Divider";

export function SettingsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <IconButton variant="ghost" aria-label="Open settings">
          <Icon name="Settings" />
        </IconButton>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[400px]">
        <Stack space={6} className="mt-6">
          <Heading level={2} size="xl">Settings</Heading>
          
          <Stack space={4}>
            <Heading level={3} size="base">Appearance</Heading>
            <Flex align="center" justify="between">
              <Label>Theme</Label>
              <select className="bg-[var(--background)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text-primary)]">
                <option>System Default</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </Flex>
            <Divider />
          </Stack>
          
          <Stack space={4}>
            <Heading level={3} size="base">Reading Preferences</Heading>
            <Flex align="center" justify="between">
              <Label>Arabic Font Size</Label>
              <select className="bg-[var(--background)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text-primary)]">
                <option>Normal</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </Flex>
            <Flex align="center" justify="between">
              <Label>Translation Language</Label>
              <select className="bg-[var(--background)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text-primary)]">
                <option>English</option>
                <option>Urdu</option>
                <option>French</option>
              </select>
            </Flex>
            <Divider />
          </Stack>

          <Body variant="secondary" className="text-center mt-8">
            These preferences sync automatically and persist your context across modules.
          </Body>
        </Stack>
      </SheetContent>
    </Sheet>
  );
}
