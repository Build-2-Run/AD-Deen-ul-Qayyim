import { heirRules } from '../mock/rules/heirs';
import { fixedShareRules } from '../mock/rules/fixed-shares';
import { blockingRules } from '../mock/rules/blocking';
import { asabahRules } from '../mock/rules/asabah';
import { specialCaseRules } from '../mock/rules/special-cases';
import { AnyMirathRule } from '../models';

export function validateSchema() {
  console.log("=== Validating Mirath Data Schema ===");
  const allRules: AnyMirathRule[] = [
    ...heirRules,
    ...fixedShareRules,
    ...blockingRules,
    ...asabahRules,
    ...specialCaseRules
  ];

  let hasErrors = false;
  const ids = new Set<string>();

  for (const rule of allRules) {
    // 1. Duplicate IDs
    if (ids.has(rule.id)) {
      console.error(`❌ [Duplicate ID] Rule ID already exists: ${rule.id}`);
      hasErrors = true;
    }
    ids.add(rule.id);

    // 2. Validate metadata
    if (!rule.reviewStatus) {
      console.error(`❌ [Missing Metadata] Rule ${rule.id} is missing reviewStatus.`);
      hasErrors = true;
    }

    if (rule.type === 'share') {
      const fractionParts = rule.fraction.split('/');
      if (fractionParts.length !== 2 || isNaN(Number(fractionParts[0])) || isNaN(Number(fractionParts[1]))) {
        console.error(`❌ [Invalid Fraction] Rule ${rule.id} has an invalid fraction: ${rule.fraction}`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error("\n❌ Schema validation failed.");
    process.exit(1);
  } else {
    console.log("✅ Schema validation passed.");
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  validateSchema();
}
