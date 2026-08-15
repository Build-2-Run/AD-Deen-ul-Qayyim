import { HijriCalendarType } from '../models';

export interface CalendarStrategyConfig {
  id: HijriCalendarType;
  name: string;
  description: string;
  isAstronomical: boolean;
  authority: string;
}

export const calendarStrategies: Record<HijriCalendarType, CalendarStrategyConfig> = {
  Astronomical: {
    id: 'Astronomical',
    name: 'Pure Astronomical',
    description: 'Based strictly on the astronomical conjunction (New Moon) in UTC.',
    isAstronomical: true,
    authority: 'Mathematical (Meeus Chapter 49)'
  },
  UmmAlQura: {
    id: 'UmmAlQura',
    name: 'Umm al-Qura',
    description: 'Based on Makkah coordinates, moonset after sunset, and conjunction occurring before sunset.',
    isAstronomical: false,
    authority: 'Government of Saudi Arabia'
  },
  Diyanet: {
    id: 'Diyanet',
    name: 'Turkish Diyanet',
    description: 'Global sighting based on precise astronomical angular separation criteria.',
    isAstronomical: false,
    authority: 'Presidency of Religious Affairs, Turkey'
  },
  ISNA: {
    id: 'ISNA',
    name: 'ISNA',
    description: 'Islamic Society of North America astronomical criteria.',
    isAstronomical: false,
    authority: 'ISNA / Fiqh Council of North America'
  },
  MoonsightingCommittee: {
    id: 'MoonsightingCommittee',
    name: 'Moonsighting Committee Worldwide',
    description: 'Based on actual confirmed global crescent sightings.',
    isAstronomical: false,
    authority: 'Moonsighting.com'
  },
  LocalObservation: {
    id: 'LocalObservation',
    name: 'Local Observation',
    description: 'Based strictly on local naked-eye crescent observation.',
    isAstronomical: false,
    authority: 'Local Islamic Authority'
  },
  ManualSighting: {
    id: 'ManualSighting',
    name: 'Manual sighting (offset)',
    description: 'Astronomical date shifted by a user-set day offset to match a local moon-sighting committee’s announcement.',
    isAstronomical: false,
    authority: 'User-configured offset'
  },
  Custom: {
    id: 'Custom',
    name: 'Custom User Configuration',
    description: 'Customized visibility criteria.',
    isAstronomical: false,
    authority: 'User Defined'
  }
};
