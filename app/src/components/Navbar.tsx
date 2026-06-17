import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Menu,
  X,
  Globe,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Home,
  Info,
  Mail,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLang, setLanguage, direction } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleLang = () => {
    setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/courses', label: t('nav.courses'), icon: BookOpen },
    { to: '/about', label: t('nav.about'), icon: Info },
    { to: '/contact', label: t('nav.contact'), icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E5E5]'
          : 'bg-transparent'
      }`}
      dir={direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#006D77] flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono-tech">E</span>
            </div>
            <span className="font-bold text-lg text-[#1A1A1A]">
              ElectroHub
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-[#006D77] bg-[#006D77]/10'
                    : 'text-[#1A1A1A]/70 hover:text-[#006D77] hover:bg-[#006D77]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#1A1A1A]/70 hover:text-[#006D77] hover:bg-[#006D77]/5 transition-colors"
              title={currentLang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#006D77] hover:bg-[#006D77]/10 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E9C46A]/20">
                  <span className="text-sm font-mono-tech font-semibold text-[#B8860B]">
                    {user?.xp || 0} XP
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#1A1A1A]/70 hover:text-[#006D77] transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/login"
                  className="shimmer-btn px-4 py-2 rounded-lg text-sm font-medium text-white"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#1A1A1A] hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E5E5] shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-[#006D77] bg-[#006D77]/10'
                    : 'text-[#1A1A1A]/70 hover:text-[#006D77] hover:bg-[#006D77]/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#E5E5E5] pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#006D77] hover:bg-[#006D77]/10"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A1A1A]/70 hover:text-[#006D77] text-center"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/login"
                    className="shimmer-btn px-3 py-2.5 rounded-lg text-sm font-medium text-white text-center"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
