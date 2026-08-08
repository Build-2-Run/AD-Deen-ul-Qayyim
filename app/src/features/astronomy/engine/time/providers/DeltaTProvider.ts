import { IDeltaTProvider } from './IDeltaTProvider';
import { IERSDeltaTProvider } from './IERSDeltaTProvider';

export class DeltaTProvider {
  private static defaultProvider: IDeltaTProvider = new IERSDeltaTProvider();

  public static setDefaultProvider(provider: IDeltaTProvider): void {
    DeltaTProvider.defaultProvider = provider;
  }

  public static getDefaultProvider(): IDeltaTProvider {
    return DeltaTProvider.defaultProvider;
  }

  public static calculateDeltaT(year: number, month: number, customProvider?: IDeltaTProvider): number {
    const provider = customProvider ?? DeltaTProvider.defaultProvider;
    return provider.calculateDeltaT(year, month);
  }
}
