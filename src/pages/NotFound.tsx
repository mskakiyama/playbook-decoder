import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {/* Language Dropdown */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageDropdown />
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">{t('notFound.title')}</h1>
        <p className="mb-4 text-xl text-white/80">{t('notFound.message')}</p>
        <a href="/" className="text-primary underline hover:text-primary/80 transition-colors">
          {t('notFound.returnHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
