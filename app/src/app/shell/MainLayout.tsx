import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, PageContainer } from "../../design/layout/Containers";
import { TopNavigation } from "./TopNavigation";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileNavigation } from "./MobileNavigation";

export function MainLayout() {
  // Temporary state for testing Reader Mode toggling.
  // Eventually, this should be controlled via a global store or context (e.g. Zustand)
  // so that modules like Quran/Hadith can toggle it when the user starts reading.
  const [readingModeActive] = useState(false);

  return (
    <AppShell>
      <DesktopSidebar readingModeActive={readingModeActive} />
      
      <PageContainer>
        <TopNavigation readingModeActive={readingModeActive} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full pb-20 md:pb-0 relative z-10">
          {/* Outlet renders the matched child route (e.g., HomeExperience, Quran module, etc.) */}
          <Outlet context={{ readingModeActive }} />
        </main>
        
        <MobileNavigation readingModeActive={readingModeActive} />
      </PageContainer>
    </AppShell>
  );
}
