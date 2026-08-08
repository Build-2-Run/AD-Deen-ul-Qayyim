export interface KaabaLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  datum: 'WGS84';
  country: string;
  city: string;
  reference: string;
  lastVerified: string;
  notes: string;
}

export const KAABA: KaabaLocation = {
  id: 'loc:kaaba',
  name: 'Kaaba',
  latitude: 21.422487,
  longitude: 39.826206,
  elevation: 277,
  datum: 'WGS84',
  country: 'Saudi Arabia',
  city: 'Makkah',
  reference: 'General Authority for Survey and Geospatial Information (GASGI)',
  lastVerified: '2026-07-22',
  notes: 'Authoritative WGS84 coordinates for the center of the Kaaba, used as the global Qibla focal point.'
};
