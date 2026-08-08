import { UniversalEdge } from '../models/UniversalEdge';
import { CanonicalNodeRegistry } from './CanonicalNodeRegistry';

export class CanonicalRelationshipRegistry {
  private edges = new Map<string, UniversalEdge>();
  private nodeRegistry: CanonicalNodeRegistry;

  constructor(nodeRegistry: CanonicalNodeRegistry) {
    this.nodeRegistry = nodeRegistry;
  }

  public registerRelationship(edge: UniversalEdge): void {
    if (this.edges.has(edge.id)) {
      throw new Error(
        `Duplicate Relationship Error: Edge with ID '${edge.id}' is already registered.`
      );
    }

    if (!this.nodeRegistry.hasNode(edge.sourceId)) {
      throw new Error(
        `Invalid Edge Endpoint Error: Source node '${edge.sourceId}' on edge '${edge.id}' does not exist in CanonicalNodeRegistry.`
      );
    }

    if (!this.nodeRegistry.hasNode(edge.targetId)) {
      throw new Error(
        `Invalid Edge Endpoint Error: Target node '${edge.targetId}' on edge '${edge.id}' does not exist in CanonicalNodeRegistry.`
      );
    }

    if (edge.weight < 0.0 || edge.weight > 1.0) {
      throw new Error(
        `Invalid Relationship Weight Error: Weight ${edge.weight} on edge '${edge.id}' must be between 0.0 and 1.0.`
      );
    }

    this.edges.set(edge.id, Object.freeze({ ...edge }));
  }

  public getRelationship(id: string): UniversalEdge | undefined {
    return this.edges.get(id);
  }

  public hasRelationship(id: string): boolean {
    return this.edges.has(id);
  }

  public getAllRelationships(): UniversalEdge[] {
    return Array.from(this.edges.values());
  }

  public size(): number {
    return this.edges.size;
  }
}
