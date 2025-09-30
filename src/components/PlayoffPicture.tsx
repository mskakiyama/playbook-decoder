import { StandingsData } from "@/lib/nfl-standings-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Trophy, Award } from "lucide-react";

interface PlayoffPictureProps {
  standingsData: StandingsData;
}

interface PlayoffSeed {
  seed: number;
  team: string;
  abbreviation: string;
  record: string;
  winPct: number;
  isDivisionWinner: boolean;
  logo?: string;
}

export const PlayoffPicture = ({ standingsData }: PlayoffPictureProps) => {
  const { t } = useTranslation();

  const calculatePlayoffSeeds = (conferenceName: string): PlayoffSeed[] => {
    const conference = standingsData.conferences.find(c => c.name === conferenceName);
    if (!conference) return [];

    // Get division winners (rank 1 from each division)
    const divisionWinners = conference.divisions
      .map(div => div.teams.find(t => t.rank === 1))
      .filter(Boolean)
      .map(team => ({
        seed: 0,
        team: team!.team,
        abbreviation: team!.abbreviation,
        record: team!.record,
        winPct: team!.winPct,
        isDivisionWinner: true,
        logo: team!.logo
      }));

    // Sort division winners by win percentage
    divisionWinners.sort((a, b) => b.winPct - a.winPct);

    // Assign seeds 1-4 to division winners
    divisionWinners.forEach((team, index) => {
      team.seed = index + 1;
    });

    // Get all non-division winners for wild card spots
    const wildCardTeams = conference.divisions
      .flatMap(div => div.teams.filter(t => t.rank > 1))
      .map(team => ({
        seed: 0,
        team: team.team,
        abbreviation: team.abbreviation,
        record: team.record,
        winPct: team.winPct,
        isDivisionWinner: false,
        logo: team.logo
      }));

    // Sort wild card teams by win percentage
    wildCardTeams.sort((a, b) => b.winPct - a.winPct);

    // Take top 3 wild card teams
    const wildCards = wildCardTeams.slice(0, 3).map((team, index) => ({
      ...team,
      seed: 5 + index
    }));

    return [...divisionWinners, ...wildCards];
  };

  const afcSeeds = calculatePlayoffSeeds('AFC');
  const nfcSeeds = calculatePlayoffSeeds('NFC');

  const SeedCard = ({ seed }: { seed: PlayoffSeed }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 hover:bg-card/60 transition-all">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        seed.seed <= 2 ? 'bg-gradient-to-br from-touchdown-gold to-yellow-600 text-black' :
        seed.seed <= 4 ? 'bg-gradient-to-br from-field-green to-field-green-dark text-white' :
        'bg-gradient-to-br from-primary to-blue-600 text-white'
      }`}>
        {seed.seed}
      </div>
      <div className="flex items-center gap-2 flex-1">
        {seed.logo && (
          <img src={seed.logo} alt={`${seed.team} logo`} className="h-6 w-6 object-contain" />
        )}
        <div className="flex-1">
          <div className="font-medium text-sm text-foreground">{seed.team}</div>
          <div className="text-xs text-muted-foreground">{seed.record}</div>
        </div>
      </div>
      {seed.isDivisionWinner && (
        <Badge variant="outline" className="text-xs border-success-green/30 text-success-green">
          <Trophy className="h-3 w-3 mr-1" />
          Div
        </Badge>
      )}
      {!seed.isDivisionWinner && (
        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
          <Award className="h-3 w-3 mr-1" />
          WC
        </Badge>
      )}
    </div>
  );

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-oswald font-bold text-foreground mb-2">
          {t('standings.playoffPicture')}
        </h2>
        <p className="text-muted-foreground">
          {t('standings.currentSeedings')} • {t('standings.week')} {standingsData.week}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AFC */}
        <Card className="bg-card/20 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-600" />
              AFC
            </CardTitle>
            <CardDescription>
              {t('standings.top7Teams')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {afcSeeds.map(seed => (
              <SeedCard key={seed.seed} seed={seed} />
            ))}
          </CardContent>
        </Card>

        {/* NFC */}
        <Card className="bg-card/20 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
              NFC
            </CardTitle>
            <CardDescription>
              {t('standings.top7Teams')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {nfcSeeds.map(seed => (
              <SeedCard key={seed.seed} seed={seed} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-touchdown-gold" />
          <span>{t('standings.divisionWinner')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <span>{t('standings.wildCard')}</span>
        </div>
      </div>
    </section>
  );
};
