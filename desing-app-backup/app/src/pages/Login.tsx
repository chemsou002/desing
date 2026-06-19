import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogIn, Globe } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const { t } = useTranslation();
  const { direction, currentLang, setLanguage } = useLanguage();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#FDFBF5] relative overflow-hidden"
      dir={direction}
    >
      {/* Decorative background */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,109,119,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(233,196,106,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#006D77] flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-2xl font-mono-tech">E</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">ElectroHub</h1>
          <p className="text-sm text-[#1A1A1A]/50 mt-1">{t('loginPage.subtitle')}</p>
        </div>

        <Card className="border-[#E5E5E5] shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-[#1A1A1A]">
              {t('loginPage.welcome')}
            </CardTitle>
            <p className="text-sm text-[#1A1A1A]/50 mt-1">
              {t('loginPage.description')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-[#006D77] hover:bg-[#005a63] text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {t('loginPage.signInButton')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#1A1A1A]/40">
                  {t('loginPage.or')}
                </span>
              </div>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(currentLang === 'ar' ? 'en' : 'ar')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#1A1A1A]/70 hover:text-[#006D77] hover:bg-[#006D77]/5 border border-[#E5E5E5] hover:border-[#006D77]/20 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[#1A1A1A]/40 mt-6">
          {t('loginPage.terms')}
        </p>
      </div>
    </div>
  );
}
