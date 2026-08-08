import { AnyMirathRule, HeirRule, FixedShareRule, BlockingRule, ResiduaryRule, WorkedExample, MirathFAQ, SpecialCaseRule, MirathGlossaryTerm, RuleRequirement } from '../models';
import { KnowledgeNode, BreadcrumbItem, KnowledgeMetadata } from '../../knowledge/types';
import { heirRules } from '../mock/rules/heirs';

const heirTitleById = new Map(heirRules.map(h => [h.id, h.title]));

function humanizeToken(token: string): string {
  const sentence = token.replace(/_/g, ' ').toLowerCase();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function resolveHeirTitle(id: string): string {
  return heirTitleById.get(id) ?? humanizeToken(id.replace(/^heir:/, ''));
}

function humanizeRequirement(r: RuleRequirement): string {
  const heir = r.targetHeirId ? resolveHeirTitle(r.targetHeirId) : undefined;
  switch (r.type) {
    case 'EXACT_COUNT':
    case 'EXACT_COUNT_UTERINE':
      if (r.count === 0) return heir ? `No ${heir}` : 'None present';
      if (r.count === 1) return heir ? `Exactly one ${heir}` : 'Exactly one';
      return heir ? `Exactly ${r.count} of ${heir}` : `Exactly ${r.count}`;
    case 'MIN_COUNT':
    case 'MIN_COUNT_UTERINE':
      return heir ? `At least ${r.count} of ${heir}` : `At least ${r.count}`;
    default:
      return heir ? `${humanizeToken(r.type)} (${heir})` : humanizeToken(r.type);
  }
}

export class MirathAdapter {
  static toKnowledgeNode(rule: AnyMirathRule): KnowledgeNode {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: 'mirath', label: 'Mirath' },
      { id: rule.id, label: rule.title }
    ];

    let categoryLabel = 'Rule';
    if (rule.type === 'heir') categoryLabel = 'Heir Encyclopedia';
    if (rule.type === 'share') categoryLabel = 'Fixed Share (Furud)';
    if (rule.type === 'blocking') categoryLabel = 'Blocking Rule (Hajb)';
    if (rule.type === 'asabah') categoryLabel = 'Residuary (Asabah)';
    if (rule.type === 'example') categoryLabel = 'Worked Example';
    if (rule.type === 'faq') categoryLabel = 'FAQ';
    if (rule.type === 'glossary') categoryLabel = 'Glossary';
    if (rule.type === 'special_case') categoryLabel = 'Special Case';

    const metadata: KnowledgeMetadata = {
      authorityClass: 'scholarly_consensus',
      language: ['en'],
      collection: 'Fiqh of Inheritance',
      badges: [categoryLabel]
    };

    // Glossary terms get the bilingual Arabic/definition layout instead of a markdown body.
    const isGlossary = rule.type === 'glossary';
    let fullBody = isGlossary ? '' : (rule.description || '');

    // Generate readable content for a Heir Rule
    if (rule.type === 'heir') {
      const h = rule as HeirRule;
      fullBody += `\n\n### Heir Profile\n`;
      fullBody += `- **Gender:** ${h.gender === 'male' ? 'Male' : 'Female'}\n`;
      fullBody += `- **Category:** ${h.category}\n`;
      fullBody += `- **Default Share Type:** ${h.defaultShareType === 'Furud' ? 'Fixed share (Furud)' : h.defaultShareType === 'Asabah' ? 'Residuary (Asabah)' : 'Fixed share or Residuary'}\n`;
      if (h.eligibilityConditions.length > 0) {
        fullBody += `\n**Eligibility**\n`;
        h.eligibilityConditions.forEach(c => fullBody += `- ${humanizeToken(c)}\n`);
      }
    }

    // Generate readable content for a Fixed Share Rule
    if (rule.type === 'share') {
      const s = rule as FixedShareRule;
      if (s.eligibleHeirs.length > 0) {
        fullBody += `\n\n### Eligible Heirs\n`;
        s.eligibleHeirs.forEach(id => fullBody += `- ${resolveHeirTitle(id)}\n`);
      }
      if (s.conditions.length > 0) {
        fullBody += `\n### Conditions\n`;
        s.conditions.forEach(c => {
          fullBody += `- ${c.description}\n`;
          const reqs = c.requires.map(humanizeRequirement);
          if (reqs.length > 0) fullBody += `  - ${reqs.join('; ')}\n`;
        });
      }
    }

    // Generate readable content for a Blocking Rule
    if (rule.type === 'blocking') {
      const b = rule as BlockingRule;
      fullBody += `\n\n### Blocking Details\n`;
      fullBody += `- **Blocked Heir:** ${resolveHeirTitle(b.blockedHeirId)}\n`;
      fullBody += `- **Blocked By:** ${b.blockedByIds.map(resolveHeirTitle).join(', ')}\n`;
      fullBody += `- **Type:** ${b.blockingType === 'Total' ? 'Total exclusion' : 'Partial reduction'}\n`;
      if (b.requires && b.requires.length > 0) {
        fullBody += `- **Conditions:** ${b.requires.map(humanizeRequirement).join('; ')}\n`;
      }
    }

    // Generate readable content for a Worked Example
    if (rule.type === 'example') {
      const e = rule as WorkedExample;
      fullBody += `\n\n### Estate Deductions\n| Gross | Funeral | Debts | Bequests | Net Distributable |\n|---|---|---|---|---|\n`;
      fullBody += `| $${e.estate.gross.toLocaleString()} | $${e.estate.funeral.toLocaleString()} | $${e.estate.debts.toLocaleString()} | $${e.estate.bequests.toLocaleString()} | **$${(e.estate.net ?? 0).toLocaleString()}** |\n`;

      fullBody += `\n### Distribution\n| Heir | Fraction | Amount | Rationale |\n|---|---|---|---|\n`;
      e.shares.forEach(s => {
        fullBody += `| ${s.heirName} | ${s.fraction} | $${s.amount.toLocaleString()} | ${s.rationale} |\n`;
      });
    }

    // Generate readable content for a Residuary (Asabah) Rule
    if (rule.type === 'asabah') {
      const a = rule as ResiduaryRule;
      fullBody += `\n\n### Residuary Details\n`;
      fullBody += `- **Type:** ${a.asabahType}\n`;
      fullBody += `- **Priority Class:** ${a.priorityClass}\n`;
      fullBody += `- **Members:** ${a.members.map(resolveHeirTitle).join(', ')}\n`;
      if (a.requires && a.requires.length > 0) {
        fullBody += `- **Conditions:** ${a.requires.map(humanizeRequirement).join('; ')}\n`;
      }
    }

    // Special Case rules: the description already reads as prose, nothing further to generate.

    // FAQ: the title carries the question, so the body is just the answer.
    if (rule.type === 'faq') {
       const f = rule as MirathFAQ;
       fullBody = f.answer;
    }

    // Append Evidence
    if (rule.evidence) {
       fullBody += `\n\n---\n### Evidence\n`;
       if (rule.evidence.quran) {
         fullBody += `**Qur'an**\n`;
         rule.evidence.quran.forEach(q => fullBody += `- ${q}\n`);
       }
       if (rule.evidence.hadith) {
         fullBody += `\n**Hadith**\n`;
         rule.evidence.hadith.forEach(h => fullBody += `- ${h}\n`);
       }
       if (rule.evidence.ijma) {
         fullBody += `\n**Ijma (Consensus)**\n- ${rule.evidence.ijma}\n`;
       }
       if (rule.evidence.authenticity) {
         fullBody += `\n*Authenticity: ${rule.evidence.authenticity}*\n`;
       }
    }

    const glossaryTerm = isGlossary ? (rule as MirathGlossaryTerm) : undefined;

    return {
      id: rule.id,
      type: 'fiqh',
      title: rule.title,
      arabicText: glossaryTerm?.arabicTerm,
      primaryTranslation: glossaryTerm ? rule.description : undefined,
      body: isGlossary ? (fullBody.trim() || undefined) : fullBody,
      metadata,
      breadcrumbs
    };
  }
}
