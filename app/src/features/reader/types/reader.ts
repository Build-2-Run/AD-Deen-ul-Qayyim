export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface ReadingSessionState {
  fontSize: number;
  readingMode: boolean;
  currentNodeId: string | null;
  bookmarks: string[];
  scrollPosition: number;
  isFullscreen: boolean;
}
