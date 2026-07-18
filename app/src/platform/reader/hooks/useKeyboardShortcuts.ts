import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReader } from '../useReader';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarOpen } = useReader();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          // Next/Prev logic depends on RTL/LTR and module context.
          // This is a stub for the platform.
          console.log('Navigate Left');
          break;
        case 'ArrowRight':
          console.log('Navigate Right');
          break;
        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(err));
          } else {
            document.exitFullscreen();
          }
          break;
        case 'b':
        case 'B':
          console.log('Bookmark toggled');
          break;
        case 's':
        case 'S':
          toggleSidebar();
          break;
        case 'Escape':
          if (document.fullscreenElement) document.exitFullscreen();
          if (isSidebarOpen) toggleSidebar();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleSidebar, isSidebarOpen]);
}
