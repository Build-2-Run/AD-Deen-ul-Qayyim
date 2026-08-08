import { AnyMirathRule } from '../../models';
import { heirRules } from './heirs';
import { fixedShareRules } from './fixed-shares';
import { blockingRules } from './blocking';
import { asabahRules } from './asabah';
import { specialCaseRules } from './special-cases';
import { workedExamples } from './scenarios/index';
import { glossaryTerms } from './glossary';
import { faqs } from './faq';

export const allMirathRules: AnyMirathRule[] = [
  ...heirRules,
  ...fixedShareRules,
  ...blockingRules,
  ...asabahRules,
  ...specialCaseRules,
  ...workedExamples,
  ...glossaryTerms,
  ...faqs
];
