import { DatasetMetadata } from './global_cities';

export const lunarMetadata: DatasetMetadata = {
  source: 'Jean Meeus Astronomical Algorithms (2nd Ed) Ch. 47 & Ch. 49 / NASA Eclipse Canon',
  publicationVersionDate: '1998 / NASA TP-2006-214141',
  units: 'Julian Day (JDE), Lunation Number k, Ecliptic Longitude/Latitude (deg), Distance (km)',
  referenceUrl: 'https://eclipse.gsfc.nasa.gov/',
  dateImported: '2026-07-22'
};

export interface LunarEphemerisReferencePoint {
  jd: number;
  expectedGeocentricLongitude: number; // deg
  expectedGeocentricLatitude: number;  // deg
  expectedDistanceKm: number;          // km
}

export interface ConjunctionReferencePoint {
  k: number;
  expectedTrueConjunctionJDE: number;
  utcDateString: string;
}

export const lunarEphemerisReferenceDataset: LunarEphemerisReferencePoint[] = [
  {
    // Meeus Chapter 47 Example 47.a: 1992 April 12 0h TD
    jd: 2448724.5,
    expectedGeocentricLongitude: 133.162655,
    expectedGeocentricLatitude: -3.229126,
    expectedDistanceKm: 368409.7
  }
];

export const conjunctionReferenceDataset: ConjunctionReferencePoint[] = [
  {
    // Meeus Chapter 49 Example 49.a: New Moon Feb 1977
    k: -283,
    expectedTrueConjunctionJDE: 2443192.65118,
    utcDateString: '1977-02-18T15:37:00Z'
  }
];
