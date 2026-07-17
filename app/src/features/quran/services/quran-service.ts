import { ValidatorService } from '../../../services/validator';
import { QuranNodeSchema } from '../../../schemas/quran.schema';
import type { QuranNode } from '../../../types/quran';

// We import the static JSON file directly for the frontend architecture.
// In a real full-stack app, this would be fetched from an API.
import sampleSurah from '../../../data/quran/sample-surah.json';

export class QuranService {
  static async getQuranNodes(): Promise<QuranNode[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Validate the imported JSON using Zod
      const node = ValidatorService.validate(QuranNodeSchema, sampleSurah);
      return [node];
    } catch (error) {
      console.error('Failed to validate Quran data:', error);
      throw new Error('Data validation failed gracefully.');
    }
  }
}
