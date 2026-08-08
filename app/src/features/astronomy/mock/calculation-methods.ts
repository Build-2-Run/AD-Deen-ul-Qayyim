import { CalculationMethod } from '../models';

export const calculationMethods: CalculationMethod[] = [
  {
    id: 'method:mwl',
    name: 'Muslim World League (MWL)',
    region: 'Europe, Far East, parts of US',
    authority: 'Muslim World League',
    country: 'International',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 17 },
    midnight: 'Standard',
    highLatitudeMethod: 'AngleBased',
    references: ['MWL Conference']
  },
  {
    id: 'method:isna',
    name: 'Islamic Society of North America (ISNA)',
    region: 'North America (US & Canada)',
    authority: 'ISNA',
    country: 'USA/Canada',
    fajr: { type: 'SunAngle', angle: 15 },
    isha: { type: 'SunAngle', angle: 15 },
    midnight: 'Standard',
    highLatitudeMethod: 'AngleBased',
    historicalNotes: 'Widely adopted in North America.'
  },
  {
    id: 'method:umm_al_qura',
    name: 'Umm al-Qura University, Makkah',
    region: 'Arabian Peninsula',
    authority: 'Umm al-Qura University',
    country: 'Saudi Arabia',
    fajr: { type: 'SunAngle', angle: 18.5 },
    isha: { type: 'MinutesAfterSunset', minutes: 90 }, // 120 minutes during Ramadan
    midnight: 'Standard',
    highLatitudeMethod: 'None'
  },
  {
    id: 'method:egyptian',
    name: 'Egyptian General Authority of Survey',
    region: 'Africa, Syria, Iraq, Lebanon, Malaysia, parts of US',
    authority: 'Egyptian General Authority of Survey',
    country: 'Egypt',
    fajr: { type: 'SunAngle', angle: 19.5 },
    isha: { type: 'SunAngle', angle: 17.5 },
    midnight: 'Standard',
    highLatitudeMethod: 'AngleBased'
  },
  {
    id: 'method:karachi',
    name: 'University of Islamic Sciences, Karachi',
    region: 'Pakistan, Bangladesh, India, Afghanistan, parts of Europe',
    authority: 'University of Islamic Sciences, Karachi',
    country: 'Pakistan',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 18 },
    midnight: 'Standard',
    highLatitudeMethod: 'AngleBased'
  },
  {
    id: 'method:diyanet',
    name: 'Diyanet İşleri Başkanlığı',
    region: 'Turkey, parts of Europe',
    authority: 'Directorate of Religious Affairs',
    country: 'Turkey',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 17 }, // Often utilizes regional adjustments
    midnight: 'Standard',
    highLatitudeMethod: 'OneSeventh'
  },
  {
    id: 'method:kuwait',
    name: 'Kuwait',
    region: 'Kuwait',
    authority: 'Kuwait',
    country: 'Kuwait',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 17.5 },
    midnight: 'Standard'
  },
  {
    id: 'method:qatar',
    name: 'Qatar',
    region: 'Qatar',
    authority: 'Qatar',
    country: 'Qatar',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'MinutesAfterSunset', minutes: 90 },
    midnight: 'Standard'
  },
  {
    id: 'method:muis',
    name: 'Majlis Ugama Islam Singapura (MUIS)',
    region: 'Singapore',
    authority: 'MUIS',
    country: 'Singapore',
    fajr: { type: 'SunAngle', angle: 20 },
    isha: { type: 'SunAngle', angle: 18 },
    midnight: 'Standard'
  },
  {
    id: 'method:moonsighting',
    name: 'Moonsighting Committee',
    region: 'Global',
    authority: 'Moonsighting.com',
    country: 'International',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 18 },
    midnight: 'Standard'
  }
];
