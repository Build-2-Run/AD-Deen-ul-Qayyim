import { ReactNode } from 'react';

export interface RouteDefinition {
  path: string;
  element: ReactNode;
  children?: RouteDefinition[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string | ReactNode;
  path: string;
  order: number;
  category?: 'Core' | 'Revelation' | 'Theology' | 'Fiqh' | 'History' | 'Science' | 'Tools';
  module: string;
}

export interface ModuleManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  icon?: string | ReactNode;
  category?: string;
  dependencies?: string[]; // Array of module IDs
  
  routes?: RouteDefinition[];
  navigation?: NavigationItem[];
  
  // Lifecycle hooks
  onInitialize?: () => Promise<void> | void;
  onDispose?: () => Promise<void> | void;
}
