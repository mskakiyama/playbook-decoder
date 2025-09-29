import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface LanguageDropdownProps {
  className?: string;
}

export const LanguageDropdown = ({ 
  className
}: LanguageDropdownProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];
  const isChanging = i18n.isInitialized === false;

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "flex items-center gap-2 text-foreground/80 hover:text-foreground",
            "bg-transparent hover:bg-white/10 border-0",
            className
          )}
          disabled={isChanging}
        >
          {isChanging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-48 rounded-lg bg-card/95 backdrop-blur-lg border border-border/50 shadow-glass-hover" 
        align="end"
      >
        <DropdownMenuGroup>
          {LANGUAGES.map((language) => (
            <DropdownMenuItem 
              key={language.code}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                "hover:bg-muted/50",
                currentLanguage.code === language.code && "bg-muted/30"
              )}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium text-foreground">{language.name}</span>
              {currentLanguage.code === language.code && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;