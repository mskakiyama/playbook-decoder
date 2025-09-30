import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Calendar, BookOpen, Trophy, Search } from "lucide-react";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlossaryTerms, useGlossarySearch, useGlossaryStats } from "@/hooks/useGlossaryData";
import { GlossaryTerm } from "@/lib/custom-glossary-api";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { useTranslation } from "react-i18next";

const TermCard = ({ term }: { term: GlossaryTerm }) => (
  <Card className="bg-card/40 backdrop-blur-sm border-border/30 hover:bg-card/60 transition-all duration-200 hover:scale-[1.02]">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-sans font-bold text-foreground">{term.name}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
        {term.definition}
      </CardDescription>
      {term.examples && term.examples.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-foreground/80">Examples:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
            {term.examples.map((example, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
);

const TermsGrid = ({ terms, isLoading }: { terms: GlossaryTerm[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded bg-muted/20" />
        ))}
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No terms found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {terms.map((term) => (
        <TermCard key={term.id} term={term} />
      ))}
    </div>
  );
};

export default function Glossary() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  const { data: glossaryData, isLoading: glossaryLoading } = useGlossaryTerms();
  const { data: searchResults, isLoading: searchLoading } = useGlossarySearch(searchQuery);
  const stats = useGlossaryStats();

  const navItems = [
    { name: t('common.home'), url: '/', icon: Home },
    { name: t('common.schedule'), url: '/schedule', icon: Calendar },
    { name: t('standings.title'), url: '/standings', icon: Trophy },
    { name: t('common.glossary'), url: '/glossary', icon: BookOpen }
  ];

  // Filter all categories based on search query
  const filteredData = useMemo(() => {
    if (!glossaryData || !searchQuery.trim()) return glossaryData?.grouped;
    
    const query = searchQuery.toLowerCase();
    return {
      rules: glossaryData.grouped.rules.filter(term =>
        term.name.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      ),
      positions: glossaryData.grouped.positions.filter(term =>
        term.name.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      ),
      penalties: glossaryData.grouped.penalties.filter(term =>
        term.name.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      ),
      other: glossaryData.grouped.other.filter(term =>
        term.name.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      )
    };
  }, [glossaryData, searchQuery]);

  const hasResults = filteredData && Object.values(filteredData).some(terms => terms.length > 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Header */}
      <header className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm"></div>
        
        {/* Header Controls */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <LanguageDropdown />
          {user ? (
            <Button variant="glass" onClick={signOut} className="shadow-glass">
              {t('common.signOut')}
            </Button>
          ) : (
            <ShimmerButton onClick={() => navigate('/auth')} className="shadow-glass">
              <span className="text-sm font-medium">{t('common.signIn')}</span>
            </ShimmerButton>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-center max-w-4xl mx-auto px-6">
          <img src={playerImage} alt="Football Player" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
          <div className="text-center mx-8">
            <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-white mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent leading-tight lg:text-7xl">
              {t('glossary.title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-normal">
              {t('glossary.subtitle')}
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="hidden sm:block w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>
      </header>

      {/* Navigation Menu */}
      <NavBar items={navItems} />

      {/* Search Header */}
      <section className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-background/80 via-background/90 to-background/80 shadow-glass mt-8">
        <div className="container mx-auto px-6 py-2">
          <div className="relative max-w-md mx-auto mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t('glossary.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base bg-card/40 backdrop-blur-sm border-border/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-16">
        {searchQuery.trim() && !hasResults && !searchLoading && (
          <div className="text-center py-12">
            <div className="bg-card/40 backdrop-blur-sm border border-border/30 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Results Found
              </h3>
              <p className="text-muted-foreground">
                No terms match your search for "{searchQuery}". Try different keywords or browse by category below.
              </p>
            </div>
          </div>
        )}

        <Accordion type="multiple" className="space-y-4" defaultValue={["rules", "positions", "penalties"]}>
          {/* Rules & Plays */}
          <AccordionItem value="rules" className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <span className="font-sans font-bold text-lg">{t('glossary.rulesAndPlays')}</span>
                <span className="text-sm text-muted-foreground">
                  ({filteredData?.rules.length || 0} terms)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <TermsGrid 
                terms={filteredData?.rules || []} 
                isLoading={glossaryLoading}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Positions */}
          <AccordionItem value="positions" className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-field-green to-field-green-dark"></div>
                <span className="font-sans font-bold text-lg">{t('glossary.positions')}</span>
                <span className="text-sm text-muted-foreground">
                  ({filteredData?.positions.length || 0} terms)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <TermsGrid 
                terms={filteredData?.positions || []} 
                isLoading={glossaryLoading}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Penalties */}
          <AccordionItem value="penalties" className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                <span className="font-sans font-bold text-lg">{t('glossary.penalties')}</span>
                <span className="text-sm text-muted-foreground">
                  ({filteredData?.penalties.length || 0} terms)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <TermsGrid 
                terms={filteredData?.penalties || []} 
                isLoading={glossaryLoading}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Other Terms */}
          {filteredData?.other && filteredData.other.length > 0 && (
            <AccordionItem value="other" className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-touchdown-gold to-yellow-500"></div>
                  <span className="font-sans font-bold text-lg">{t('glossary.otherTerms')}</span>
                  <span className="text-sm text-muted-foreground">
                    ({filteredData.other.length} terms)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <TermsGrid 
                  terms={filteredData.other} 
                  isLoading={glossaryLoading}
                />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Glossary sourced from{" "}
              <a 
                href="https://www.nfl.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                NFL
              </a>
              {" "}– Updated as of 2025
            </p>
            <p className="text-xs mt-2 opacity-75">
              Terms and definitions subject to official NFL rule changes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
