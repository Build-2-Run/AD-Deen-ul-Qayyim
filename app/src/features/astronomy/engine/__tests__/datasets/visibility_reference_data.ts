import { DatasetMetadata } from './global_cities';

export const visibilityMetadata: DatasetMetadata = {
  source: 'HMNAO Technical Note No. 69 (Yallop 1997) & ICOP Case Records (Odeh 2004)',
  publicationVersionDate: '1997 / 2004',
  units: 'ARCL (deg), ARCV (deg), Crescent Width W (arcmin), Yallop q, Odeh V',
  referenceUrl: 'http://www.icoproject.org/',
  dateImported: '2026-07-22'
};

export interface VisibilityTestCase {
  id: string;
  name: string;
  arcOfLight: number;
  arcOfVision: number;
  crescentWidth: number;
  expectedYallopCode: string;
  expectedOdehCode: string;
  expectedDanjonPass: boolean;
}

export const visibilityReferenceDataset: VisibilityTestCase[] = [
  {
    id: 'case-1',
    name: 'High Visibility Crescent (Ramadan 1447)',
    arcOfLight: 14.5,
    arcOfVision: 15.0,
    crescentWidth: 0.45,
    expectedYallopCode: 'A',
    expectedOdehCode: 'A',
    expectedDanjonPass: true
  },
  {
    id: 'case-2',
    name: 'Below Danjon Threshold',
    arcOfLight: 5.5,
    arcOfVision: 4.0,
    crescentWidth: 0.10,
    expectedYallopCode: 'F',
    expectedOdehCode: 'D',
    expectedDanjonPass: false
  },
  {
    id: 'case-3',
    name: 'Optical Aid Zone',
    arcOfLight: 9.5,
    arcOfVision: 10.2,
    crescentWidth: 0.18,
    expectedYallopCode: 'C',
    expectedOdehCode: 'C',
    expectedDanjonPass: true
  }
];
