import { describe, it, expect } from 'vitest';
import { StudyService } from './StudyService';

describe('StudyService', () => {
  it('exports searchNotes', () => {
    expect(StudyService.searchNotes).toBeDefined();
  });
});
