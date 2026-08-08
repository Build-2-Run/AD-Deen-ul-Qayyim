import { RefractionModel, EarthEllipsoid, Epoch } from '../models';

export const twilightDefinitions = [
  { name: 'Civil Twilight', angle: 6, description: 'Sun is 6 degrees below horizon. Artificial lighting generally not required.' },
  { name: 'Nautical Twilight', angle: 12, description: 'Sun is 12 degrees below horizon. Horizon is still visible at sea.' },
  { name: 'Astronomical Twilight', angle: 18, description: 'Sun is 18 degrees below horizon. Sky is fully dark.' },
  { name: 'Islamic Fajr (Standard)', angle: 18, description: 'True dawn. The standard used by many Islamic scholars for the start of fasting.' }
];

export const atmosphericDefaults = {
  standardPressure: 1013.25, // millibars
  standardTemperature: 10, // Celsius
  lapseRate: 0.0065 // K/m
};

export const earthEllipsoids: EarthEllipsoid[] = [
  { name: 'WGS84', equatorialRadius: 6378137.0, polarRadius: 6356752.314245, flattening: 1 / 298.257223563 },
  { name: 'IERS (2003)', equatorialRadius: 6378136.6, polarRadius: 6356751.9, flattening: 1 / 298.25642 }
];

export const refractionModels: RefractionModel[] = [
  { type: 'Standard', description: 'Simple standard atmosphere refraction.' },
  { type: 'Saemundsson', description: 'Saemundsson formula for astronomical refraction.' },
  { type: 'Bennett', description: 'Bennett formula, highly accurate for low altitudes.' }
];

export const timeStandards = [
  { id: 'UTC', name: 'Coordinated Universal Time', description: 'Primary time standard by which the world regulates clocks and time.' },
  { id: 'UT1', name: 'Universal Time', description: 'Based on Earth rotation. Irregular due to polar motion and Earth\'s deceleration.' },
  { id: 'TT', name: 'Terrestrial Time', description: 'Uniform time scale for astronomical observations from Earth. Independent of Earth\'s rotation.' },
  { id: 'TAI', name: 'International Atomic Time', description: 'High-precision atomic coordinate time standard.' }
];

export const astronomicalConstants = {
  obliquityOfEclipticJ2000: 23.4392911, // degrees
  astronomicalUnitKm: 149597870.7,
  speedOfLightKmS: 299792.458,
  j2000JulianDate: 2451545.0,
  daysInJulianCentury: 36525.0,
  degreesInCircle: 360.0,
  hoursInDay: 24.0,
  minutesInHour: 60.0,
  secondsInMinute: 60.0,
  arcsecondsInDegree: 3600.0,
  pi: Math.PI
};

export const coordinateSystems = [
  { name: 'Equatorial', description: 'Based on the Earth\'s equator and poles. Uses Right Ascension and Declination.' },
  { name: 'Ecliptic', description: 'Based on the plane of the Earth\'s orbit (the ecliptic). Uses Ecliptic Longitude and Latitude.' },
  { name: 'Horizontal', description: 'Based on the observer\'s local horizon. Uses Azimuth and Altitude.' }
];

export const epochs: { id: Epoch; description: string; julianDate: number }[] = [
  { id: 'J2000.0', description: 'Standard epoch used in modern astronomy. Corresponds to Jan 1, 2000, 12:00 TT.', julianDate: 2451545.0 },
  { id: 'B1950.0', description: 'Older Besselian epoch widely used before J2000.0.', julianDate: 2433282.4235 }
];
