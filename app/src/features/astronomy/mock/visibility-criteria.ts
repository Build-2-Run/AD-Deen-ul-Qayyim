import { VisibilityCriterion } from '../models';

export interface VisibilityCriterionDefinition {
  id: VisibilityCriterion;
  name: string;
  author: string;
  year: number;
  description: string;
  danjonLimitDegrees: number; // e.g. 7.0
  polynomialCoefficients?: number[]; // [c0, c1, c2, c3] for c0 + c1*W + c2*W^2 + c3*W^3
  thresholds: Array<{
    code: string;
    minScore?: number;
    maxScore?: number;
    classification: 
      | 'Easily Visible'
      | 'Visible under Ideal Conditions'
      | 'Optical Aid Recommended'
      | 'Optical Aid Required'
      | 'Not Visible'
      | 'Below Danjon Limit';
    description: string;
  }>;
}

export const visibilityCriteriaData: Record<VisibilityCriterion, VisibilityCriterionDefinition> = {
  Danjon: {
    id: 'Danjon',
    name: 'Danjon Limit',
    author: 'André-Louis Danjon',
    year: 1960,
    description: 'Astronomical limit below which lunar crescent cannot be seen due to shadow roughness on the lunar limb.',
    danjonLimitDegrees: 7.0,
    thresholds: [
      {
        code: 'PASS',
        minScore: 7.0,
        classification: 'Visible under Ideal Conditions',
        description: 'Elongation is at or above the Danjon limit (7.0°).'
      },
      {
        code: 'FAIL',
        maxScore: 7.0,
        classification: 'Below Danjon Limit',
        description: 'Elongation is below the Danjon limit (7.0°). Crescent cannot form.'
      }
    ]
  },
  Yallop: {
    id: 'Yallop',
    name: 'HMNAO Yallop Criterion',
    author: 'B.D. Yallop (HM Nautical Almanac Office)',
    year: 1997,
    description: 'Standard HMNAO visibility criterion based on q-parameter computed from Arc of Vision and Crescent Width.',
    danjonLimitDegrees: 7.0,
    // Polynomial for f(W) = 11.8371 - 6.3226*W + 0.7319*W^2 - 0.1018*W^3
    polynomialCoefficients: [11.8371, -6.3226, 0.7319, -0.1018],
    thresholds: [
      {
        code: 'A',
        minScore: 0.216,
        classification: 'Easily Visible',
        description: 'Easily visible to the naked eye.'
      },
      {
        code: 'B',
        minScore: -0.014,
        maxScore: 0.216,
        classification: 'Visible under Ideal Conditions',
        description: 'Visible under ideal atmospheric conditions.'
      },
      {
        code: 'C',
        minScore: -0.160,
        maxScore: -0.014,
        classification: 'Optical Aid Recommended',
        description: 'May require optical aid (binoculars/telescope) to locate crescent.'
      },
      {
        code: 'D',
        minScore: -0.232,
        maxScore: -0.160,
        classification: 'Optical Aid Required',
        description: 'Will require optical aid to find the crescent.'
      },
      {
        code: 'E',
        minScore: -0.293,
        maxScore: -0.232,
        classification: 'Not Visible',
        description: 'Not visible even with a telescope.'
      },
      {
        code: 'F',
        maxScore: -0.293,
        classification: 'Below Danjon Limit',
        description: 'Below Danjon limit / Impossible to observe.'
      }
    ]
  },
  Odeh: {
    id: 'Odeh',
    name: 'Odeh Criterion',
    author: 'Mohammad Sh. Odeh',
    year: 2004,
    description: 'Modern updated criterion using V-value derived from topocentric crescent width and arc of vision.',
    danjonLimitDegrees: 7.0,
    polynomialCoefficients: [11.8371, -6.3226, 0.7319, -0.1018],
    thresholds: [
      {
        code: 'A',
        minScore: 5.65,
        classification: 'Easily Visible',
        description: 'Easily visible by naked eye.'
      },
      {
        code: 'B',
        minScore: 2.00,
        maxScore: 5.65,
        classification: 'Visible under Ideal Conditions',
        description: 'Visible by naked eye if atmospheric conditions are clear.'
      },
      {
        code: 'C',
        minScore: -0.96,
        maxScore: 2.00,
        classification: 'Optical Aid Required',
        description: 'Visible only by optical aid.'
      },
      {
        code: 'D',
        maxScore: -0.96,
        classification: 'Not Visible',
        description: 'Not visible even with optical aid.'
      }
    ]
  },
  Ilyas: {
    id: 'Ilyas',
    name: 'Ilyas Criterion',
    author: 'Mohammad Ilyas',
    year: 1988,
    description: 'International Islamic Calendar criterion using minimum Arc of Vision (10.5°) and Elongation (12°).',
    danjonLimitDegrees: 7.0,
    thresholds: [
      {
        code: 'VISIBLE',
        minScore: 10.5,
        classification: 'Easily Visible',
        description: 'Arc of Vision >= 10.5° (or Elongation >= 12°).'
      },
      {
        code: 'NOT_VISIBLE',
        maxScore: 10.5,
        classification: 'Not Visible',
        description: 'Arc of Vision < 10.5°.'
      }
    ]
  },
  Bruin: {
    id: 'Bruin',
    name: 'Bruin Criterion',
    author: 'Frans Bruin',
    year: 1977,
    description: 'Visibility threshold based on atmospheric extinction and crescent width.',
    danjonLimitDegrees: 7.0,
    thresholds: [
      {
        code: 'VISIBLE',
        minScore: 0.5,
        classification: 'Visible under Ideal Conditions',
        description: 'Crescent brightness exceeds sky twilight background contrast.'
      },
      {
        code: 'NOT_VISIBLE',
        maxScore: 0.5,
        classification: 'Not Visible',
        description: 'Contrast below visibility threshold.'
      }
    ]
  }
};
