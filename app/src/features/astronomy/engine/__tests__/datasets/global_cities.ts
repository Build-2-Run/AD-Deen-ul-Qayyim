import { GeodesyEngine } from '../../math/Geodesy';
import { KAABA } from '../../../mock/kaaba';

export interface DatasetMetadata {
  source: string;
  publicationVersionDate: string;
  units: string;
  referenceUrl: string;
  dateImported: string;
  checksum?: string;
}

export const globalCitiesMetadata: DatasetMetadata = {
  source: 'NGA / WGS84 Reference Coordinates & GASGI Saudi Arabia',
  publicationVersionDate: 'WGS84 G1762 (2013-10-16)',
  units: 'Decimal Degrees for Latitude/Longitude, Meters for Elevation',
  referenceUrl: 'https://nsgreg.nga.mil/doc/view?id=408',
  dateImported: '2026-07-22'
};

export interface CityReferencePoint {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  referenceQiblaBearing: number; // Geodesic initial bearing to Kaaba (deg)
}

const rawCities: Array<Omit<CityReferencePoint, 'referenceQiblaBearing'>> = [
  { name: 'Makkah', country: 'Saudi Arabia', latitude: 21.422487, longitude: 39.826206, elevation: 277, timezone: 'Asia/Riyadh' },
  { name: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6112, elevation: 608, timezone: 'Asia/Riyadh' },
  { name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, elevation: 612, timezone: 'Asia/Riyadh' },
  { name: 'Jerusalem', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, elevation: 754, timezone: 'Asia/Jerusalem' },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, elevation: 23, timezone: 'Africa/Cairo' },
  { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, elevation: 30, timezone: 'Europe/Istanbul' },
  { name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, elevation: 11, timezone: 'Europe/London' },
  { name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, elevation: 10, timezone: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, elevation: 76, timezone: 'America/Toronto' },
  { name: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, elevation: 216, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, elevation: 14, timezone: 'Asia/Kolkata' },
  { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, elevation: 8, timezone: 'Asia/Jakarta' },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, elevation: 22, timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, elevation: 44, timezone: 'Asia/Tokyo' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, elevation: 19, timezone: 'Australia/Sydney' },
  { name: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241, elevation: 25, timezone: 'Africa/Johannesburg' },
  { name: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522, elevation: 23, timezone: 'Europe/Oslo' },
  { name: 'Tromsø', country: 'Norway', latitude: 69.6492, longitude: 18.9553, elevation: 8, timezone: 'Europe/Oslo' },
  { name: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426, elevation: 15, timezone: 'Atlantic/Reykjavik' },
  { name: 'Srinagar', country: 'India', latitude: 34.0837, longitude: 74.7973, elevation: 1585, timezone: 'Asia/Kolkata' }
];

export const globalCitiesDataset: CityReferencePoint[] = rawCities.map(city => {
  const p1 = { latitude: city.latitude, longitude: city.longitude };
  const p2 = { latitude: KAABA.latitude, longitude: KAABA.longitude };
  const geo = GeodesyEngine.inverse(p1, p2);
  return {
    ...city,
    referenceQiblaBearing: Number(geo.initialBearing.toFixed(4))
  };
});
