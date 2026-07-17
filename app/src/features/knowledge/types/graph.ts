export interface GraphAdapter {
  connect(): Promise<void>;
  query(cypher: string): Promise<any>;
}

export interface AISearchAdapter {
  searchSemantic(query: string): Promise<any[]>;
}
