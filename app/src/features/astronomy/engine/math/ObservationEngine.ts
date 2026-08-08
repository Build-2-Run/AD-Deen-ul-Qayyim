import {
  IObservationEngine,
  CrescentParameters,
  CriterionEvaluation
} from '../../models';
import { visibilityCriteriaData } from '../../mock/visibility-criteria';

export class ObservationEngine implements IObservationEngine {
  public evaluateAllCriteria(params: CrescentParameters): {
    danjon: CriterionEvaluation;
    yallop: CriterionEvaluation;
    odeh: CriterionEvaluation;
    ilyas: CriterionEvaluation;
    bruin: CriterionEvaluation;
  } {
    return {
      danjon: this.evaluateDanjon(params),
      yallop: this.evaluateYallop(params),
      odeh: this.evaluateOdeh(params),
      ilyas: this.evaluateIlyas(params),
      bruin: this.evaluateBruin(params)
    };
  }

  public evaluateDanjon(params: CrescentParameters): CriterionEvaluation {
    const danjonData = visibilityCriteriaData.Danjon;
    const limit = danjonData.danjonLimitDegrees;

    if (params.arcOfLight < limit) {
      return {
        criterion: 'Danjon',
        classification: 'Below Danjon Limit',
        code: 'FAIL',
        score: params.arcOfLight,
        description: `Arc of Light (${params.arcOfLight.toFixed(2)}°) is below the 7.0° Danjon limit.`
      };
    }

    return {
      criterion: 'Danjon',
      classification: 'Visible under Ideal Conditions',
      code: 'PASS',
      score: params.arcOfLight,
      description: `Arc of Light (${params.arcOfLight.toFixed(2)}°) meets or exceeds the 7.0° Danjon limit.`
    };
  }

  public evaluateYallop(params: CrescentParameters): CriterionEvaluation {
    const yallopData = visibilityCriteriaData.Yallop;
    const coeffs = yallopData.polynomialCoefficients ?? [11.8371, -6.3226, 0.7319, -0.1018];
    
    // Evaluate polynomial f(W) = c0 + c1*W + c2*W^2 + c3*W^3
    const W = params.crescentWidth;
    const fW = coeffs[0] + coeffs[1] * W + coeffs[2] * Math.pow(W, 2) + coeffs[3] * Math.pow(W, 3);
    
    // q = (ARCV - f(W)) / 10
    const q = (params.arcOfVision - fW) / 10;

    if (params.arcOfLight < yallopData.danjonLimitDegrees) {
      return {
        criterion: 'Yallop',
        classification: 'Below Danjon Limit',
        code: 'F',
        score: q,
        description: 'Below Danjon limit (ARCL < 7.0°).'
      };
    }

    for (const t of yallopData.thresholds) {
      const minPass = t.minScore === undefined || q >= t.minScore;
      const maxPass = t.maxScore === undefined || q < t.maxScore;
      if (minPass && maxPass) {
        return {
          criterion: 'Yallop',
          classification: t.classification,
          code: t.code,
          score: q,
          description: t.description
        };
      }
    }

    return {
      criterion: 'Yallop',
      classification: 'Not Visible',
      code: 'F',
      score: q,
      description: 'Not visible under Yallop criteria.'
    };
  }

  public evaluateOdeh(params: CrescentParameters): CriterionEvaluation {
    const odehData = visibilityCriteriaData.Odeh;
    const coeffs = odehData.polynomialCoefficients ?? [11.8371, -6.3226, 0.7319, -0.1018];

    const W = params.crescentWidth;
    const fW = coeffs[0] + coeffs[1] * W + coeffs[2] * Math.pow(W, 2) + coeffs[3] * Math.pow(W, 3);
    
    // V = ARCV - f(W)
    const V = params.arcOfVision - fW;

    if (params.arcOfLight < odehData.danjonLimitDegrees) {
      return {
        criterion: 'Odeh',
        classification: 'Below Danjon Limit',
        code: 'D',
        score: V,
        description: 'Below Danjon limit (ARCL < 7.0°).'
      };
    }

    for (const t of odehData.thresholds) {
      const minPass = t.minScore === undefined || V >= t.minScore;
      const maxPass = t.maxScore === undefined || V < t.maxScore;
      if (minPass && maxPass) {
        return {
          criterion: 'Odeh',
          classification: t.classification,
          code: t.code,
          score: V,
          description: t.description
        };
      }
    }

    return {
      criterion: 'Odeh',
      classification: 'Not Visible',
      code: 'D',
      score: V,
      description: 'Not visible under Odeh criteria.'
    };
  }

  public evaluateIlyas(params: CrescentParameters): CriterionEvaluation {
    if (params.arcOfLight < 7.0) {
      return {
        criterion: 'Ilyas',
        classification: 'Below Danjon Limit',
        code: 'NOT_VISIBLE',
        score: params.arcOfVision,
        description: 'Below Danjon limit.'
      };
    }

    if (params.arcOfVision >= 10.5 || params.arcOfLight >= 12.0) {
      return {
        criterion: 'Ilyas',
        classification: 'Easily Visible',
        code: 'VISIBLE',
        score: params.arcOfVision,
        description: 'Arc of Vision >= 10.5° or Elongation >= 12.0°.'
      };
    }

    return {
      criterion: 'Ilyas',
      classification: 'Not Visible',
      code: 'NOT_VISIBLE',
      score: params.arcOfVision,
      description: 'Arc of Vision < 10.5°.'
    };
  }

  public evaluateBruin(params: CrescentParameters): CriterionEvaluation {
    if (params.arcOfLight < 7.0) {
      return {
        criterion: 'Bruin',
        classification: 'Below Danjon Limit',
        code: 'NOT_VISIBLE',
        score: params.crescentWidth,
        description: 'Below Danjon limit.'
      };
    }

    if (params.arcOfVision >= 10.0 && params.crescentWidth >= 0.25) {
      return {
        criterion: 'Bruin',
        classification: 'Visible under Ideal Conditions',
        code: 'VISIBLE',
        score: params.crescentWidth,
        description: 'Crescent contrast is sufficient for visibility.'
      };
    }

    return {
      criterion: 'Bruin',
      classification: 'Not Visible',
      code: 'NOT_VISIBLE',
      score: params.crescentWidth,
      description: 'Crescent width or contrast insufficient.'
    };
  }
}
