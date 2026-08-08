import { UniversalNode } from '../models/UniversalNode';

export class CanonicalNodeRegistry {
  private nodes = new Map<string, UniversalNode>();

  /**
   * Enforces canonical stable ID format: adq:<domain_or_module>:<entity_type>:<identifier>
   * Also accepts adq:node:<name> for legacy compatibility.
   */
  public validateStableIdFormat(id: string): boolean {
    if (!id || typeof id !== 'string') return false;
    // Must start with "adq:" and have at least 2 colon-separated segments following adq
    const pattern = /^adq:[a-zA-Z0-9\-_]+(?::[a-zA-Z0-9\-_]+)+$/;
    return pattern.test(id);
  }

  public registerNode(node: UniversalNode): void {
    if (!this.validateStableIdFormat(node.id)) {
      throw new Error(
        `Invalid canonical node ID syntax '${node.id}'. Node IDs must follow the format 'adq:<domain>:<type>:<id>'.`
      );
    }

    if (this.nodes.has(node.id)) {
      throw new Error(
        `Duplicate Node Error: Node with canonical ID '${node.id}' is already registered.`
      );
    }

    this.nodes.set(node.id, Object.freeze({ ...node }));
  }

  public getNode(id: string): UniversalNode | undefined {
    return this.nodes.get(id);
  }

  public hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  public getAllNodes(): UniversalNode[] {
    return Array.from(this.nodes.values());
  }

  public size(): number {
    return this.nodes.size;
  }
}
