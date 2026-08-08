import { validateSchema } from './validate-schema';
import { validateEngine } from './validate-engine';
import { validateScholarly } from './validate-scholarly';
import { validateScenarios } from './validate-scenarios';

async function verifyAll() {
  console.log("\n🚀 Starting Mirath Verification Pipeline...\n");
  
  validateSchema();
  console.log("");
  validateEngine();
  console.log("");
  validateScholarly();
  console.log("");
  validateScenarios();
  
  console.log("\n✅ All Mirath verification steps passed successfully! Safe for production.");
}

verifyAll();
