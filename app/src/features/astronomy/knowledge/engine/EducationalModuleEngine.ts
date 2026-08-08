import { LearningModule } from '../models/knowledge-types';
import modules from '../content/educational-modules.json';

export class EducationalModuleEngine {
  private modulesMap = new Map<string, LearningModule>();

  constructor() {
    for (const m of modules as LearningModule[]) {
      this.modulesMap.set(m.id, m);
    }
  }

  public getModuleById(id: string): LearningModule | undefined {
    return this.modulesMap.get(id);
  }

  public getAllModules(): LearningModule[] {
    return (modules as LearningModule[]);
  }
}
