import { RuleRequirement } from '../models/rules';
import { Heir } from '../models';

export class RuleMatcher {
  /**
   * Evaluates if a set of requirements are met given the current state of eligible heirs.
   */
  static evaluate(requires: RuleRequirement[], state: Heir[]): boolean {
    if (!requires || requires.length === 0) return true;

    for (const req of requires) {
      if (!this.checkRequirement(req, state)) {
        return false;
      }
    }
    return true;
  }

  private static checkRequirement(req: RuleRequirement, state: Heir[]): boolean {
    switch (req.type) {
      case 'HAS_DESCENDANT':
        return state.some(this.isDescendant);
      
      case 'NO_DESCENDANTS':
        return !state.some(this.isDescendant);
      
      case 'HAS_MALE_DESCENDANT':
        return state.some(h => this.isDescendant(h) && h.gender === 'male');
      
      case 'NO_MALE_DESCENDANTS':
        return !state.some(h => this.isDescendant(h) && h.gender === 'male');
      
      case 'EXACT_COUNT':
        if (!req.targetHeirId) throw new Error("EXACT_COUNT requires targetHeirId");
        if (req.count === undefined) throw new Error("EXACT_COUNT requires count");
        return state.filter(h => h.id === req.targetHeirId).length === req.count;
      
      case 'MIN_COUNT':
        if (!req.targetHeirId) throw new Error("MIN_COUNT requires targetHeirId");
        if (req.count === undefined) throw new Error("MIN_COUNT requires count");
        return state.filter(h => h.id === req.targetHeirId).length >= req.count;
      
      case 'NO_ASCENDANT':
        return !state.some(this.isAscendant);
      
      case 'NO_FATHER':
        return !state.some(h => h.id === 'heir:father');
        
      case 'HAS_SIBLINGS':
        return state.some(this.isSibling);
        
      case 'HAS_MULTIPLE_SIBLINGS':
        return state.filter(this.isSibling).length >= 2;
        
      case 'NO_MULTIPLE_SIBLINGS':
        return state.filter(this.isSibling).length < 2;
        
      case 'NO_SIBLINGS':
        return !state.some(this.isSibling);

      case 'HAS_FEMALE_DESCENDANT':
        return state.some(h => this.isDescendant(h) && h.gender === 'female');
        
      case 'HAS_DESCENDANT_OR_SIBLINGS':
        return state.some(this.isDescendant) || state.filter(this.isSibling).length >= 2;
        
      case 'NO_PATERNAL_GRANDFATHER':
        return !state.some(h => h.id === 'heir:paternal_grandfather');
        
      case 'NO_BROTHERS':
        return !state.some(h => h.id === 'heir:full_brother' || h.id === 'heir:consanguine_brother');
        
      case 'NO_NEPHEWS':
        return !state.some(h => h.id === 'heir:nephew_full' || h.id === 'heir:nephew_consanguine');
        
      case 'NO_FULL_SIBLINGS':
        return !state.some(h => h.id === 'heir:full_brother' || h.id === 'heir:full_sister');
        
      case 'NO_FULL_BROTHER':
        return !state.some(h => h.id === 'heir:full_brother');
        
      case 'NO_CONSANGUINE_BROTHER':
        return !state.some(h => h.id === 'heir:consanguine_brother');
        
      case 'EXACT_COUNT_UTERINE':
        if (req.count === undefined) throw new Error("EXACT_COUNT_UTERINE requires count");
        return state.filter(h => h.id === 'heir:uterine_brother' || h.id === 'heir:uterine_sister').length === req.count;
        
      case 'MIN_COUNT_UTERINE':
        if (req.count === undefined) throw new Error("MIN_COUNT_UTERINE requires count");
        return state.filter(h => h.id === 'heir:uterine_brother' || h.id === 'heir:uterine_sister').length >= req.count;

      default:
        throw new Error(`Unknown requirement type: ${(req as any).type}`);
    }
  }

  private static isDescendant(heir: Heir): boolean {
    return heir.id === 'heir:son' || 
           heir.id === 'heir:daughter' || 
           heir.id === 'heir:son_son' || 
           heir.id === 'heir:son_daughter';
  }

  private static isAscendant(heir: Heir): boolean {
    return heir.id === 'heir:father' || 
           heir.id === 'heir:mother' || 
           heir.id === 'heir:paternal_grandfather' || 
           heir.id === 'heir:maternal_grandmother' ||
           heir.id === 'heir:paternal_grandmother';
  }
  
  private static isSibling(heir: Heir): boolean {
    return heir.id === 'heir:full_brother' || 
           heir.id === 'heir:full_sister' || 
           heir.id === 'heir:consanguine_brother' || 
           heir.id === 'heir:consanguine_sister' ||
           heir.id === 'heir:uterine_brother' ||
           heir.id === 'heir:uterine_sister';
  }
}
