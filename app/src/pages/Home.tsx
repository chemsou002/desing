import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { courses } from '@/data/courses';
import {
  PlayCircle,
  Cpu,
  Trophy,
  Award,
  Wrench,
  Users,
  ArrowLeft,
  ArrowRight,
  Zap,
  BookOpen,
  Star,
  Shield,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

/* ─── 3D Tilt Card ─── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setTilt({ x: -y, y: x });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── Slot Counter ─── */
const SlotCounter: React.FC<{ value: number; suffix?: string; duration?: number }> = ({
  value,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value, duration]);

  return (
    <div ref={ref} className="font-mono-tech text-3xl sm:text-4xl font-bold text-white">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

/* ─── Home Page ─── */
const Home: React.FC = () => {
  const { t } = useTranslation();
  const { direction, currentLang } = useLanguage();
  const isRTL = direction === 'rtl';

  const features = [
    {
      icon: PlayCircle,
      title: t('features.interactive.title'),
      desc: t('features.interactive.desc'),
      color: 'bg-[#006D77]/10 text-[#006D77]',
    },
    {
      icon: Cpu,
      title: t('features.simulation.title'),
      desc: t('features.simulation.desc'),
      color: 'bg-[#E9C46A]/10 text-[#B8860B]',
    },
    {
      icon: Trophy,
      title: t('features.xp.title'),
      desc: t('features.xp.desc'),
      color: 'bg-[#0D1B2A]/10 text-[#0D1B2A]',
    },
    {
      icon: Award,
      title: t('features.certificates.title'),
      desc: t('features.certificates.desc'),
      color: 'bg-[#006D77]/10 text-[#006D77]',
    },
    {
      icon: Wrench,
      title: t('features.projects.title'),
      desc: t('features.projects.desc'),
      color: 'bg-[#E9C46A]/10 text-[#B8860B]',
    },
    {
      icon: Users,
      title: t('features.community.title'),
      desc: t('features.community.desc'),
      color: 'bg-[#0D1B2A]/10 text-[#0D1B2A]',
    },
  ];

  const displayedCourses = courses.slice(0, 3);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div dir={direction}>
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-[#FDFBF5]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF5]/80 via-transparent to-[#FDFBF5]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Text Content */}
            <div className="text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006D77]/10 text-[#006D77] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t('hero.badge')}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#006D77] mb-6">
                {t('hero.subtitle')}
              </p>
              <p className="text-base sm:text-lg text-[#1A1A1A]/60 leading-relaxed max-w-xl mx-auto lg:mx-0 whitespace-pre-line mb-8">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  to="/login"
                  className="shimmer-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  {t('hero.cta1')}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#E5E5E5] text-[#1A1A1A] font-semibold text-sm hover:border-[#006D77] hover:text-[#006D77] transition-colors"
                >
                  <ArrowIcon className="w-4 h-4" />
                  {t('hero.cta2')}
                </Link>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-[#1A1A1A]/50">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#006D77]" />
                  <span>{t('hero.stats1')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#006D77]" />
                  <span>{t('hero.stats2')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#E9C46A]" />
                  <span>{t('hero.stats3')}</span>
                </div>
              </div>
            </div>

            {/* Hero Card (3D Tilt) */}
            <div className="hidden lg:flex justify-center">
              <TiltCard className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-[#1A1A1A]/50 mb-1">
                        {isRTL ? 'منصة تعلم الأتمتة' : 'Automation Learning'}
                      </div>
                      <div className="font-bold text-lg">ElectroHub</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#006D77] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="font-mono-tech text-xl font-bold text-[#B8860B]">1.2K</div>
                      <div className="text-xs text-[#1A1A1A]/50 mt-1">
                        {isRTL ? 'متعلم' : 'Learners'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono-tech text-xl font-bold text-[#006D77]">12</div>
                      <div className="text-xs text-[#1A1A1A]/50 mt-1">
                        {isRTL ? 'محاكاة' : 'Sims'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono-tech text-xl font-bold text-[#0D1B2A]">+48</div>
                      <div className="text-xs text-[#1A1A1A]/50 mt-1">
                        {isRTL ? 'دورة' : 'Courses'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs text-[#1A1A1A]/50 mb-2">
                      {isRTL ? 'مسار التعلم الحالي' : 'Current Learning Path'}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{isRTL ? 'برمجة PLC أساسي' : 'Basic PLC'}</span>
                        <span className="font-mono-tech text-[#006D77]">75%</span>
                      </div>
                      <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div className="h-full w-[75%] bg-[#006D77] rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{isRTL ? 'إلكترونيات القوة' : 'Power Electronics'}</span>
                        <span className="font-mono-tech text-[#006D77]">45%</span>
                      </div>
                      <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-[#00B4D8] rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E5E5E5]">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-[#1A1A1A]/50">
                      {isRTL ? 'متصل' : 'Online'}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-[#006D77] uppercase tracking-wider">
              {t('features.title')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-3 mb-4">
              {t('features.subtitle')}
            </h2>
            <p className="text-[#1A1A1A]/50 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#006D77]/20 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{feat.title}</h3>
                <p className="text-sm text-[#1A1A1A]/50 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section className="py-20 bg-[#FDFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <span className="text-sm font-semibold text-[#006D77] uppercase tracking-wider">
                {t('courses.title')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-3">
                {t('courses.subtitle')}
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[#006D77] font-semibold text-sm hover:underline shrink-0"
            >
              {t('courses.viewAll')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] hover:shadow-xl hover:border-[#006D77]/20 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#006D77]/10 to-[#006D77]/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-[#006D77]/20" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.level === 'beginner'
                          ? 'bg-[#006D77] text-white'
                          : course.level === 'intermediate'
                          ? 'bg-[#E9C46A] text-[#1A1A1A]'
                          : 'bg-[#0D1B2A] text-white'
                      }`}
                    >
                      {t(`courses.levels.${course.level}`)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 group-hover:text-[#006D77] transition-colors">
                    {course.title[currentLang as 'ar' | 'en']}
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/50 leading-relaxed mb-4 line-clamp-2">
                    {course.description[currentLang as 'ar' | 'en']}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#1A1A1A]/40">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {course.lessons} {t('courses.lessons')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>
                        {course.hours} {t('courses.hours')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-20 bg-gradient-to-br from-[#006D77] to-[#004D55]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <SlotCounter value={1200} suffix="+" />
              <div className="text-white/60 text-sm mt-2">{t('stats.learners')}</div>
            </div>
            <div>
              <SlotCounter value={48} suffix="+" />
              <div className="text-white/60 text-sm mt-2">{t('stats.courses')}</div>
            </div>
            <div>
              <SlotCounter value={12} />
              <div className="text-white/60 text-sm mt-2">{t('stats.simulations')}</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <SlotCounter value={4} suffix=".9" />
              </div>
              <div className="text-white/60 text-sm mt-2">{t('stats.rating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-[#0D1B2A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="shimmer-btn inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold"
            >
              {t('cta.register')}
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {t('cta.login')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
