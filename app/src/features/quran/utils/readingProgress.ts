export interface ReadingProgress {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

const KEY = 'adq-quran-last-read';

export function saveLastRead(progress: Omit<ReadingProgress, 'timestamp'>) {
  const value: ReadingProgress = { ...progress, timestamp: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(value));
}

export function getLastRead(): ReadingProgress | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ReadingProgress;
  } catch {
    return null;
  }
}
