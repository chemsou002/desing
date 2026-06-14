import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, User, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'register';

function getGoogleOAuthUrl() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/google/callback`;
  const state = btoa(redirectUri);

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', googleClientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');

  return url.toString();
}

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = t('auth.errors.emailRequired');
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = t('auth.errors.invalidEmail');
    if (!password) errs.password = t('auth.errors.passwordRequired');
    else if (password.length < 6) errs.password = t('auth.errors.passwordShort');

    if (mode === 'register') {
      if (!name.trim()) errs.name = t('auth.errors.nameRequired');
      if (password !== confirmPassword) errs.confirm = t('auth.errors.passwordMatch');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(email, password);
        if (ok) {
          setSuccess(true);
          setTimeout(() => navigate(redirect), 800);
        } else {
          setErrors({ general: direction === 'rtl' ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password' });
        }
      } else {
        const ok = await register(name, email, password);
        if (ok) {
          setSuccess(true);
          setTimeout(() => navigate(redirect), 800);
        } else {
          setErrors({ general: direction === 'rtl' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already registered' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF5] flex items-center justify-center" dir={direction}>
      <div className="w-full max-w-md mx-auto px-4">
        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#006D77] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              {mode === 'login' ? t('auth.login') : t('auth.register')}
            </h1>
            <p className="text-sm text-[#1A1A1A]/50 mt-1">
              {mode === 'login'
                ? direction === 'rtl'
                  ? 'سجل دخولك لمتابعة رحلتك التعليمية'
                  : 'Sign in to continue your learning journey'
                : direction === 'rtl'
                ? 'أنشئ حسابك وابدأ رحلتك التعليمية'
                : 'Create your account and start learning'}
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-600 font-semibold">
                {direction === 'rtl' ? 'تم بنجاح!' : 'Success!'}
              </p>
              <p className="text-sm text-[#1A1A1A]/50 mt-1">
                {direction === 'rtl' ? 'جاري التوجيه...' : 'Redirecting...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                  {errors.general}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                    {t('auth.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                      placeholder={direction === 'rtl' ? 'محمد أحمد' : 'John Doe'}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-sm font-medium text-[#1A1A1A] mb-1.5 block">
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="ai-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E5E5] text-sm focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="shimmer-btn w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner" />
                ) : (
                  <>
                    {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
                    <ArrowIcon className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E5E5]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[#1A1A1A]/40">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={() => {
                  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                  if (!clientId || clientId === 'your-google-client-id') {
                    setErrors({
                      general: direction === 'rtl'
                        ? 'لم يتم تكوين Google OAuth بعد. يرجى إضافة معرف العميل في إعدادات البيئة.'
                        : 'Google OAuth is not configured yet. Please add the Client ID in environment settings.'
                    });
                    return;
                  }
                  window.location.href = getGoogleOAuthUrl();
                }}
                className="w-full py-3 rounded-xl border border-[#E5E5E5] bg-white text-[#1A1A1A] font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {direction === 'rtl' ? 'التسجيل بحساب Google' : 'Sign in with Google'}
              </button>
            </form>
          )}

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#1A1A1A]/50">
              {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrors({});
                }}
                className="text-[#006D77] font-semibold hover:underline"
              >
                {mode === 'login' ? t('auth.createOne') : t('auth.loginNow')}
              </button>
            </p>
          </div>

          {/* Guest */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-xs text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
            >
              {t('auth.guest')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
