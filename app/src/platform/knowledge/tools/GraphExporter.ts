import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';

export class GraphExporter {
  /**
   * Exports the Universal Knowledge Graph into Mermaid flowchart syntax.
   */
  public toMermaid(graph: UniversalKnowledgeGraph): string {
    const lines: string[] = ['graph TD'];

    for (const node of graph.getAllNodes()) {
      const cleanLabel = (node.names.english || node.id).replace(/["()]/g, '');
      lines.push(`  ${this.sanitizeMermaidId(node.id)}["${cleanLabel}"]`);
    }

    for (const edge of graph.getAllEdges()) {
      const src = this.sanitizeMermaidId(edge.sourceId);
      const tgt = this.sanitizeMermaidId(edge.targetId);
      lines.push(`  ${src} -->|"${edge.relationType}"| ${tgt}`);
    }

    return lines.join('\n');
  }

  /**
   * Exports the graph into Graphviz DOT format.
   */
  public toDOT(graph: UniversalKnowledgeGraph): string {
    const lines: string[] = ['digraph UniversalKnowledgeGraph {', '  rankdir=LR;'];

    for (const node of graph.getAllNodes()) {
      const label = node.names.english || node.id;
      lines.push(`  "${node.id}" [label="${label}", category="${node.category}"];`);
    }

    for (const edge of graph.getAllEdges()) {
      lines.push(`  "${edge.sourceId}" -> "${edge.targetId}" [label="${edge.relationType}"];`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Exports the graph into Cytoscape JSON format.
   */
  public toCytoscapeJSON(graph: UniversalKnowledgeGraph): string {
    const elements: any[] = [];

    for (const node of graph.getAllNodes()) {
      elements.push({
        data: {
          id: node.id,
          label: node.names.english || node.id,
          category: node.category,
          domain: node.domain
        }
      });
    }

    for (const edge of graph.getAllEdges()) {
      elements.push({
        data: {
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          label: edge.relationType,
          weight: edge.weight
        }
      });
    }

    return JSON.stringify({ elements }, null, 2);
  }

  /**
   * Exports the graph into GraphML XML format.
   */
  public toGraphML(graph: UniversalKnowledgeGraph): string {
    const lines: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">',
      '  <graph id="ADQ_Knowledge_Graph" edgedefault="directed">'
    ];

    for (const node of graph.getAllNodes()) {
      lines.push(`    <node id="${node.id}">`);
      lines.push(`      <data key="label">${node.names.english || node.id}</data>`);
      lines.push(`      <data key="category">${node.category}</data>`);
      lines.push(`    </node>`);
    }

    for (const edge of graph.getAllEdges()) {
      lines.push(`    <edge id="${edge.id}" source="${edge.sourceId}" target="${edge.targetId}">`);
      lines.push(`      <data key="relationType">${edge.relationType}</data>`);
      lines.push(`    </edge>`);
    }

    lines.push('  </graph>');
    lines.push('</graphml>');
    return lines.join('\n');
  }

  /**
   * Exports the graph into raw JSON.
   */
  public toJSON(graph: UniversalKnowledgeGraph): string {
    return JSON.stringify({
      nodes: graph.getAllNodes(),
      edges: graph.getAllEdges()
    }, null, 2);
  }

  private sanitizeMermaidId(id: string): string {
    return id.replace(/[^a-zA-Z0-9]/g, '_');
  }
}
