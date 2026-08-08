export interface AstronomyTraceEvent {
  id: string;
  step: string;
  description: string;
  formula?: string;
  inputs?: Record<string, unknown>;
  output?: unknown;
  timestamp: number;
}
