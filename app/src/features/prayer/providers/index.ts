// Placeholder Provider Interfaces for the Prayer Module

export interface PrayerTimeProvider {
  id: string;
  name: string;
  getTimes(date: Date, location: any, method: any): Promise<any>;
}

export interface CalculationMethodProvider {
  id: string;
  name: string;
  getAvailableMethods(): Promise<any[]>;
}

export interface LocationProvider {
  id: string;
  name: string;
  getCurrentLocation(): Promise<any>;
  searchLocation(query: string): Promise<any[]>;
}

export interface MosqueProvider {
  id: string;
  name: string;
  findNearby(location: any, radius: number): Promise<any[]>;
}

export interface NotificationProvider {
  id: string;
  name: string;
  scheduleAdhan(prayerTime: any): Promise<void>;
}

// Note: These providers will be registered in the ExtensionRegistry in module.ts as placeholders.
