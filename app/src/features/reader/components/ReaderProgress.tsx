import { useEffect, useState } from 'react';

export function ReaderProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Find the scrolling container. In PageContainer it's the element itself or window.
      // Usually, window scroll is what we track for a full page.
      // But because our layout might be a flex container with overflow-y-auto, we need to track that.
      // For this prototype, we'll track the closest overflow container or window.
      const scrollable = document.querySelector('main')?.parentElement || document.documentElement;
      const scrollTop = scrollable.scrollTop;
      const scrollHeight = scrollable.scrollHeight - scrollable.clientHeight;
      
      if (scrollHeight > 0) {
        setProgress((scrollTop / scrollHeight) * 100);
      } else {
        setProgress(0);
      }
    };

    // Attach to the main scrolling element. Since PageContainer is flex-1 overflow-y-auto
    const container = document.querySelector('.overflow-y-auto') || window;
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
      <div 
        className="h-full bg-[var(--primary)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
