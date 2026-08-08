
import { Flex } from "../../design/primitives/Flex";
import { Heading } from "../../design/typography/Heading";
import { SearchOverlay } from "./SearchOverlay";
import { SettingsDrawer } from "./SettingsDrawer";
import { Link } from "react-router-dom";
import { Icon } from "../../design/icons/Icon";
import { cn } from "../../utils/cn";

export interface TopNavigationProps {
  readingModeActive?: boolean;
}

export function TopNavigation({ readingModeActive }: TopNavigationProps) {
  return (
    <Flex
      asChild
      align="center"
      justify="between"
      className={cn(
        "h-16 px-4 md:px-6 border-b border-[var(--border)] bg-[var(--surface)] transition-all duration-300 z-40 sticky top-0",
        {
          "-translate-y-full opacity-0 pointer-events-none absolute w-full": readingModeActive,
        }
      )}
    >
      <header>
        <Flex align="center" className="gap-2">
          {/* Mobile hamburger placeholder - typically handled by MobileNav but good for logo alignment */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Icon name="BookOpen" variant="primary" />
            <Heading level={1} size="lg" className="hidden sm:block">
              AD-Deen-ul-Qayyim
            </Heading>
          </Link>
        </Flex>

        <Flex align="center" className="gap-2">
          <SearchOverlay />
          <SettingsDrawer />
        </Flex>
      </header>
    </Flex>
  );
}
