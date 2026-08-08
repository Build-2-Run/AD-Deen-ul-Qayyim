// Curated ADQ synthesis entries. Populated ONLY for ayahs with a defensible,
// non-invented scholarly + scientific correlation — per CLAUDE.md, unsourced
// claims must never be fabricated. Ayahs without an entry here render an
// honest "pending review" state in SynthesisCard rather than placeholder text.
export interface SynthesisEntry {
  scholarlyConclusion: string;
  scientificDiscovery: string;
  fiqhImplications: string;
  practicalAction: string;
}

function key(surah: number, ayah: number) {
  return `${surah}:${ayah}`;
}

export const SYNTHESIS_DATA: Record<string, SynthesisEntry> = {
  [key(23, 14)]: {
    scholarlyConclusion:
      "Ibn Kathir, al-Tabari and al-Qurtubi read the sequence nutfah (drop) → 'alaqah (clinging clot) → mudghah (chewed-like lump) → bones clothed with flesh → \"another creation\" as a description of successive, divinely-ordained stages in human formation, culminating in the ensoulment referenced in the hadith of Ibn Mas'ud (Sahih al-Bukhari, Sahih Muslim).",
    scientificDiscovery:
      "The described sequence broadly parallels the stages recognized in modern embryology — the blastocyst's clinging implantation, the somite ('lump-like') stage, and skeletal ossification preceding muscular development. This correlation is widely discussed in Islamic-science literature; the precise mapping of each Arabic term to a specific embryological stage remains a subject of ongoing scholarly discussion rather than settled consensus, and should be presented as a resonance, not a proof-text.",
    fiqhImplications:
      "This verse underlies fiqh discussion of the fetus's sanctity at each stage. The four madhahib differ on the permissibility and timing of abortion relative to ensoulment (nafkh al-ruh), commonly associated in hadith literature with 120 days (Sahih Muslim 2643) — views range across the schools and always require individual scholarly consultation rather than a single blanket ruling.",
    practicalAction:
      "Reflect with gratitude (shukr) on your own stages of formation today, and let the verse inform support for prenatal care as an act that honors life at every recognized stage.",
  },
  [key(21, 30)]: {
    scholarlyConclusion:
      "Ibn Abbas's explanation (narrated in Sahih al-Bukhari) reads \"joined\" (ratqan) as the sky withholding rain and the earth withholding vegetation, later \"parted\" (fataqnahuma) by Allah sending rain and bringing forth plant life. Al-Tabari and Ibn Kathir transmit this as the primary meaning; al-Qurtubi notes the linguistic scope also allows a broader reading of the heavens and earth as a single mass later separated.",
    scientificDiscovery:
      "Since the mid-20th century, some Muslim commentators have additionally read \"joined then parted\" as resonating with the standard cosmological model of an initial extremely dense, hot state that expanded (popularly associated with the term \"Big Bang\"). This is a modern interpretive comparison layered onto the verse, not a claim that classical exegetes derived or intended it — both readings are presented here rather than one replacing the other.",
    fiqhImplications:
      "This is a cosmological, creed-bearing statement (affirming tawhid and divine power) rather than a legislative one — it does not carry a distinct fiqh ruling.",
    practicalAction:
      "Next time you see rain revive dry, cracked ground, pause for tadabbur (reflection) on this verse as a direct, observable sign of the same pattern it describes.",
  },
  [key(21, 33)]: {
    scholarlyConclusion:
      "Classical exegetes (al-Tabari, Ibn Kathir, al-Qurtubi) explain \"each swims in an orbit (falak)\" as the sun, moon and stars each moving along a fixed, divinely-appointed path, cited as a sign of orderly design.",
    scientificDiscovery:
      "This is consistent with the observed reality that the sun, moon, and planets each move along defined orbital and rotational paths — understood today through Newtonian and modern astrophysical mechanics. The verse is read as affirming an orderliness later formalized by astronomy, not as a technical prediction of orbital mechanics.",
    fiqhImplications:
      "This verse is part of the basis for treating astronomical calculation (hisab) as a legitimate tool for prayer-time and qibla determination alongside direct observation — a well-established, cross-madhhab application connecting astronomy to worship (see this app's own Prayer↔Astronomy linkage).",
    practicalAction:
      "Open the Prayer module and trace how today's prayer times were derived from the sun's actual position — a direct, everyday encounter with the pattern this ayah describes.",
  },
  [key(51, 47)]: {
    scholarlyConclusion:
      "Ibn Kathir and al-Qurtubi read \"and We are expanding [it]\" (la-mūsi'ūn) as an affirmation of Allah's vast power in building the heaven, emphasizing His capability rather than a specific physical mechanism.",
    scientificDiscovery:
      "Since Edwin Hubble's 1929 observations, the universe has been understood to be expanding, with galaxies receding from one another over time. Many Muslim commentators have noted this verse's wording as resonating with that discovery; this remains an interpretive correlation drawn after the scientific finding, not a derivation the verse itself makes explicit.",
    fiqhImplications:
      "This is a purely theological affirmation of divine power (qudrah); it does not carry a distinct fiqh ruling.",
    practicalAction:
      "Use a clear night sky as a prompt for dhikr on Allah's power — pairing the observation with this verse rather than letting it pass unremarked.",
  },
  [key(57, 25)]: {
    scholarlyConclusion:
      "Classical exegetes read \"We sent down iron, in which is great strength and benefits for mankind\" as highlighting iron as a provision from Allah with both material benefit (tools, construction) and a test of who supports His cause, per the verse's continuation.",
    scientificDiscovery:
      "Modern astrophysics holds that iron is forged in the cores of massive stars and dispersed by supernovae, meaning Earth's iron did not originate here but arrived from beyond it — a correlation often noted alongside the verb \"sent down\" (anzalna), while acknowledging the same verb is used elsewhere in the Qur'an in non-literal senses (e.g. \"sent down\" cattle, clothing), so this reading is offered as a resonance rather than a literal astronomical claim embedded in the grammar.",
    fiqhImplications:
      "No distinct fiqh ruling attaches to this verse; its legislative weight lies in the general principle of using provided resources for good, as the verse's own continuation stresses.",
    practicalAction:
      "Identify one tool, skill, or resource ('iron' in the broad sense of means) you have today and use it concretely to support a good cause, echoing the verse's call to support what is right unseen.",
  },
  [key(24, 43)]: {
    scholarlyConclusion:
      "Al-Tabari and Ibn Kathir describe this verse's depiction of Allah driving clouds, joining them, forming layered rain-clouds, and sending down hail from \"mountains\" of cloud in the sky as a detailed sign of divine control over weather.",
    scientificDiscovery:
      "This description is consistent with the modern meteorological understanding of cumulonimbus cloud formation: convective towers build to great heights (\"mountains\" of cloud), and hail forms through repeated cycles within these towers before falling — a well-documented atmospheric process, not a contested reading.",
    fiqhImplications:
      "This verse underlies the Sunnah of supplicating during rainfall (\"Allahumma sayyiban nafi'an\" — narrated in Sahih al-Bukhari) and is connected to Salat al-Istisqa (the prayer for rain) observed across the madhahib during drought.",
    practicalAction:
      "The next time it rains, say the Prophetic du'a for beneficial rain rather than letting the moment pass without remembrance.",
  },
};

export function getSynthesisEntry(surahNumber: number, ayahNumber: number): SynthesisEntry | undefined {
  return SYNTHESIS_DATA[key(surahNumber, ayahNumber)];
}
