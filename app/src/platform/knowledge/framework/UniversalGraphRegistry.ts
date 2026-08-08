import { ModuleGraphIntegration } from './ModuleGraphIntegration';

export class UniversalGraphRegistry {
  private static instance: UniversalGraphRegistry;
  private modules = new Map<string, ModuleGraphIntegration>();

  public static getInstance(): UniversalGraphRegistry {
    if (!UniversalGraphRegistry.instance) {
      UniversalGraphRegistry.instance = new UniversalGraphRegistry();
    }
    return UniversalGraphRegistry.instance;
  }

  public registerModule(integration: ModuleGraphIntegration): void {
    const moduleId = integration.getModuleId();
    if (this.modules.has(moduleId)) {
      throw new Error(
        `Duplicate Module Integration Error: Module integration '${moduleId}' is already registered.`
      );
    }

    this.modules.set(moduleId, integration);
  }

  public getOrderedIntegrations(): ModuleGraphIntegration[] {
    return Array.from(this.modules.values()).sort(
      (a, b) => a.getPriority() - b.getPriority()
    );
  }

  public clear(): void {
    this.modules.clear();
  }

  public getModule(moduleId: string): ModuleGraphIntegration | undefined {
    return this.modules.get(moduleId);
  }

  public size(): number {
    return this.modules.size;
  }
}
