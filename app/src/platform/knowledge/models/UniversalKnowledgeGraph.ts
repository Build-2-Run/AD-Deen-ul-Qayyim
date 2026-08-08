import { UniversalNode, KnowledgeDomainType } from './UniversalNode';
import { UniversalEdge } from './UniversalEdge';

export class UniversalKnowledgeGraph {
  private nodes = new Map<string, UniversalNode>();
  private edges = new Map<string, UniversalEdge>();
  private adjacencyMap = new Map<string, Set<string>>(); // nodeId -> edgeIds

  public addNode(node: UniversalNode): void {
    this.nodes.set(node.id, Object.freeze({ ...node }));
    if (!this.adjacencyMap.has(node.id)) {
      this.adjacencyMap.set(node.id, new Set());
    }
  }

  public addEdge(edge: UniversalEdge): void {
    if (!this.nodes.has(edge.sourceId) || !this.nodes.has(edge.targetId)) {
      throw new Error(
        `Cannot add edge '${edge.id}': Source '${edge.sourceId}' or Target '${edge.targetId}' does not exist.`
      );
    }

    this.edges.set(edge.id, Object.freeze({ ...edge }));
    this.adjacencyMap.get(edge.sourceId)?.add(edge.id);
    this.adjacencyMap.get(edge.targetId)?.add(edge.id);
  }

  public getNode(id: string): UniversalNode | undefined {
    return this.nodes.get(id);
  }

  public getEdge(id: string): UniversalEdge | undefined {
    return this.edges.get(id);
  }

  public getAllNodes(): ReadonlyArray<UniversalNode> {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): ReadonlyArray<UniversalEdge> {
    return Array.from(this.edges.values());
  }

  public getNodesByDomain(domain: KnowledgeDomainType): UniversalNode[] {
    return this.getAllNodes().filter(n => n.domain === domain);
  }

  public getEdgesForNode(nodeId: string): UniversalEdge[] {
    const edgeIds = this.adjacencyMap.get(nodeId);
    if (!edgeIds) return [];
    return Array.from(edgeIds).map(id => this.edges.get(id)!).filter(Boolean);
  }

  public getConnectedNodes(nodeId: string): UniversalNode[] {
    const edges = this.getEdgesForNode(nodeId);
    const connectedIds = new Set<string>();

    for (const e of edges) {
      if (e.sourceId === nodeId) connectedIds.add(e.targetId);
      if (e.targetId === nodeId || e.isBidirectional) connectedIds.add(e.sourceId);
    }

    connectedIds.delete(nodeId);
    return Array.from(connectedIds).map(id => this.nodes.get(id)!).filter(Boolean);
  }

  public findOrphanNodes(): UniversalNode[] {
    const orphans: UniversalNode[] = [];
    for (const node of this.nodes.values()) {
      const edges = this.adjacencyMap.get(node.id);
      if (!edges || edges.size === 0) {
        orphans.push(node);
      }
    }
    return orphans;
  }

  public detectCycles(): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const edges = this.getEdgesForNode(nodeId).filter(e => e.sourceId === nodeId);
      for (const edge of edges) {
        const neighbor = edge.targetId;
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of this.nodes.values()) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }
}
