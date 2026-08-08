import { PrayerGuide, PrayerTimelineDay } from '../models';

export const mockPrayerTimeline: PrayerTimelineDay = {
  date: new Date().toISOString(),
  prayers: [
    { name: 'Fajr', time: '04:15 AM', status: 'prayed' },
    { name: 'Sunrise', time: '05:45 AM' },
    { name: 'Dhuhr', time: '01:00 PM', status: 'missed' },
    { name: 'Asr', time: '04:30 PM', isCurrent: true },
    { name: 'Maghrib', time: '07:15 PM', isNext: true },
    { name: 'Isha', time: '08:45 PM', status: 'pending' }
  ]
};

export const mockPrayerGuides: PrayerGuide[] = [
  {
    id: 'guide:pillars',
    title: 'The Pillars of Prayer (Arkan)',
    description: 'The fundamental actions of prayer. If any of these are omitted, intentionally or out of forgetfulness, the prayer is invalid.',
    category: 'Pillars'
  },
  {
    id: 'guide:conditions',
    title: 'Conditions of Prayer (Shurut)',
    description: 'The requirements that must be met before beginning the prayer, such as purification, facing the Qibla, and covering the awrah.',
    category: 'Conditions'
  },
  {
    id: 'guide:sunnah',
    title: 'Sunnah Acts of Prayer',
    description: 'The recommended acts in prayer. Omitting them does not invalidate the prayer, but performing them yields greater reward.',
    category: 'Sunnah'
  },
  {
    id: 'guide:mistakes',
    title: 'Common Mistakes in Prayer',
    description: 'A comprehensive guide to common errors made during Wudu and Salah, and how to rectify them.',
    category: 'Common Mistakes'
  }
];
