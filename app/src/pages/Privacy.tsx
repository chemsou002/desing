import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Database, FileText, Lock } from 'lucide-react';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: t('privacy.intro'),
      text: t('privacy.intro'),
    },
    {
      icon: Database,
      title: t('privacy.collection'),
      text: t('privacy.collectionText'),
    },
    {
      icon: Shield,
      title: t('privacy.usage'),
      text: t('privacy.usageText'),
    },
    {
      icon: Lock,
      title: t('privacy.security'),
      text: t('privacy.securityText'),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5]" dir={direction}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-3">
            {t('privacy.title')}
          </h1>
          <p className="text-sm text-[#1A1A1A]/40">{t('privacy.lastUpdated')}</p>
        </div>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#006D77]/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-[#006D77]" />
                </div>
                <h2 className="font-bold text-lg text-[#1A1A1A]">{s.title}</h2>
              </div>
              <p className="text-[#1A1A1A]/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
