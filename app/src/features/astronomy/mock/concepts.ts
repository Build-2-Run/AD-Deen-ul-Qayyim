import { AstronomyConcept } from '../models';

export const astronomyConcepts: AstronomyConcept[] = [
  {
    id: 'concept:true-dawn',
    title: 'True Dawn (Al-Fajr Al-Sadiq)',
    explanation: 'The True Dawn is the time when the sun\'s light scatters in the upper atmosphere and appears as a horizontal band of light across the eastern horizon. Astronomically, this corresponds to the sun being a specific angle below the horizon (typically between 12 and 19 degrees).',
    importanceInIslam: 'Marks the beginning of the time for Fajr prayer and the start of the daily fast during Ramadan.',
    relatedConceptIds: ['concept:false-dawn', 'concept:twilight']
  },
  {
    id: 'concept:false-dawn',
    title: 'False Dawn (Al-Fajr Al-Kadhib)',
    explanation: 'A vertical column of light (zodiacal light) that appears in the east before the True Dawn, often tapering at the top like a wolf\'s tail. It is followed by a period of darkness before the True Dawn appears.',
    importanceInIslam: 'It is prohibited to pray Fajr or begin fasting at this time; one must wait for the True Dawn.',
    relatedConceptIds: ['concept:true-dawn']
  },
  {
    id: 'concept:twilight',
    title: 'Twilight (Shafaq)',
    explanation: 'The illumination of the lower atmosphere when the Sun itself is not directly visible because it is below the horizon. Divided into Astronomical, Nautical, and Civil twilight.',
    importanceInIslam: 'Determines the times of Fajr (morning twilight) and Isha (evening twilight).',
    relatedConceptIds: ['concept:true-dawn']
  },
  {
    id: 'concept:solar-noon',
    title: 'Solar Noon (Zawal)',
    explanation: 'The exact moment when the Sun crosses the observer\'s local meridian and reaches its highest point in the sky for that day. At this time, shadows are at their absolute minimum length.',
    importanceInIslam: 'The time of Zawal itself is a prohibited time for prayer. Immediately after the sun passes its zenith, the time for Dhuhr prayer begins.',
    relatedConceptIds: []
  },
  {
    id: 'concept:sunset',
    title: 'Sunset (Ghurub)',
    explanation: 'The moment the trailing edge of the sun\'s disk disappears below the western horizon, taking into account atmospheric refraction.',
    importanceInIslam: 'Marks the end of the fasting day, the end of Asr time, and the beginning of Maghrib time.',
    relatedConceptIds: []
  },
  {
    id: 'concept:moon-phases',
    title: 'Moon Phases',
    explanation: 'The shape of the directly sunlit portion of the Moon as viewed from Earth. Key phases for Islamic astronomy include the New Moon (Conjunction) and the Waxing Crescent (Hilal).',
    importanceInIslam: 'The Islamic calendar is strictly lunar. The beginning of a new month is traditionally determined by the physical sighting of the waxing crescent.',
    relatedConceptIds: ['concept:synodic-month']
  },
  {
    id: 'concept:synodic-month',
    title: 'Synodic Month',
    explanation: 'The time it takes for the moon to complete one full cycle of phases (e.g., from one New Moon to the next), averaging about 29.53059 days.',
    importanceInIslam: 'Forms the basis of the Hijri calendar, dictating that Islamic months are either 29 or 30 days long.',
    relatedConceptIds: ['concept:sidereal-month']
  },
  {
    id: 'concept:sidereal-month',
    title: 'Sidereal Month',
    explanation: 'The time it takes for the moon to return to the same position relative to the background stars, roughly 27.321 days.',
    importanceInIslam: 'Less directly applicable to Islamic rituals than the Synodic month, but relevant to the calculation of lunar mansions (Manazil).',
    relatedConceptIds: ['concept:synodic-month']
  },
  {
    id: 'concept:julian-day',
    title: 'Julian Day',
    explanation: 'The continuous count of days since the beginning of the Julian Period (January 1, 4713 BC).',
    importanceInIslam: 'Crucial for astronomical algorithms bridging Gregorian dates, Hijri dates, and calculating planetary positions without dealing with leap years and varying month lengths.',
    relatedConceptIds: []
  },
  {
    id: 'concept:declination',
    title: 'Declination',
    explanation: 'The angular distance of a celestial body north or south of the celestial equator.',
    importanceInIslam: 'The Sun\'s declination is a primary variable in calculating the exact times of daily prayers, especially Fajr and Isha.',
    relatedConceptIds: ['concept:right-ascension']
  },
  {
    id: 'concept:right-ascension',
    title: 'Right Ascension',
    explanation: 'The angular distance of a celestial body eastward along the celestial equator from the vernal equinox.',
    importanceInIslam: 'Used alongside declination to define the exact position of the Sun and Moon in the sky.',
    relatedConceptIds: ['concept:declination']
  },
  {
    id: 'concept:altitude',
    title: 'Altitude (Elevation)',
    explanation: 'The angular distance of a celestial object above the observer\'s local horizon.',
    importanceInIslam: 'Prayer times like Fajr and Isha are defined by the Sun\'s altitude (e.g., -18 degrees). Moon sighting visibility depends heavily on the Moon\'s altitude at sunset.',
    relatedConceptIds: ['concept:azimuth', 'concept:horizon']
  },
  {
    id: 'concept:azimuth',
    title: 'Azimuth',
    explanation: 'The horizontal angle or direction of a compass bearing, typically measured clockwise from North.',
    importanceInIslam: 'Essential for determining the direction of the Qibla (the azimuth of Makkah from the observer\'s location).',
    relatedConceptIds: ['concept:altitude']
  },
  {
    id: 'concept:ecliptic',
    title: 'Ecliptic',
    explanation: 'The apparent path of the Sun on the celestial sphere over the course of a year, representing the plane of Earth\'s orbit.',
    importanceInIslam: 'Understanding the ecliptic is necessary for predicting eclipses and the relative positions of the Sun and Moon for calculating new months.',
    relatedConceptIds: []
  },
  {
    id: 'concept:horizon',
    title: 'Horizon',
    explanation: 'The apparent line that separates earth from sky. In astronomy, it is distinguished into the true (astronomical) horizon and the visible horizon, which is affected by observer elevation and refraction.',
    importanceInIslam: 'Sunset, sunrise, and moon sighting all depend on the exact definition and observation of the local horizon.',
    relatedConceptIds: ['concept:altitude']
  }
];
