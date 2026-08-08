import { IDataSourceProvider, ExternalDataSource } from './IDataSourceProvider';

export class DataSourceRegistry implements IDataSourceProvider {
  private static instance: DataSourceRegistry;

  private static readonly SOURCES: ExternalDataSource[] = [
    {
      id: 'jpl-ssd',
      name: 'NASA / JPL Solar System Dynamics (Horizons API)',
      baseUrl: 'https://ssd.jpl.nasa.gov/api/horizons.api',
      primaryMirrorUrl: 'https://ssd.jpl.nasa.gov/api/horizons.api',
      fallbackMirrorUrl: 'https://ssd-api.jpl.nasa.gov/horizons.api',
      supportedFormats: ['JSON', 'SPK', 'ASCII'],
      description: 'High-precision ephemerides for solar system bodies (DE440/DE441).'
    },
    {
      id: 'iers',
      name: 'International Earth Rotation and Reference Systems Service (IERS)',
      baseUrl: 'https://datacenter.iers.org/eoppred',
      primaryMirrorUrl: 'https://datacenter.iers.org/eoppred',
      supportedFormats: ['ASCII', 'CSV'],
      description: 'Earth Orientation Parameters (EOP), Delta T, UT1-UTC corrections.'
    },
    {
      id: 'mpc',
      name: 'IAU Minor Planet Center (MPC)',
      baseUrl: 'https://www.minorplanetcenter.net/iau/MPCORB',
      primaryMirrorUrl: 'https://www.minorplanetcenter.net/iau/MPCORB',
      supportedFormats: ['ASCII', 'JSON'],
      description: 'Minor planet, asteroid, and comet orbital element datasets.'
    },
    {
      id: 'cds-vizier',
      name: 'Centre de Données astronomiques de Strasbourg (CDS VizieR)',
      baseUrl: 'https://vizier.cds.unistra.fr/viz-bin/VizieR',
      primaryMirrorUrl: 'https://vizier.cds.unistra.fr/viz-bin/VizieR',
      supportedFormats: ['TSV', 'JSON', 'VOTable'],
      description: 'Stellar catalogues (Yale Bright Star, Hipparcos, Gaia DR3, NGC, IC).'
    },
    {
      id: 'yale',
      name: 'Yale University Astronomical Observatory',
      baseUrl: 'https://tdc-www.harvard.edu/catalogs/bsc5.html',
      primaryMirrorUrl: 'https://tdc-www.harvard.edu/catalogs/bsc5.html',
      supportedFormats: ['ASCII', 'Binary'],
      description: 'Yale Bright Star Catalogue (BSC5).'
    },
    {
      id: 'celestrak',
      name: 'CelesTrak Satellite Orbit Data',
      baseUrl: 'https://celestrak.org/NORAD/elements',
      primaryMirrorUrl: 'https://celestrak.org/NORAD/elements',
      fallbackMirrorUrl: 'https://www.space-track.org/basic-spacedata',
      supportedFormats: ['TLE', '3LE', 'JSON', 'CSV'],
      description: 'NORAD Two-Line Element (TLE) satellite orbital datasets.'
    }
  ];

  public static getInstance(): DataSourceRegistry {
    if (!DataSourceRegistry.instance) {
      DataSourceRegistry.instance = new DataSourceRegistry();
    }
    return DataSourceRegistry.instance;
  }

  public getSources(): ReadonlyArray<ExternalDataSource> {
    return DataSourceRegistry.SOURCES;
  }

  public getSourceById(id: string): ExternalDataSource | undefined {
    return DataSourceRegistry.SOURCES.find(s => s.id === id.toLowerCase());
  }
}
