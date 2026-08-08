import { DistributionEngine } from '../DistributionEngine';
import { RuleSetLoader } from '../RuleSetLoader';
import { Fraction } from '../Fraction';
import { workedExamples } from '../../mock/rules/scenarios/index';
import { Heir, Estate } from '../../models';

export class ScenarioRunner {
  static runAll() {
    console.log("=== Running Mirath Scenario Suite ===");
    let passed = 0;
    let failed = 0;

    for (const example of workedExamples) {
      console.log(`\nTesting Scenario: ${example.title} (${example.id})`);
      
      const rawHeirs: Heir[] = example.shares.map((s) => ({
        id: s.heirId,
        name: s.heirName,
        relationship: s.heirId.split(':')[1] as any, // mock mapping
        isAlive: true,
        gender: s.heirId.includes('wife') || s.heirId.includes('daughter') || s.heirId.includes('mother') || s.heirId.includes('sister') ? 'female' : 'male'
      }));

      const estate: Estate = {
        totalAssets: 'gross' in example.estate ? (example.estate as any).gross : (example.estate as any).totalAssets,
        funeralExpenses: 'funeral' in example.estate ? (example.estate as any).funeral : (example.estate as any).funeralExpenses,
        debts: example.estate.debts,
        bequests: example.estate.bequests
      };

      try {
        // Load Jumhur RuleSet for tests for now
        const ruleSet = RuleSetLoader.load('Jumhur');
        const result = DistributionEngine.calculate(estate, rawHeirs, ruleSet);
        let success = true;

        // Verify every expected share
        example.shares.forEach(expectedShare => {
          const calculatedHeir = result.heirs.find(h => h.id === expectedShare.heirId);
          
          if (!calculatedHeir) {
            console.error(`❌ [FAIL] Missing expected heir: ${expectedShare.heirId}`);
            success = false;
            return;
          }

          const expectedFractionStr = expectedShare.fraction.toLowerCase();

          if (expectedFractionStr === 'residue' || expectedFractionStr === 'asabah') {
            if (!calculatedHeir.isAsabah) {
              console.error(`❌ [FAIL] ${expectedShare.heirName}: Expected residue, Got none`);
              success = false;
            } else {
              console.log(`✅ [PASS] ${expectedShare.heirName} received correct fraction: residue`);
            }
          } else if (expectedFractionStr === 'none') {
            if (calculatedHeir.finalFraction || calculatedHeir.isAsabah) {
              console.error(`❌ [FAIL] ${expectedShare.heirName}: Expected none, Got ${calculatedHeir.finalFraction?.toString() || 'residue'}`);
              success = false;
            } else {
              console.log(`✅ [PASS] ${expectedShare.heirName} was correctly blocked (received none)`);
            }
          } else {
            // It's a specific fraction
            if (calculatedHeir.finalFraction) {
              const expectedFrac = Fraction.fromString(expectedFractionStr);
              if (!expectedFrac.equals(calculatedHeir.finalFraction)) {
                console.error(`❌ [FAIL] ${expectedShare.heirName}: Expected ${expectedFractionStr}, Got ${calculatedHeir.finalFraction.toString()}`);
                success = false;
              } else {
                console.log(`✅ [PASS] ${expectedShare.heirName} received correct fraction: ${expectedFractionStr}`);
              }
            } else {
              console.error(`❌ [FAIL] ${expectedShare.heirName}: Expected ${expectedFractionStr}, Got none`);
              success = false;
            }
          }
        });

        if (success) passed++;
        else failed++;
      } catch (err) {
        console.error(`❌ [ERROR] Exception during calculation: ${err}`);
        failed++;
      }
    }

    console.log(`\n=== Summary: ${passed} Passed, ${failed} Failed ===`);
    if (failed > 0) throw new Error("Scenario validation failed.");
  }
}
