import { calculateMonetary } from './parts/monetaryAssets';
import { livestockZakat } from './parts/livestock';
import { agricultureZakat } from './parts/agriculture';
import { summariseStatus } from './verification';
import { ZakatDueLine, ZakatInput, ZakatResult } from './types';

/**
 * Zakat Core Calculator.
 *
 * The single entry point for a full Zakat assessment. It composes the parts —
 * Monetary Assets / Gold & Silver / Business Assets, Agriculture, Livestock,
 * and Nisab — into one result. UI never computes; it calls this. Monetary
 * wealth is returned as an amount; livestock and crops are returned in kind,
 * because that is how they are classically paid.
 */
export class ZakatCalculator {
  static calculate(input: ZakatInput): ZakatResult {
    const notes: string[] = [];
    const dueLines: ZakatDueLine[] = [];

    // 1. Monetary wealth (cash, gold & silver, business, investments).
    const monetary = calculateMonetary(
      input.monetary,
      input.liabilities,
      input.nisabBasis,
      input.prices
    );

    if (input.monetary) {
      if (input.nisabBasis == null) {
        notes.push('Choose a nisab standard (gold or silver) to assess monetary wealth.');
      } else if (monetary.meetsNisab) {
        dueLines.push({
          category: 'monetary',
          label: 'Monetary wealth',
          amount: monetary.zakatDue,
          detail: `2.5% of net zakatable wealth (${input.nisabBasis} nisab).`,
          source: "Qur'an 9:103; Sahih al-Bukhari 1454",
          status: 'consensus',
        });
      }
    }

    // 2. Livestock (in kind).
    if (input.livestock) dueLines.push(...livestockZakat(input.livestock));

    // 3. Agriculture (in kind, no hawl).
    dueLines.push(...agricultureZakat(input.agriculture, input.prices.currency));

    // Hawl reminder for wealth-based categories.
    if (input.monetary || input.livestock) {
      notes.push(
        'Monetary wealth and livestock are due only if held for a full lunar year (hawl). Crops are due at harvest.'
      );
    }
    if (dueLines.some((l) => l.needsVerification)) {
      notes.push(
        'One or more amounts above fall where schools differ (livestock composition, or the ʿushr school applied to fruit/vegetable produce) — confirm with a qualified scholar.'
      );
    }

    const totalMonetaryDue = dueLines.reduce((sum, l) => sum + (l.amount || 0), 0);

    return {
      currency: input.prices.currency,
      monetary: input.monetary ? monetary : undefined,
      dueLines,
      totalMonetaryDue,
      overallStatus: summariseStatus(dueLines),
      notes,
    };
  }
}
