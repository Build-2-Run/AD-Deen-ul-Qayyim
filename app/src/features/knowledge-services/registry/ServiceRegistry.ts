import { KnowledgeService } from '../types';
import { KnowledgeNode } from '../../knowledge/types';

class Registry {
  private services: Map<string, KnowledgeService> = new Map();

  register(service: KnowledgeService) {
    this.services.set(service.id, service);
  }

  unregister(id: string) {
    this.services.delete(id);
  }

  getAvailableServices(node: KnowledgeNode): KnowledgeService[] {
    return Array.from(this.services.values()).filter(service => service.isAvailable(node));
  }

  getService(id: string): KnowledgeService | undefined {
    return this.services.get(id);
  }
}

export const ServiceRegistry = new Registry();
