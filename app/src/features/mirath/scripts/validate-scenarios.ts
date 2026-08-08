import { ScenarioRunner } from '../engine/__tests__/ScenarioRunner';

export function validateScenarios() {
  console.log("=== Validating Mirath Scenarios ===");
  try {
    ScenarioRunner.runAll();
    console.log("✅ Scenarios validation passed.");
  } catch (err) {
    console.error("\n❌ Scenarios validation failed.");
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  validateScenarios();
}
