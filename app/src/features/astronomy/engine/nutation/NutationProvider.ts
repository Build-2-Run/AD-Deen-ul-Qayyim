import { INutationProvider, NutationResult } from './INutationProvider';
import { IAU1980NutationProvider } from './IAU1980NutationProvider';
import { JulianDate } from '../../models';

export class NutationProvider {
  private static defaultProvider: INutationProvider = new IAU1980NutationProvider();

  public static setDefaultProvider(provider: INutationProvider): void {
    NutationProvider.defaultProvider = provider;
  }

  public static getDefaultProvider(): INutationProvider {
    return NutationProvider.defaultProvider;
  }

  public static calculateNutation(jd: JulianDate, customProvider?: INutationProvider): NutationResult {
    const provider = customProvider ?? NutationProvider.defaultProvider;
    return provider.calculateNutation(jd);
  }
}
