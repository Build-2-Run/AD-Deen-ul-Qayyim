import { Flex } from "../../design/primitives/Flex";
import { Stack } from "../../design/primitives/Stack";
import { Body, Caption } from "../../design/typography/BasicText";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";
import { NavigationRegistry } from "../../platform/registry/NavigationRegistry";

export interface DesktopSidebarProps {
  readingModeActive?: boolean;
}

export function DesktopSidebar({ readingModeActive }: DesktopSidebarProps) {
  const items = NavigationRegistry.getNavigationItems();
  const location = useLocation();
  
  // Group by category manually
  const categories = items.reduce((acc, item) => {
    const cat = item.category || 'Core';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 h-full border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 overflow-y-auto shrink-0",
        {
          "-ml-64 opacity-0 pointer-events-none absolute h-full": readingModeActive,
        }
      )}
    >
      <Stack space={8} className="p-4 py-8 h-full">
        {Object.entries(categories).map(([category, catItems]) => (
          <Stack key={category} space={2}>
            <Caption className="px-3 uppercase tracking-wider">{category}</Caption>
            <Flex direction="col" className="gap-1">
              {catItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-[var(--background)]",
                      {
                        "bg-[var(--primary)] text-white hover:bg-[var(--accent)]": isActive,
                        "text-[var(--text-secondary)] hover:text-[var(--text-primary)]": !isActive,
                      }
                    )}
                  >
                    <div className={cn("flex items-center justify-center w-5 h-5", isActive ? "text-white" : "text-[var(--text-secondary)]")}>
                      {item.icon}
                    </div>
                    <Body weight={isActive ? "medium" : "normal"} variant={isActive ? "inherit" : "secondary"}>
                      {item.label}
                    </Body>
                  </NavLink>
                );
              })}
            </Flex>
          </Stack>
        ))}
      </Stack>
    </aside>
  );
}
