import { PlatformRegistry } from './PlatformRegistry';

class FeatureFlagRegistryClass extends PlatformRegistry<boolean> {
  isEnabled(featureId: string): boolean {
    return this.get(featureId) ?? false;
  }
}

export const FeatureFlagRegistry = new FeatureFlagRegistryClass();
