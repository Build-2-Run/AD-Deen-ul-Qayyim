import { heirRules } from '../mock/rules/heirs';
import { fixedShareRules } from '../mock/rules/fixed-shares';
import { blockingRules } from '../mock/rules/blocking';
import { asabahRules } from '../mock/rules/asabah';

export function validateEngine() {
  console.log("=== Validating Mirath Engine Logic ===");
  let hasErrors = false;

  const validHeirIds = new Set(heirRules.map(h => h.id));

  // 1. Orphan Check: Every heir referenced in fixed shares, blocking, asabah must exist
  for (const rule of fixedShareRules) {
    rule.eligibleHeirs.forEach(heirId => {
      if (!validHeirIds.has(heirId)) {
        console.error(`❌ [Orphan Reference] Fixed share rule ${rule.id} references missing heir: ${heirId}`);
        hasErrors = true;
      }
    });
  }

  for (const rule of blockingRules) {
    if (!validHeirIds.has(rule.blockedHeirId)) {
      console.error(`❌ [Orphan Reference] Blocking rule ${rule.id} references missing blocked heir: ${rule.blockedHeirId}`);
      hasErrors = true;
    }
    rule.blockedByIds.forEach(heirId => {
      if (!validHeirIds.has(heirId)) {
        console.error(`❌ [Orphan Reference] Blocking rule ${rule.id} references missing blocker heir: ${heirId}`);
        hasErrors = true;
      }
    });
  }

  for (const rule of asabahRules) {
    rule.members.forEach(heirId => {
      if (!validHeirIds.has(heirId)) {
        console.error(`❌ [Orphan Reference] Asabah rule ${rule.id} references missing heir: ${heirId}`);
        hasErrors = true;
      }
    });
  }

  if (hasErrors) {
    console.error("\n❌ Engine validation failed.");
    process.exit(1);
  } else {
    console.log("✅ Engine validation passed.");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateEngine();
}
