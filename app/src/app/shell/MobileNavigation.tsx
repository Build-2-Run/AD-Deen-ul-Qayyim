import { Flex } from "../../design/primitives/Flex";
import { Icon } from "../../design/icons/Icon";
import { Caption } from "../../design/typography/BasicText";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Sheet, SheetContent, SheetTrigger } from "../../design/components/Sheet";
import { Stack } from "../../design/primitives/Stack";
import { Heading } from "../../design/typography/Heading";
import { NavigationRegistry } from "../../platform/registry/NavigationRegistry";

export interface MobileNavigationProps {
  readingModeActive?: boolean;
}

export function MobileNavigation({ readingModeActive }: MobileNavigationProps) {
  const items = NavigationRegistry.getNavigationItems();
  const location = useLocation();
  
  // Show first 4 in bottom bar, rest in 'More'
  const visibleItems = items.slice(0, 4);
  const moreItems = items.slice(4);

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface)] border-t border-[var(--border)] z-40 transition-transform duration-300",
        {
          "translate-y-full pointer-events-none opacity-0": readingModeActive,
        }
      )}
    >
      <Flex align="center" justify="around" className="h-full">
        {visibleItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={cn("flex flex-col items-center justify-center w-full h-full gap-1 transition-colors", {
                "text-[var(--primary)]": isActive,
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]": !isActive,
              })}
            >
              <div className={cn("flex items-center justify-center w-5 h-5", isActive ? "text-[var(--primary)]" : "text-inherit")}>
                {item.icon}
              </div>
              <Caption size="xs" variant={isActive ? "primary" : "inherit"}>{item.label}</Caption>
            </NavLink>
          );
        })}

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Icon name="Menu" size={20} />
              <Caption size="xs">More</Caption>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] rounded-t-2xl px-4 pb-8">
            <Stack space={6} className="mt-4 h-full">
              <Heading level={3}>More Modules</Heading>
              <div className="grid grid-cols-2 gap-4">
                {moreItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] active:bg-[var(--surface)] transition-colors"
                  >
                    <div className="flex items-center justify-center w-6 h-6 text-[var(--primary)]">
                      {item.icon}
                    </div>
                    <Caption weight="medium">{item.label}</Caption>
                  </NavLink>
                ))}
              </div>
            </Stack>
          </SheetContent>
        </Sheet>
      </Flex>
    </nav>
  );
}
