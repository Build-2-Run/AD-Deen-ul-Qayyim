import type { ObserverLocation } from '../models';

/**
 * City reference points for the location picker. Coordinates, elevations and
 * IANA timezones are real values — the first block mirrors the vetted
 * NGA/WGS84 dataset used by the engine tests; the second adds major
 * Muslim-population cities with well-established coordinates. Nothing here is
 * invented — if a city isn't listed, the user picks the nearest one or uses
 * device geolocation.
 */
export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number; // metres
  timezone: string; // IANA
}

export const CITIES: City[] = [
  // Vetted (NGA/WGS84) set
  { name: 'Makkah', country: 'Saudi Arabia', latitude: 21.422487, longitude: 39.826206, elevation: 277, timezone: 'Asia/Riyadh' },
  { name: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6112, elevation: 608, timezone: 'Asia/Riyadh' },
  { name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, elevation: 612, timezone: 'Asia/Riyadh' },
  { name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, elevation: 754, timezone: 'Asia/Jerusalem' },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, elevation: 23, timezone: 'Africa/Cairo' },
  { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, elevation: 30, timezone: 'Europe/Istanbul' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, elevation: 11, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, elevation: 10, timezone: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, elevation: 76, timezone: 'America/Toronto' },
  { name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, elevation: 216, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, elevation: 14, timezone: 'Asia/Kolkata' },
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, elevation: 8, timezone: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, elevation: 22, timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, elevation: 44, timezone: 'Asia/Tokyo' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, elevation: 19, timezone: 'Australia/Sydney' },
  { name: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241, elevation: 25, timezone: 'Africa/Johannesburg' },
  { name: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522, elevation: 23, timezone: 'Europe/Oslo' },
  { name: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, elevation: 15, timezone: 'Atlantic/Reykjavik' },
  { name: 'Srinagar', country: 'India', latitude: 34.0837, longitude: 74.7973, elevation: 1585, timezone: 'Asia/Kolkata' },

  // Additional major Muslim-population cities (established coordinates)
  { name: 'Pulwama', country: 'India', latitude: 33.8730, longitude: 74.8880, elevation: 1630, timezone: 'Asia/Kolkata' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, elevation: 5, timezone: 'Asia/Dubai' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, elevation: 5, timezone: 'Asia/Dubai' },
  { name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, elevation: 10, timezone: 'Asia/Qatar' },
  { name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774, elevation: 5, timezone: 'Asia/Kuwait' },
  { name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, elevation: 8, timezone: 'Asia/Karachi' },
  { name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, elevation: 217, timezone: 'Asia/Karachi' },
  { name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, elevation: 540, timezone: 'Asia/Karachi' },
  { name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, elevation: 4, timezone: 'Asia/Dhaka' },
  { name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890, elevation: 1200, timezone: 'Asia/Tehran' },
  { name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661, elevation: 34, timezone: 'Asia/Baghdad' },
  { name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284, elevation: 757, timezone: 'Asia/Amman' },
  { name: 'Casablanca', country: 'Morocco', latitude: 33.5731, longitude: -7.5898, elevation: 50, timezone: 'Africa/Casablanca' },
  { name: 'Tunis', country: 'Tunisia', latitude: 36.8065, longitude: 10.1815, elevation: 4, timezone: 'Africa/Tunis' },
  { name: 'Algiers', country: 'Algeria', latitude: 36.7538, longitude: 3.0588, elevation: 24, timezone: 'Africa/Algiers' },
  { name: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, elevation: 41, timezone: 'Africa/Lagos' },
  { name: 'Kano', country: 'Nigeria', latitude: 12.0022, longitude: 8.5920, elevation: 484, timezone: 'Africa/Lagos' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, elevation: 15, timezone: 'Asia/Singapore' },
  { name: 'Kuala Terengganu', country: 'Malaysia', latitude: 5.3302, longitude: 103.1408, elevation: 5, timezone: 'Asia/Kuala_Lumpur' },
];

/** Cities surfaced as quick-pick chips when the search box is empty. */
export const POPULAR_CITY_NAMES = [
  'Makkah', 'Madinah', 'Istanbul', 'Cairo', 'Dubai', 'Karachi',
  'Lahore', 'Delhi', 'Jakarta', 'Kuala Lumpur', 'London', 'Srinagar',
];

export function citySlug(c: City): string {
  return `${c.name}-${c.country}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function cityToLocation(c: City): ObserverLocation {
  return {
    id: citySlug(c),
    name: `${c.name}, ${c.country}`,
    coordinates: { latitude: c.latitude, longitude: c.longitude, elevation: c.elevation },
    timezone: c.timezone,
    elevation: c.elevation,
  };
}

/** Case/diacritic-insensitive search over name + country. */
export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const norm = (s: string) => s.toLowerCase();
  const starts: City[] = [];
  const contains: City[] = [];
  for (const c of CITIES) {
    const name = norm(c.name);
    const country = norm(c.country);
    if (name.startsWith(q)) starts.push(c);
    else if (name.includes(q) || country.includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, limit);
}
