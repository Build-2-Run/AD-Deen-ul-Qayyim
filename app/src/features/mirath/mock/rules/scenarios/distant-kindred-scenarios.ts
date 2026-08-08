import { WorkedExample } from '../../../models';

export const distantKindredScenarios: WorkedExample[] = [
  {
    id: 'example:distant_1',
    title: 'Nephew and Paternal Uncle',
    description: 'Full Nephew blocks Full Paternal Uncle.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:nephew_full', heirName: 'Full Nephew', fraction: '1/1', amount: 1000, rationale: 'Asabah.' }
    ]
  },
  {
    id: 'example:distant_2',
    title: 'Consanguine Nephew and Full Uncle',
    description: 'Paternal Nephew blocks Full Paternal Uncle.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:nephew_consanguine', heirName: 'Paternal Nephew', fraction: '1/1', amount: 1000, rationale: 'Asabah.' }
    ]
  },
  {
    id: 'example:distant_3',
    title: 'Full Uncle and Full Cousin',
    description: 'Full Uncle blocks Full Cousin.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:paternal_uncle_full', heirName: 'Full Uncle', fraction: '1/1', amount: 1000, rationale: 'Asabah.' }
    ]
  },
  {
    id: 'example:distant_4',
    title: 'Consanguine Uncle and Full Cousin',
    description: 'Consanguine Uncle blocks Full Cousin.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:paternal_uncle_consanguine', heirName: 'Consanguine Uncle', fraction: '1/1', amount: 1000, rationale: 'Asabah.' }
    ]
  },
  {
    id: 'example:distant_5',
    title: 'Full Cousin and Consanguine Cousin',
    description: 'Full Cousin blocks Consanguine Cousin.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:cousin_full', heirName: 'Full Cousin', fraction: '1/1', amount: 1000, rationale: 'Asabah.' }
    ]
  }
];
