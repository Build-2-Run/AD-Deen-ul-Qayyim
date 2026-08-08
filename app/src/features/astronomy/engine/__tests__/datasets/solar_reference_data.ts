import { DatasetMetadata } from './global_cities';

export const solarMetadata: DatasetMetadata = {
  source: 'Jean Meeus Astronomical Algorithms (2nd Ed) Chapter 25 Example 25.a',
  publicationVersionDate: '1998 (Willmann-Bell)',
  units: 'Julian Day JDE, Hours for RA, Degrees for Declination & Apparent Longitude',
  referenceUrl: 'https://www.willbell.com/',
  dateImported: '2026-07-22'
};

export interface SolarReferencePoint {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  jd: number;
  expectedRAHours: number;      // Solar Right Ascension (hours)
  expectedDecDegrees: number;   // Solar Declination (degrees)
  expectedApparentLong: number; // Apparent Longitude (degrees)
}

export const solarReferenceDataset: SolarReferencePoint[] = [
  {
    name: 'Meeus Example 25.a (1992 Oct 13 0h TD)',
    year: 1992, month: 10, day: 13, hour: 0, minute: 0, second: 0,
    jd: 2448908.5,
    expectedRAHours: 13.2252,    // 13h 13m 30.74s
    expectedDecDegrees: -7.7839,  // -7° 47' 1.9"
    expectedApparentLong: 199.9060
  }
];
