import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Zap, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  return (
    <footer className="bg-[#0D1B2A] text-white" dir={direction}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#006D77] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">ElectroHub</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {t('footer.about')}
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#E9C46A]">
              {t('footer.courses')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/courses"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('courseData.plc.title')}
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('courseData.power.title')}
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('courseData.robotics.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#E9C46A]">
              {t('footer.resources')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <span className="text-sm text-white/60">
                  {t('footer.faq')}
                </span>
              </li>
              <li>
                <span className="text-sm text-white/60">
                  {t('footer.blog')}
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[#E9C46A]">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <span className="text-sm text-white/60">
                  {t('footer.terms')}
                </span>
              </li>
              <li className="flex items-center gap-1.5 pt-2">
                <Lock className="w-3.5 h-3.5 text-[#006D77]" />
                <span className="text-xs text-white/50">
                  SSL {direction === 'rtl' ? 'تشفير' : 'Encrypted'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-start">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">
              {direction === 'rtl' ? 'متصل' : 'Online'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
