export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Sunrise' | 'Midnight';
export type PrayerStatus = 'pending' | 'prayed' | 'prayed_in_congregation' | 'missed';

export interface PrayerTime {
  name: PrayerName;
  time: string; // ISO time string or formatted string
  status?: PrayerStatus;
  isNext?: boolean;
  isCurrent?: boolean;
}

export interface PrayerTimelineDay {
  date: string;
  prayers: PrayerTime[];
}

export interface PrayerGuide {
  id: string;
  title: string;
  description: string;
  category: 'Conditions' | 'Pillars' | 'Sunnah' | 'Common Mistakes' | 'General';
}
