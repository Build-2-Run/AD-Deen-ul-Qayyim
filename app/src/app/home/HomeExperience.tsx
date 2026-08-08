import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../design/icons/Icon';

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export function HomeExperience() {
  const [activeTab, setActiveTab] = useState<'all' | 'revelation' | 'fiqh'>('all');
  const [currentDate, setCurrentDate] = useState({ gregorian: '', hijri: '' });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Date setup
  useEffect(() => {
    const today = new Date();
    const greg = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const hijri = '15 Safar 1448 AH';
    setCurrentDate({ gregorian: greg, hijri });
  }, []);

  // 3D Canvas Engine: 3D Glowing Crescent Moon & Stardust Particle Constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 3D particles with z-depth & stardust trails
    const particles = Array.from({ length: 120 }).map(() => ({
      x: (Math.random() - 0.5) * width * 1.6,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 1000 + 1,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.85 + 0.15,
      speedZ: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.3 ? '#f5c75d' : '#6ee7b7',
    }));

    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.08;
      mouseY = (e.clientY - height / 2) * 0.08;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep 3D Celestial Space Background Gradient
      const grad = ctx.createRadialGradient(
        width / 2 + mouseX * 1.5,
        height / 3 + mouseY * 1.5,
        40,
        width / 2,
        height / 2,
        width * 0.85
      );
      grad.addColorStop(0, 'rgba(245, 199, 93, 0.15)');
      grad.addColorStop(0.35, 'rgba(12, 24, 36, 0.95)');
      grad.addColorStop(1, '#060d14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Interactive 3D Glowing Crescent Moon Centerpiece
      const moonX = width / 2 + mouseX * 0.5;
      const moonY = 160 + mouseY * 0.5 + Math.sin(time) * 6;
      const moonRadius = 45;

      // Outer Crescent Glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3);
      moonGlow.addColorStop(0, 'rgba(245, 199, 93, 0.35)');
      moonGlow.addColorStop(0.5, 'rgba(245, 199, 93, 0.1)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Golden Crescent Body
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f5c75d';
      ctx.shadowColor = '#f5c75d';
      ctx.shadowBlur = 30;
      ctx.fill();

      // Shadow Cutout for Crescent Moon
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(moonX + 16, moonY - 10, moonRadius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw and project 3D Stardust Particles
      const fov = 420;
      const centerX = width / 2 + mouseX;
      const centerY = height / 2 + mouseY;

      particles.forEach((p) => {
        p.z -= p.speedZ;
        if (p.z <= 0) p.z = 1000;

        const scale = fov / (fov + p.z);
        const projX = p.x * scale + centerX;
        const projY = p.y * scale + centerY;
        const projSize = p.size * scale * 2;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          ctx.beginPath();
          ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color === '#f5c75d'
            ? `rgba(245, 199, 93, ${p.alpha * scale * 1.3})`
            : `rgba(110, 231, 183, ${p.alpha * scale * 1.3})`;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10 * scale;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#060d14]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;700&family=Outfit:wght@400;600;800;900&display=swap');
        .card-3d-wrapper {
          perspective: 1000px;
        }
        .card-3d-body {
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s ease;
          transform-style: preserve-3d;
        }
      `}</style>

      {/* 3D Real-Time Crescent & Stardust Particle Canvas Engine */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 md:py-12 relative z-10">

        {/* 🕌 SACRED OPENING HEADER: 3D BISMILLAH & DUROOD IBRAHIM */}
        <header className="text-center mb-12 pt-16">
          
          {/* Bismillah */}
          <div className="mb-6 card-3d-wrapper">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold text-[#f5c75d] uppercase tracking-widest bg-[#f5c75d]/10 border border-[#f5c75d]/30 mb-3 shadow-[0_0_16px_rgba(245,199,93,0.25)]">
              <span>🌙</span> DESIGN 6: 3D CRESCENT MOON &amp; STARDUST CONSTELLATION <span>🌙</span>
            </div>
            <h1
              dir="rtl"
              className="font-arabic text-4xl sm:text-5xl md:text-6xl font-bold text-[#f5c75d] my-2 leading-relaxed"
              style={{
                fontFamily: "'Amiri', serif",
                textShadow: '0 0 30px rgba(245,199,93,0.6), 0 0 60px rgba(245,199,93,0.3)',
                transform: 'translateZ(30px)',
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
          </div>

          {/* Durood Ibrahim Banner */}
          <div className="card-3d-wrapper max-w-4xl mx-auto mb-10">
            <div
              className="p-6 md:p-8 rounded-2xl relative overflow-hidden text-center backdrop-blur-md"
              style={{
                background: 'radial-gradient(circle at 50% 30%, rgba(245, 199, 93, 0.18), transparent 75%), rgba(12, 24, 36, 0.85)',
                border: '1.5px solid rgba(245, 199, 93, 0.45)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 0 20px rgba(245,199,93,0.1)',
              }}
            >
              <div className="text-[10px] font-bold text-[#f5c75d] uppercase tracking-widest mb-3">
                ﷺ SALAWAT UPON THE PROPHET • DUROOD-E-IBRAHIM
              </div>

              <div
                dir="rtl"
                className="font-arabic text-lg sm:text-xl md:text-2xl font-bold text-[#f5c75d] leading-loose mb-4"
                style={{ fontFamily: "'Amiri', serif", textShadow: '0 0 18px rgba(245,199,93,0.4)' }}
              >
                اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
                <br />
                اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
              </div>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-3xl mx-auto mb-2">
                "O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious."
              </p>

              <p dir="rtl" className="text-xs text-[#6ee7b7] leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                اے اللہ! درود بھیج محمد (ﷺ) پر اور آلِ محمد (ﷺ) پر، جیسے تو نے درود بھیجا ابراہیم (علیہ السلام) پر اور آلِ ابراہیم پر، بیشک تو تعریف کے لائق اور بزرگ ہے۔
              </p>
            </div>
          </div>

          {/* Platform Title */}
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-white">AD-Deen-ul-Qayyim</span>{' '}
            <span style={{ background: 'linear-gradient(135deg, #f5c75d 0%, #6ee7b7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 16px rgba(110,231,183,0.4))' }}>
              (الدَّينُ القَيِّمُ)
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-[#6ee7b7] text-base md:text-lg font-semibold leading-relaxed" style={{ textShadow: '0 0 12px rgba(110,231,183,0.3)' }}>
            Learn, practice, and understand Islam through authentic Qur'an, Sunnah, and verified scholarly rulings.
          </p>
        </header>

        {/* 📅 LIVE DATE & 3D PRAYER TIMES DASHBOARD */}
        <section className="mb-12">
          
          {/* Date Bar */}
          <div className="p-4 rounded-xl bg-[#0c1824]/90 border border-white/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#f5c75d]/10 text-[#f5c75d] border border-[#f5c75d]/30">
                <Icon name="Calendar" size={20} />
              </div>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">Today's Date</div>
                <div className="text-sm font-bold text-white">{currentDate.gregorian}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5c75d]/15 border border-[#f5c75d]/40 text-[#f5c75d] font-extrabold text-sm shadow-[0_0_12px_rgba(245,199,93,0.2)]">
              <span>🌙</span> {currentDate.hijri}
            </div>
          </div>

          {/* Prayer & Voluntary Times Grid */}
          <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.9)] border border-[rgba(245,199,93,0.35)] shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={20} className="text-[#f5c75d]" />
                <h3 className="font-bold text-white text-base">Daily Prayer &amp; Voluntary Times (Salaat, Ishraq &amp; Chasht)</h3>
              </div>
              <span className="text-xs text-[#6ee7b7] font-semibold">📍 Local Time</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 text-center">
              
              {/* Fajr */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-[#f5c75d] mb-1">Fajr</div>
                <div className="text-sm font-bold text-white">04:32 AM</div>
              </div>

              {/* Sunrise (Shuruq) */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">Sunrise 🌅</div>
                <div className="text-sm font-bold text-white">05:52 AM</div>
              </div>

              {/* Ishraq */}
              <div className="p-3 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 hover:bg-[#f5c75d]/20 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-extrabold text-[#f5c75d] mb-1">Ishraq ☀️</div>
                <div className="text-sm font-bold text-white">06:07 AM</div>
              </div>

              {/* Chasht (Duha) */}
              <div className="p-3 rounded-xl bg-[#6ee7b7]/10 border border-[#6ee7b7]/30 hover:bg-[#6ee7b7]/20 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-extrabold text-[#6ee7b7] mb-1">Chasht (Duha) 🌤️</div>
                <div className="text-sm font-bold text-white">09:15 AM</div>
              </div>

              {/* Dhuhr */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-[#f5c75d] mb-1">Dhuhr</div>
                <div className="text-sm font-bold text-white">12:24 PM</div>
              </div>

              {/* Asr */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-[#f5c75d] mb-1">Asr</div>
                <div className="text-sm font-bold text-white">04:02 PM</div>
              </div>

              {/* Sunset (Ghurub) */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-orange-400 mb-1">Sunset 🌇</div>
                <div className="text-sm font-bold text-white">06:55 PM</div>
              </div>

              {/* Maghrib */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-[#f5c75d] mb-1">Maghrib</div>
                <div className="text-sm font-bold text-white">06:56 PM</div>
              </div>

              {/* Isha */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#f5c75d]/50 transition-all hover:scale-105">
                <div className="text-[10px] uppercase font-bold text-[#f5c75d] mb-1">Isha</div>
                <div className="text-sm font-bold text-white">08:14 PM</div>
              </div>

            </div>
          </div>
        </section>

        {/* 📖 DAILY SPIRITUAL TRIO: DAILY AAYAT + DAILY HADEES + DAILY DUA */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Daily Verse (Aayat) */}
            <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.9)] border border-[rgba(245,199,93,0.35)] flex flex-col justify-between backdrop-blur-md shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-[#f5c75d] uppercase tracking-wider bg-[#f5c75d]/15 border border-[#f5c75d]/30">
                    📖 DAILY AAYAT
                  </span>
                  <span className="text-xs text-white/60">Surah Al-Baqarah (2:255)</span>
                </div>

                <div dir="rtl" className="font-arabic text-xl font-bold text-[#f5c75d] leading-relaxed mb-3" style={{ fontFamily: "'Amiri', serif" }}>
                  اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...
                </div>

                <p className="text-xs text-white/90 leading-relaxed mb-2">
                  "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence."
                </p>

                <p dir="rtl" className="text-xs text-[#6ee7b7] leading-relaxed" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                  اللہ کے سوا کوئی عبادت کے لائق نہیں، وہ زندہ ہے، سب کا سنبھالنے والا ہے۔
                </p>
              </div>
            </div>

            {/* 2. Daily Hadith (Hadees) */}
            <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.9)] border border-[rgba(110,231,183,0.35)] flex flex-col justify-between backdrop-blur-md shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-[#6ee7b7] uppercase tracking-wider bg-[#6ee7b7]/15 border border-[#6ee7b7]/30">
                    📜 DAILY HADEES
                  </span>
                  <span className="text-xs text-[#6ee7b7] font-semibold">SAHIH AL-BUKHARI 1</span>
                </div>

                <div dir="rtl" className="font-arabic text-xl font-bold text-[#6ee7b7] leading-relaxed mb-3" style={{ fontFamily: "'Amiri', serif" }}>
                  « إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ »
                </div>

                <p className="text-xs text-white/90 leading-relaxed mb-2">
                  "Actions are judged according to intentions, and every person will get what they intended."
                </p>

                <p dir="rtl" className="text-xs text-[#6ee7b7] leading-relaxed" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                  اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔
                </p>
              </div>
            </div>

            {/* 3. Daily Supplication (Dua) */}
            <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.9)] border border-[rgba(245,199,93,0.35)] flex flex-col justify-between backdrop-blur-md shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-[#f5c75d] uppercase tracking-wider bg-[#f5c75d]/15 border border-[#f5c75d]/30">
                    🤲 DAILY DUA
                  </span>
                  <span className="text-xs text-white/60">Qur'an 20:114</span>
                </div>

                <div dir="rtl" className="font-arabic text-xl font-bold text-[#f5c75d] leading-relaxed mb-3" style={{ fontFamily: "'Amiri', serif" }}>
                  رَّبِّ زِدْنِي عِلْمًا
                </div>

                <p className="text-xs text-white/90 leading-relaxed mb-2">
                  "My Lord, increase me in knowledge."
                </p>

                <p dir="rtl" className="text-xs text-[#6ee7b7] leading-relaxed" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                  اے میرے رب! میرے علم میں اضافہ فرما۔
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 🌟 3D INTERACTIVE TILT KNOWLEDGE CARDS */}
        <section className="mb-12">
          
          {/* Filter Tabs */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              🌟 All Knowledge Sections
            </button>
            <button
              onClick={() => setActiveTab('revelation')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === 'revelation'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              📖 Qur'an &amp; Tafsir
            </button>
            <button
              onClick={() => setActiveTab('fiqh')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === 'fiqh'
                  ? 'bg-[#f5c75d] text-black shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                  : 'bg-[#0c1824] text-white border border-[#f5c75d]/40 hover:bg-[#f5c75d]/20 hover:text-[#f5c75d]'
              }`}
            >
              ⚖️ Fiqh &amp; Daily Rulings
            </button>
          </div>

          {/* 3D Tilt Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1: Qur'an Word-by-Word Reader */}
            {(activeTab === 'all' || activeTab === 'revelation') && (
              <Interactive3DCard
                to="/quran"
                badgeText="QUR'AN READER"
                badgeColor="#f5c75d"
                iconName="BookOpen"
                title="The Noble Qur'an"
                description="Read word-by-word with English & Urdu translations or recite from the classic 15-line South Asian Mushaf."
                buttonText="Open Qur'an Reader"
              />
            )}

            {/* Card 2: Dedicated 7-Tafseer Engine */}
            {(activeTab === 'all' || activeTab === 'revelation') && (
              <Interactive3DCard
                to="/tafsir"
                badgeText="SCHOLARLY COMMENTARY"
                badgeColor="#6ee7b7"
                iconName="Book"
                title="Scholarly Tafsir & Rulings"
                description="Study 7 authentic commentaries from Ibn Kathir, Al-Tabari, Al-Qurtubi, and As-Sa'di alongside modern scientific observations."
                buttonText="Read Tafsir"
              />
            )}

            {/* Card 3: Mirath Inheritance Engine */}
            {(activeTab === 'all' || activeTab === 'fiqh') && (
              <Interactive3DCard
                to="/mirath"
                badgeText="INHERITANCE FIQH"
                badgeColor="#f5c75d"
                iconName="Scale"
                title="Estate & Inheritance (ʿIlm al-Farāʾiḍ)"
                description="Calculate Islamic estate distribution according to Qur'anic shares (Furūḍ), residuaries (ʿAṣabah), and blocking rules (Ḥajb)."
                buttonText="Calculate Inheritance"
              />
            )}

            {/* Card 4: Zakat & Live Metal Prices */}
            {(activeTab === 'all' || activeTab === 'fiqh') && (
              <Interactive3DCard
                to="/zakat"
                badgeText="PURIFICATION OF WEALTH"
                badgeColor="#6ee7b7"
                iconName="Coins"
                title="Zakat & Live Nisab Calculator"
                description="Calculate Zakat on cash, gold, silver, business inventory, livestock, and agriculture with live market metal prices."
                buttonText="Calculate Zakat"
              />
            )}

            {/* Card 5: Qurbani (Udhiyah) & Share Calculator */}
            {(activeTab === 'all' || activeTab === 'fiqh') && (
              <Interactive3DCard
                to="/qurbani"
                badgeText="RITUAL SACRIFICE"
                badgeColor="#f5c75d"
                iconName="CheckCircle"
                title="Qurbani & Udhiyah Rulings"
                description="Learn sacrificial animal requirements, defect rules, 3-part Sunnah meat distribution, and silver Nisab eligibility."
                buttonText="View Qurbani Guide"
              />
            )}

            {/* Card 6: Sahih Hadith Corpora */}
            {(activeTab === 'all' || activeTab === 'revelation') && (
              <Interactive3DCard
                to="/hadith"
                badgeText="SUNNAH & HADITH"
                badgeColor="#6ee7b7"
                iconName="BookOpen"
                title="Prophetic Traditions (Hadith)"
                description="Search authentic Hadith books including Sahih al-Bukhari and Sahih Muslim with verified chains of narration."
                buttonText="Browse Hadiths"
              />
            )}

          </div>
        </section>

      </div>
    </div>
  );
}

// 3D Perspective Tilt Card Component
function Interactive3DCard({
  to,
  badgeText,
  badgeColor,
  iconName,
  title,
  description,
  buttonText,
}: {
  to: string;
  badgeText: string;
  badgeColor: string;
  iconName: any;
  title: string;
  description: string;
  buttonText: string;
}) {
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = -((y - centerY) / centerY) * 10;

    setTilt({ rotateX, rotateY, scale: 1.03 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div className="card-3d-wrapper">
      <Link
        to={to}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="block h-full"
      >
        <div
          className="card-3d-body rounded-2xl p-6 h-full flex flex-col justify-between backdrop-blur-md group"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
            background: `radial-gradient(circle at 90% 10%, ${badgeColor}22, transparent 60%), rgba(12, 24, 36, 0.9)`,
            border: `1.5px solid ${badgeColor}66`,
            borderLeft: `5px solid ${badgeColor}`,
            boxShadow: tilt.scale > 1 ? `0 20px 40px ${badgeColor}33` : '0 12px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                style={{ color: badgeColor, backgroundColor: `${badgeColor}22`, borderColor: `${badgeColor}44` }}
              >
                {badgeText}
              </span>
              <Icon name={iconName} size={24} style={{ color: badgeColor }} />
            </div>

            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white group-hover:text-[#f5c75d] transition-colors mb-2">
              {title}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed mb-6">{description}</p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5 group-hover:underline" style={{ color: badgeColor }}>
              <span>{buttonText}</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
