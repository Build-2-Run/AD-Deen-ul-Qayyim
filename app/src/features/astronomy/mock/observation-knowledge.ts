export const moonPhases = [
  { phase: 'New Moon (Conjunction)', description: 'The moon is between the Earth and the Sun. It is generally not visible.', illumination: '0%' },
  { phase: 'Waxing Crescent', description: 'A thin sliver of the moon becomes visible in the western sky after sunset.', illumination: '1% - 49%' },
  { phase: 'First Quarter', description: 'Half of the moon is illuminated. Rises around noon and sets around midnight.', illumination: '50%' },
  { phase: 'Waxing Gibbous', description: 'More than half illuminated but not fully.', illumination: '51% - 99%' },
  { phase: 'Full Moon (Opposition)', description: 'The entire face of the moon is illuminated.', illumination: '100%' },
  { phase: 'Waning Gibbous', description: 'The moon begins to shrink after the full moon.', illumination: '99% - 51%' },
  { phase: 'Third Quarter', description: 'The opposite half of the moon is illuminated. Rises around midnight.', illumination: '50%' },
  { phase: 'Waning Crescent', description: 'A thin sliver visible in the eastern sky before dawn.', illumination: '49% - 1%' }
];

export const visibilityCriteria = [
  {
    name: 'Danjon Limit',
    definition: 'An empirical limit predicting that the lunar crescent cannot be seen if the elongation is less than ~7 degrees.',
    scientificExplanation: 'Due to the roughness of the lunar surface (mountains and craters), the shadows completely obscure the thin crescent when the angle from the sun is very small.',
    islamicSignificance: 'Provides a hard physical baseline; claims of sightings below this limit are universally rejected by modern astronomical bodies.',
    references: ['Danjon, A. (1932) L\'Astronomie, 46, 57-66.']
  },
  {
    name: 'Yallop Criterion',
    definition: 'A highly accurate modern empirical model developed by B.D. Yallop combining moon age, altitude, and width of the crescent (q-value).',
    scientificExplanation: 'Calculates a parameter "q" which predicts visibility across different zones (A: easily visible, B: visible under perfect conditions, C: optical aid needed to find, D: optical aid needed to see).',
    islamicSignificance: 'Widely adopted by organizations such as HMNAO and many Islamic astronomical committees for predicting hilal visibility globally.',
    references: ['Yallop, B.D. (1997) NAO Technical Note No. 69.']
  },
  {
    name: 'Odeh Criterion',
    definition: 'An updated model by Mohammad Shawkat Odeh based on a larger dataset of crescent observations, specifically tailored for the Islamic Hilal.',
    scientificExplanation: 'Uses a refined version of the topocentric Arc of Vision (ARCV) and Arc of Light (ARCL) to calculate the parameter "V".',
    islamicSignificance: 'One of the most trusted criteria in the Islamic world today. Adopted by the Islamic Crescents\' Observation Project (ICOP).',
    references: ['Odeh, M.S. (2004) Experimental Astronomy 18: 39-64.']
  }
];

export const observationConcepts = [
  {
    name: 'Elongation (Arc of Light)',
    definition: 'The angular distance between the centers of the Sun and the Moon as seen from Earth.',
    scientificExplanation: 'Directly determines the illuminated fraction of the moon. Essential for crescent thickness.',
    islamicSignificance: 'Crucial parameter for all visibility models used to predict the start of the Islamic month.'
  },
  {
    name: 'Moon Age',
    definition: 'The time elapsed since the precise moment of astronomical conjunction (New Moon).',
    scientificExplanation: 'Usually measured in hours. A moon younger than 12-15 hours is generally impossible to see with the naked eye.',
    islamicSignificance: 'Historically used as a rule of thumb, though modern science prefers elongation and altitude over age alone.'
  },
  {
    name: 'Lag Time',
    definition: 'The difference between the time of sunset and the time of moonset.',
    scientificExplanation: 'If the moon sets before the sun, lag time is negative, and visibility is impossible. A positive lag time (e.g. >40 minutes) is usually required for the sky to darken enough to see the crescent.',
    islamicSignificance: 'A primary condition in traditional Fiqh. If the moon sets before the sun, the month cannot begin.'
  }
];
