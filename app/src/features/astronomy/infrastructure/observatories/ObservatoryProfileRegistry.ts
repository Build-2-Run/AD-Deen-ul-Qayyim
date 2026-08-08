import { ObserverLocation } from '../../models';

export interface ObservatoryProfile {
  readonly id: string;
  readonly name: string;
  readonly organization: 'NOAA' | 'NASA' | 'HMNAO' | 'USNO' | 'JPL' | 'ISNA' | 'Diyanet' | 'Umm al-Qura' | 'Custom';
  readonly location: ObserverLocation;
  readonly defaultRefractionCorrection: boolean;
  readonly atmosphericPressureHpa: number;
  readonly temperatureCelsius: number;
  readonly description: string;
}

export class ObservatoryProfileRegistry {
  private static instance: ObservatoryProfileRegistry;

  private static readonly PROFILES: ObservatoryProfile[] = [
    {
      id: 'noaa-esrl',
      name: 'NOAA Earth System Research Laboratories (Boulder, CO)',
      organization: 'NOAA',
      location: {
        name: 'NOAA ESRL Boulder',
        coordinates: { latitude: 39.9912, longitude: -105.2638, elevation: 1655 },
        timezone: 'America/Denver'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 835.0,
      temperatureCelsius: 10.0,
      description: 'NOAA Solar Calculator primary reference location.'
    },
    {
      id: 'nasa-godard',
      name: 'NASA Goddard Space Flight Center (Greenbelt, MD)',
      organization: 'NASA',
      location: {
        name: 'NASA GSFC',
        coordinates: { latitude: 38.9959, longitude: -76.8524, elevation: 48 },
        timezone: 'America/New_York'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 1013.25,
      temperatureCelsius: 15.0,
      description: 'NASA Goddard Space Flight Center orbital & solar physics site.'
    },
    {
      id: 'hmnao-greenwich',
      name: 'HM Nautical Almanac Office (Royal Observatory Greenwich)',
      organization: 'HMNAO',
      location: {
        name: 'Royal Observatory Greenwich',
        coordinates: { latitude: 51.4769, longitude: 0.0005, elevation: 47 },
        timezone: 'Europe/London'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 1013.25,
      temperatureCelsius: 10.0,
      description: 'HMNAO Yallop moon visibility & prime meridian reference.'
    },
    {
      id: 'usno-washington',
      name: 'US Naval Observatory (Washington, D.C.)',
      organization: 'USNO',
      location: {
        name: 'USNO Washington',
        coordinates: { latitude: 38.9214, longitude: -77.0669, elevation: 84 },
        timezone: 'America/New_York'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 1013.25,
      temperatureCelsius: 15.0,
      description: 'USNO Astronomical Applications Department ephemeris site.'
    },
    {
      id: 'jpl-pasadena',
      name: 'NASA Jet Propulsion Laboratory (Pasadena, CA)',
      organization: 'JPL',
      location: {
        name: 'NASA JPL Pasadena',
        coordinates: { latitude: 34.2048, longitude: -118.1712, elevation: 350 },
        timezone: 'America/Los_Angeles'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 975.0,
      temperatureCelsius: 20.0,
      description: 'NASA JPL Horizons primary ephemeris calculation site.'
    },
    {
      id: 'makkah-clock-tower',
      name: 'Makkah Clock Tower Observatory (Mecca, Saudi Arabia)',
      organization: 'Umm al-Qura',
      location: {
        name: 'Makkah Abraj Al-Bait Observatory',
        coordinates: { latitude: 21.4189, longitude: 39.8262, elevation: 601 },
        timezone: 'Asia/Riyadh'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 950.0,
      temperatureCelsius: 30.0,
      description: 'Umm al-Qura calendar & lunar crescent sighting observatory.'
    },
    {
      id: 'isna-plainfield',
      name: 'ISNA Headquarters Observatory (Plainfield, IN)',
      organization: 'ISNA',
      location: {
        name: 'ISNA Headquarters',
        coordinates: { latitude: 39.7042, longitude: -86.3994, elevation: 232 },
        timezone: 'America/Indiana/Indianapolis'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 986.0,
      temperatureCelsius: 15.0,
      description: 'Islamic Society of North America calculation standard site.'
    },
    {
      id: 'diyanet-ankara',
      name: 'Diyanet Astronomical Observatory (Ankara, Turkey)',
      organization: 'Diyanet',
      location: {
        name: 'Diyanet Ankara',
        coordinates: { latitude: 39.9334, longitude: 32.8597, elevation: 938 },
        timezone: 'Europe/Istanbul'
      },
      defaultRefractionCorrection: true,
      atmosphericPressureHpa: 908.0,
      temperatureCelsius: 15.0,
      description: 'Presidency of Religious Affairs (Diyanet) calendar site.'
    }
  ];

  public static getInstance(): ObservatoryProfileRegistry {
    if (!ObservatoryProfileRegistry.instance) {
      ObservatoryProfileRegistry.instance = new ObservatoryProfileRegistry();
    }
    return ObservatoryProfileRegistry.instance;
  }

  public getProfiles(): ReadonlyArray<ObservatoryProfile> {
    return ObservatoryProfileRegistry.PROFILES;
  }

  public getProfileById(id: string): ObservatoryProfile | undefined {
    return ObservatoryProfileRegistry.PROFILES.find(p => p.id === id.toLowerCase());
  }
}
