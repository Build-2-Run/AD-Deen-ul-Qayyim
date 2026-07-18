export interface ReaderPreferences {
  theme: 'light' | 'dark' | 'system' | 'sepia';
  arabicFont: string;
  translationFont: string;
  arabicSize: number;
  translationSize: number;
  lineHeight: number;
  pageWidth: 'narrow' | 'medium' | 'wide' | 'full';
  textAlignment: 'left' | 'center' | 'right' | 'justify';
  showTranslation: boolean;
  showTransliteration: boolean;
  showAyahNumbers: boolean;
  showWordByWord: boolean;
  autoScroll: boolean;
  keepScreenAwake: boolean;
}

export const defaultPreferences: ReaderPreferences = {
  theme: 'system',
  arabicFont: 'uthmani',
  translationFont: 'inter',
  arabicSize: 32,
  translationSize: 16,
  lineHeight: 1.8,
  pageWidth: 'medium',
  textAlignment: 'left',
  showTranslation: true,
  showTransliteration: false,
  showAyahNumbers: true,
  showWordByWord: false,
  autoScroll: false,
  keepScreenAwake: true
};
