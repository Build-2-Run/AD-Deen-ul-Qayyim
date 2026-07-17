export function ReadingToolbar({ session, actions }: any) {
  const btnClass = "p-2 rounded-lg bg-surface hover:bg-surface-elevated text-tx-secondary hover:text-primary border border-border transition-colors text-sm font-medium";
  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border/50 mb-6">
      <button className={btnClass} onClick={actions.decreaseFont} title="Decrease Font">A-</button>
      <button className={btnClass} onClick={actions.increaseFont} title="Increase Font">A+</button>
      <div className="h-6 w-px bg-border mx-2"></div>
      <button className={btnClass} title="Copy">Copy</button>
      <button className={btnClass} onClick={() => actions.toggleBookmark('mock-id')} title="Bookmark">
        {session.bookmarks.includes('mock-id') ? 'Bookmarked' : 'Bookmark'}
      </button>
      <button className={btnClass} title="Share (Placeholder)">Share</button>
      <div className="h-6 w-px bg-border mx-2"></div>
      <button className={btnClass} onClick={actions.toggleFullscreen} title="Fullscreen">Fullscreen</button>
      <button className={btnClass} onClick={actions.toggleReadingMode} title="Reading Mode">
        {session.readingMode ? 'Exit Reading Mode' : 'Reading Mode'}
      </button>
    </div>
  );
}
