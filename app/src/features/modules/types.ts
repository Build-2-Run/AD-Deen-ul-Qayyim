import { ComponentType } from 'react';

export type ModuleStatus = 'Planned' | 'In Development' | 'Foundation Complete' | 'Production Ready';

export interface AppModule {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<any>;
  route: string;
  status: ModuleStatus;
  category: string;
  order: number;
  enabled: boolean;
  featureFlags?: Record<string, boolean>;
  component?: ComponentType<any>;
}
