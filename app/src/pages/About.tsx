import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Users, Lightbulb, Zap } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const values = [
    {
      icon: Target,
      title: isRTL ? 'رؤيتنا' : 'Our Vision',
      desc: isRTL
        ? 'أن نكون المنصة الرائدة عربياً في تعليم الأتمتة الصناعية.'
        : 'To be the leading Arab platform for industrial automation education.',
    },
    {
      icon: Lightbulb,
      title: isRTL ? 'رسالتنا' : 'Our Mission',
      desc: t('about.missionText'),
    },
    {
      icon: Users,
      title: isRTL ? 'مجتمعنا' : 'Our Community',
      desc: isRTL
        ? 'مجتمع نابض من المهندسين والفنيين المتعلمين والخبراء.'
        : 'A vibrant community of engineers, technicians, learners, and experts.',
    },
    {
      icon: Zap,
      title: isRTL ? 'تعلم تفاعلي' : 'Interactive Learning',
      desc: isRTL
        ? 'تعلم من خلال المحاكاة والممارسة العملية وليس مجرد النظرية.'
        : 'Learn through simulation and hands-on practice, not just theory.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-[#006D77] font-medium">{t('about.subtitle')}</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 mb-10">
          <p className="text-[#1A1A1A]/70 leading-relaxed mb-4">{t('about.desc1')}</p>
          <p className="text-[#1A1A1A]/70 leading-relaxed">{t('about.desc2')}</p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-[#006D77] to-[#004D55] rounded-2xl p-6 sm:p-8 mb-10 text-white text-center">
          <h2 className="text-xl font-bold mb-3">{t('about.mission')}</h2>
          <p className="text-white/80 leading-relaxed max-w-2xl mx-auto">
            {t('about.missionText')}
          </p>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">
          {isRTL ? 'قيمنا' : 'Our Values'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#006D77]/10 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-[#006D77]" />
              </div>
              <h3 className="font-bold text-[#1A1A1A] mb-2">{v.title}</h3>
              <p className="text-sm text-[#1A1A1A]/50">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 text-center">
          {t('about.team')}
        </h2>
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 text-center max-w-xs">
            <img
              src="/instructor.jpg"
              alt="Instructor"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="font-bold text-[#1A1A1A]">
              {isRTL ? 'أحمد الخالدي' : 'Ahmad Al-Khaldi'}
            </h3>
            <p className="text-sm text-[#006D77] mb-2">
              {isRTL ? 'مدرب معتمد في الأتمتة الصناعية' : 'Certified Automation Trainer'}
            </p>
            <p className="text-xs text-[#1A1A1A]/50">
              {isRTL
                ? 'خبرة 10+ سنوات في مجال الأتمتة والتحكم الصناعي'
                : '10+ years of experience in automation and industrial control'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
