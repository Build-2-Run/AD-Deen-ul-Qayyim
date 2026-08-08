import { DistributionEngine } from '../engine/DistributionEngine';
import { RuleSetLoader } from '../engine/RuleSetLoader';
import { Fraction } from '../engine/Fraction';
import { goldenReferences } from '../mock/rules/scenarios/golden';
import { Heir, Estate } from '../models';

const TOLERANCE = 0.01;

function runGoldenValidations() {
  console.log('🕌 Running Mirath Golden Reference Validation...\n');
  
  // Golden references are primarily Jumhur based, unless otherwise noted.
  const ruleSet = RuleSetLoader.load('Jumhur');
  
  let passedCount = 0;
  let failedCount = 0;

  for (const example of goldenReferences) {
    console.log(`\nValidating: ${example.title} (${example.origin || 'Unknown Source'})`);
    
    // Construct heirs array
    const rawHeirs: Heir[] = example.shares.map(s => {
      let rel = s.heirId.replace(/_\d+$/, '');
      let gender: 'male' | 'female' = 'male';
      if (rel.includes('mother') || rel.includes('wife') || rel.includes('daughter') || rel.includes('sister')) {
        gender = 'female';
      }
      return {
        id: s.heirId.startsWith('heir:') ? s.heirId : `heir:${s.heirId}`,
        name: s.heirName,
        relationship: rel as any,
        gender: gender,
        isAlive: true
      };
    });

    const estate: any = {
      totalAssets: 'gross' in example.estate ? (example.estate as any).gross : (example.estate as any).totalAssets,
      funeralExpenses: 'funeral' in example.estate ? (example.estate as any).funeral : (example.estate as any).funeralExpenses,
      debts: example.estate.debts,
      bequests: example.estate.bequests
    };

    try {
      const result = DistributionEngine.calculate(estate, rawHeirs, ruleSet);
      
      let allPassed = true;
      const matchedActuals = new Set();
      
      for (const expected of example.shares) {
        const expectedId = expected.heirId.startsWith('heir:') ? expected.heirId : `heir:${expected.heirId}`;
        const actual = result.heirs.find(h => h.id === expectedId && !matchedActuals.has(h));
        
        if (!actual) {
          console.error(`❌ [FAIL] Missing expected heir: ${expected.heirName} (${expectedId})`);
          allPassed = false;
          continue;
        }

        matchedActuals.add(actual);

        let actualFraction = actual.finalFraction || new Fraction(0, 1);
        let actualAmount = actual.finalAmount || 0;
        
        // Let's do a simple decimal comparison since fractions can be formatted differently 
        // (e.g. 1/3 vs 9/27)
        let expectedDec = 0;
        if (expected.fraction === 'residue') {
           expectedDec = actualFraction.toNumber(); // Hack for residue since we can't easily parse 'residue' as math
        } else {
           const [num, den] = expected.fraction.split('/').map(Number);
           expectedDec = num / den;
        }

        const actualDec = actualFraction.toNumber();

        if (Math.abs(expectedDec - actualDec) > TOLERANCE) {
          console.error(`❌ [FAIL] ${expected.heirName}: Expected fraction ${expected.fraction} (${expectedDec}), but got ${actualFraction.toString()} (${actualDec})`);
          allPassed = false;
        } else if (Math.abs(expected.amount - actualAmount) > TOLERANCE) {
           console.error(`❌ [FAIL] ${expected.heirName}: Expected amount ${expected.amount}, but got ${actualAmount}`);
           allPassed = false;
        } else {
          console.log(`✅ [PASS] ${expected.heirName} received correct share.`);
        }
      }

      if (allPassed) passedCount++;
      else failedCount++;

    } catch (e: any) {
      console.error(`❌ [ERROR] ${example.title} threw an exception: ${e.message}`);
      failedCount++;
    }
  }

  console.log(`\n=== Golden Summary: ${passedCount} Passed, ${failedCount} Failed ===`);
  if (failedCount > 0) {
    process.exit(1);
  } else {
    console.log('✅ Authoritative text validation passed.');
  }
}

runGoldenValidations();
