import { heirRules } from '../mock/rules/heirs';
import { fixedShareRules } from '../mock/rules/fixed-shares';
import { blockingRules } from '../mock/rules/blocking';
import { asabahRules } from '../mock/rules/asabah';
import { specialCaseRules } from '../mock/rules/special-cases';
import { AnyMirathRule } from '../models';

export function validateScholarly() {
  console.log("=== Validating Mirath Scholarly Evidence ===");
  const allRules: AnyMirathRule[] = [
    ...heirRules,
    ...fixedShareRules,
    ...blockingRules,
    ...asabahRules,
    ...specialCaseRules
  ];

  let hasErrors = false;

  for (const rule of allRules) {
    // If a rule is marked as Verified, it MUST have evidence
    if (rule.reviewStatus === 'Verified') {
      const hasQuran = rule.evidence?.quran && rule.evidence.quran.length > 0;
      const hasHadith = rule.evidence?.hadith && rule.evidence.hadith.length > 0;
      const hasIjma = rule.evidence?.ijma;
      
      if (!hasQuran && !hasHadith && !hasIjma) {
        console.error(`❌ [Missing Evidence] Rule ${rule.id} is marked 'Verified' but lacks primary evidence (Quran/Hadith/Ijma).`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error("\n❌ Scholarly validation failed.");
    process.exit(1);
  } else {
    console.log("✅ Scholarly validation passed.");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateScholarly();
}
