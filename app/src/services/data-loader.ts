import { ValidatorService } from './validator';
import { QuranNodeSchema } from '../schemas/quran.schema';
import { HadithNodeSchema } from '../schemas/hadith.schema';
import type { QuranNode } from '../types/quran';
import type { HadithNode } from '../types/hadith';

export class DataLoader {
  static async loadQuranNode(url: string): Promise<QuranNode> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    const data = await response.json();
    return ValidatorService.validate(QuranNodeSchema, data);
  }

  static async loadHadithNode(url: string): Promise<HadithNode> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    const data = await response.json();
    return ValidatorService.validate(HadithNodeSchema, data);
  }
  
  // Method meant for Node.js backend/build-time scripts
  static loadJsonSync<T>(schema: any, jsonString: string): T {
    const data = JSON.parse(jsonString);
    return ValidatorService.validate(schema, data);
  }
}
