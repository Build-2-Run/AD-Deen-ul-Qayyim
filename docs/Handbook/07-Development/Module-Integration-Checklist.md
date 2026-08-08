# ADQ Module Integration Developer Checklist

**Phase**: 10B.2B — Developer Checklist & Audit Protocol  
**Status**: Mandatory Quality Checklist  
**Date**: 2026-07-22  
**Target Audience**: Feature Module Developers

---

## Pre-Integration Audit Checklist

- [ ] **Data Source Audit**: Has the underlying feature repository or dataset been inspected? Is it the single source of truth?
- [ ] **Zero Data Duplication**: Does the integration generate nodes dynamically without duplicating raw content files into hardcoded static strings?
- [ ] **No Schema Modification**: Does the integration avoid modifying existing feature repository interfaces or models?
- [ ] **No Engine Leakage**: Is feature logic kept inside feature facades (`src/features/`), keeping the platform integration file (`src/platform/knowledge/integrations/`) focused purely on node and edge registration?

---

## Node & Relationship Construction Checklist

- [ ] **Canonical ID Syntax**: Do all node IDs follow `adq:<module>:<type>:<id>` format?
- [ ] **Immutability Enforcement**: Is every registered node and edge object frozen (`Object.isFrozen`)?
- [ ] **Multilingual Titles**: Are both `english` and `arabic` names supplied for every node?
- [ ] **Authenticity Metadata**: Is `authenticity` (grade + verificationStatus) supplied for every node?
- [ ] **Provenance Metadata**: Is `provenance` (creator, version, lastUpdated, license) supplied for every node?
- [ ] **14 Fundamental Questions**: Are core fundamental questions supplied for major concept nodes?
- [ ] **Valid Relationship Endpoints**: Do all relationship edges reference source and target node IDs that exist in `CanonicalNodeRegistry`?
- [ ] **Valid Weight Range**: Are all relationship edge weights between `0.0` and `1.0`?

---

## Unit Testing & Verification Checklist

- [ ] **Integration Unit Test**: Has `<ModuleName>GraphIntegration.test.ts` been authored?
- [ ] **Bootstrapper Verification**: Does the test run `GraphBootstrapper.bootstrap('test')` and assert `validationReport.isValid === true`?
- [ ] **Zero Orphan Check**: Does the test verify zero orphan nodes?
- [ ] **Zero Cycle Check**: Does the test verify zero directional cycle errors (`hasCycles === false`)?
- [ ] **Full Repository Test Suite Pass**: Did `npx vitest run` complete with 100% passing tests across all modules?
