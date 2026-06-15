import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#FDFBF5]"
      dir={direction}
    >
      <Card className="w-full max-w-sm text-center border-[#E5E5E5] shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#006D77]/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-[#006D77]" />
            </div>
          </div>
          <CardTitle className="text-5xl font-bold text-[#1A1A1A]">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[#1A1A1A]/50">{t('notFound.message')}</p>
          <Button 
            asChild 
            className="w-full bg-[#006D77] hover:bg-[#005a63]"
          >
            <Link to="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              {t('notFound.backHome')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
