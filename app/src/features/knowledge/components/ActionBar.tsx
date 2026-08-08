import { Flex } from '../../../design/primitives/Flex';
import { ServiceRegistry } from '../../knowledge-services/registry';
import { KnowledgeNode } from '../types';

interface ActionBarProps {
  node: KnowledgeNode;
}

export function ActionBar({ node }: ActionBarProps) {
  // Query the universal registry for available services for this specific node
  const availableServices = ServiceRegistry.getAvailableServices(node);

  return (
    <Flex align="center" className="gap-2 text-[var(--text-secondary)] overflow-x-auto hide-scrollbar">
      {availableServices.map(service => {
        const ServiceComponent = service.Component;
        return <ServiceComponent key={service.id} node={node} />;
      })}
    </Flex>
  );
}
