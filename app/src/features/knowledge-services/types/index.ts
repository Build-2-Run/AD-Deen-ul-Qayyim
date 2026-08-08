import { KnowledgeNode } from '../../knowledge/types';

export interface ServiceComponentProps {
  node: KnowledgeNode;
}

export interface KnowledgeService {
  id: string;
  /**
   * Determines if this service is available for a given node.
   */
  isAvailable: (node: KnowledgeNode) => boolean;
  /**
   * The React Component that renders the action button in the ActionBar.
   */
  Component: React.ComponentType<ServiceComponentProps>;
}
