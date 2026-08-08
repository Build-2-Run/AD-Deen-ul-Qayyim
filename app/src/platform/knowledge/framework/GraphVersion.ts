export interface GraphVersionInfo {
  readonly version: string;      // e.g. "1.0.0"
  readonly schemaVersion: string;// e.g. "1.0.0"
  readonly buildTimestamp: string;
  readonly environment: string;
}

export class GraphVersion {
  public static readonly CURRENT_VERSION = '1.0.0';
  public static readonly SCHEMA_VERSION = '1.0.0';

  public static getInfo(env = 'production'): GraphVersionInfo {
    return Object.freeze({
      version: this.CURRENT_VERSION,
      schemaVersion: this.SCHEMA_VERSION,
      buildTimestamp: new Date().toISOString(),
      environment: env
    });
  }
}
