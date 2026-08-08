import { ReaderView } from '../components/ReaderView';
import { ReaderBlock, ReaderHeader, ReaderContent, ReaderFooter } from '../components/ReaderBlock';
import { Citation } from '../components/Citation';
import { KnowledgeMedia } from '../components/KnowledgeMedia';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Heading } from '../../../design/typography/Heading';
import { Flex } from '../../../design/primitives/Flex';
import { Icon } from '../../../design/icons/Icon';
import { IconButton, Button } from '../../../design/components/Button';

export function ReaderLab() {
  return (
    <ReaderView title="Universal Reader Laboratory">
      <div className="mb-12">
        <Heading level={1} size="3xl" className="mb-4">Reader Laboratory</Heading>
        <Body variant="secondary">
          Testing the ADQ Universal Reader against various knowledge structures without changing the underlying components.
        </Body>
      </div>

      {/* QURAN NODE */}
      <ReaderBlock id="quran-2-255">
        <ReaderHeader>
          <Flex align="center" className="gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-sm font-semibold">255</span>
            <Caption variant="secondary" className="uppercase tracking-widest font-semibold">Al-Baqarah</Caption>
          </Flex>
          <Flex align="center" className="gap-2">
            <IconButton variant="ghost"><Icon name="Play" size={16} /></IconButton>
            <IconButton variant="ghost"><Icon name="Bookmark" size={16} /></IconButton>
          </Flex>
        </ReaderHeader>
        
        <ReaderContent>
          {/* Staggered Alignment: Arabic Right, Translation Left */}
          <div className="flex flex-col gap-6">
            <div className="text-right">
              <ArabicText size="2xl">
                اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ
              </ArabicText>
            </div>
            
            <div className="text-left max-w-2xl">
              <Body size="lg" className="leading-relaxed">
                Allah! There is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.
              </Body>
            </div>
          </div>
        </ReaderContent>
        
        <ReaderFooter>
          <Citation 
            id="tafsir-ibn-kathir-2-255" 
            title="Tafsir Ibn Kathir" 
            type="tafsir"
            content={<Body>This is Ayatul Kursi, the greatest verse in the Book of Allah...</Body>}
          >
            <Flex align="center" className="gap-2 text-sm font-medium">
              <Icon name="BookOpen" size={14} /> Read Tafsir
            </Flex>
          </Citation>
        </ReaderFooter>
      </ReaderBlock>

      {/* HADITH NODE */}
      <ReaderBlock id="hadith-bukhari-1">
        <ReaderHeader>
          <Caption variant="secondary" className="uppercase tracking-widest font-semibold">Sahih al-Bukhari 1</Caption>
          <IconButton variant="ghost"><Icon name="Share2" size={16} /></IconButton>
        </ReaderHeader>
        
        <ReaderContent>
          <div className="flex flex-col gap-6">
            <div className="text-right">
              <ArabicText size="xl">
                إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
              </ArabicText>
            </div>
            <div className="text-left max-w-2xl">
              <Body size="lg" className="leading-relaxed">
                Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
              </Body>
            </div>
          </div>
        </ReaderContent>
        
        <ReaderFooter>
          <Citation 
            id="sharh-nawawi-1" 
            title="Sharh an-Nawawi" 
            type="hadith"
            content={<Body>Imam an-Nawawi explains that intention is the pillar of all worship...</Body>}
          >
            <Flex align="center" className="gap-2 text-sm font-medium">
              <Icon name="Scroll" size={14} /> View Commentary
            </Flex>
          </Citation>
        </ReaderFooter>
      </ReaderBlock>

      {/* FIQH NODE */}
      <ReaderBlock id="fiqh-wudu">
        <ReaderHeader>
          <Caption variant="secondary" className="uppercase tracking-widest font-semibold">Fiqh • Purification</Caption>
        </ReaderHeader>
        
        <ReaderContent>
          <Heading level={2} size="xl" className="mb-4">The Obligations of Wudu (Ablution)</Heading>
          <Body className="leading-relaxed mb-4">
            According to the majority of scholars, the obligatory acts of Wudu are derived from the Quranic verse in Surah Al-Ma'idah 
            <Citation 
              id="quran-5-6" 
              title="Surah Al-Ma'idah (5:6)" 
              type="quran" 
              content={
                <div className="text-right"><ArabicText>يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ...</ArabicText></div>
              }
            >
              [5:6]
            </Citation>. 
            There are generally four agreed-upon obligations:
          </Body>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-primary)]">
            <li>Washing the face completely.</li>
            <li>Washing both arms up to and including the elbows.</li>
            <li>Wiping a portion of the head.</li>
            <li>Washing both feet up to and including the ankles.</li>
          </ul>
        </ReaderContent>
        
        <ReaderFooter>
          <Button variant="secondary">View Madhhab Differences</Button>
        </ReaderFooter>
      </ReaderBlock>

      {/* HISTORY NODE */}
      <ReaderBlock id="history-badr">
        <ReaderHeader>
          <Caption variant="secondary" className="uppercase tracking-widest font-semibold">Islamic History • 2 AH</Caption>
        </ReaderHeader>
        
        <ReaderContent>
          <Heading level={2} size="xl" className="mb-4">The Battle of Badr</Heading>
          <Body className="leading-relaxed">
            The Battle of Badr, fought on Tuesday, 13 March 624 CE (17 Ramadan, 2 AH), was a key battle in the early days of Islam and a turning point in Muhammad's (ﷺ) struggle with his opponents among the Quraish in Mecca.
          </Body>
          <KnowledgeMedia 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Battle_of_Badr.png/800px-Battle_of_Badr.png" 
            alt="Map of the Battle of Badr" 
            caption="Strategic positioning of Muslim and Quraish forces at the wells of Badr."
            aspectRatio="video"
          />
        </ReaderContent>
      </ReaderBlock>

    </ReaderView>
  );
}
