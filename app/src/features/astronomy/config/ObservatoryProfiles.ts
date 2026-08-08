import { IDeltaTProvider } from '../engine/time/providers/IDeltaTProvider';
import { IERSDeltaTProvider } from '../engine/time/providers/IERSDeltaTProvider';
import { PolynomialDeltaTProvider } from '../engine/time/providers/PolynomialDeltaTProvider';
import { INutationProvider } from '../engine/nutation/INutationProvider';
import { IAU1980NutationProvider } from '../engine/nutation/IAU1980NutationProvider';
import { MeeusNutationProvider } from '../engine/nutation/MeeusNutationProvider';
import { IAtmosphereModel } from '../engine/atmosphere/IAtmosphereModel';
import { StandardAtmosphereModel } from '../engine/atmosphere/StandardAtmosphereModel';
import { ObservedAtmosphereModel } from '../engine/atmosphere/ObservedAtmosphereModel';
import { AtmosphericConditions } from '../models';

export interface ObservatoryProfile {
  id: string;
  name: string;
  authority: string;
  deltaTProvider: IDeltaTProvider;
  nutationProvider: INutationProvider;
  atmosphereModel: IAtmosphereModel;
  defaultAtmosphere: AtmosphericConditions;
  precisionToleranceArcsec: number;
}

export class ObservatoryProfiles {
  public static readonly HMNAO: ObservatoryProfile = {
    id: 'HMNAO',
    name: 'Her Majesty\'s Nautical Almanac Office Profile',
    authority: 'HMNAO / UK Hydrographic Office',
    deltaTProvider: new IERSDeltaTProvider(),
    nutationProvider: new IAU1980NutationProvider(),
    atmosphereModel: new StandardAtmosphereModel(),
    defaultAtmosphere: { pressure: 1010, temperature: 10 },
    precisionToleranceArcsec: 0.1
  };

  public static readonly NOAA: ObservatoryProfile = {
    id: 'NOAA',
    name: 'NOAA Solar Calculator Profile',
    authority: 'National Oceanic & Atmospheric Administration',
    deltaTProvider: new PolynomialDeltaTProvider(),
    nutationProvider: new IAU1980NutationProvider(),
    atmosphereModel: new StandardAtmosphereModel(),
    defaultAtmosphere: { pressure: 1013.25, temperature: 15 },
    precisionToleranceArcsec: 0.5
  };

  public static readonly Diyanet: ObservatoryProfile = {
    id: 'Diyanet',
    name: 'Turkish Diyanet Observatory Profile',
    authority: 'Presidency of Religious Affairs (Türkiye)',
    deltaTProvider: new IERSDeltaTProvider(),
    nutationProvider: new IAU1980NutationProvider(),
    atmosphereModel: new ObservedAtmosphereModel(),
    defaultAtmosphere: { pressure: 1010, temperature: 10 },
    precisionToleranceArcsec: 1.0
  };

  public static readonly UmmAlQura: ObservatoryProfile = {
    id: 'UmmAlQura',
    name: 'Umm al-Qura Observatory Profile',
    authority: 'KACST / Umm al-Qura Authority',
    deltaTProvider: new IERSDeltaTProvider(),
    nutationProvider: new IAU1980NutationProvider(),
    atmosphereModel: new StandardAtmosphereModel(),
    defaultAtmosphere: { pressure: 1010, temperature: 25 },
    precisionToleranceArcsec: 0.5
  };

  public static readonly ISNA: ObservatoryProfile = {
    id: 'ISNA',
    name: 'ISNA / FCNA Observatory Profile',
    authority: 'Fiqh Council of North America',
    deltaTProvider: new PolynomialDeltaTProvider(),
    nutationProvider: new MeeusNutationProvider(),
    atmosphereModel: new StandardAtmosphereModel(),
    defaultAtmosphere: { pressure: 1010, temperature: 15 },
    precisionToleranceArcsec: 1.0
  };

  public static getProfile(id: string): ObservatoryProfile {
    switch (id.toUpperCase()) {
      case 'HMNAO': return ObservatoryProfiles.HMNAO;
      case 'NOAA': return ObservatoryProfiles.NOAA;
      case 'DIYANET': return ObservatoryProfiles.Diyanet;
      case 'UMMALQURA': return ObservatoryProfiles.UmmAlQura;
      case 'ISNA': return ObservatoryProfiles.ISNA;
      default: return ObservatoryProfiles.HMNAO;
    }
  }
}
