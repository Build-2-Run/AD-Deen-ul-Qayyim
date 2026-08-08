import { AstronomyTraceEvent } from '../tracing/TraceEvent';

export class EngineState {
  private traces: AstronomyTraceEvent[] = [];

  public addTrace(
    step: string,
    description: string,
    inputs?: Record<string, unknown>,
    output?: unknown,
    formula?: string
  ): void {
    this.traces.push({
      id: crypto.randomUUID(),
      step,
      description,
      inputs,
      output,
      formula,
      timestamp: Date.now()
    });
  }

  public getTraces(): AstronomyTraceEvent[] {
    return [...this.traces];
  }
}
