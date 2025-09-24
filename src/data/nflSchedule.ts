// 2025 NFL Regular Season Schedule Data
export interface Game {
  week: number;
  date: string;
  opponent: string;
  isHome: boolean;
  time: string;
  network: string;
  isDivisional: boolean;
  isPrimetime: boolean;
  isBye?: boolean;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  projectedRecord: string;
  games: Game[];
}

export interface Division {
  name: string;
  teams: Team[];
}

export interface Conference {
  name: string;
  color: string;
  divisions: Division[];
}

// Sample comprehensive schedule data for 2025 NFL season
export const nflScheduleData: Conference[] = [
  {
    name: "AFC",
    color: "hsl(214 100% 45%)", // AFC Blue
    divisions: [
      {
        name: "East",
        teams: [
          {
            id: "buf",
            name: "Buffalo Bills",
            abbreviation: "BUF",
            city: "Buffalo",
            projectedRecord: "11-6",
            games: [
              { week: 1, date: "09/07", opponent: "vs MIA", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "@ NYJ", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "vs NE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "@ BAL", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 5, date: "10/05", opponent: "vs HOU", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "@ TEN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "vs TB", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "@ MIA", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "vs IND", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "@ KC", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 12, date: "11/23", opponent: "@ SF", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 13, date: "11/30", opponent: "vs NE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "vs LA", isHome: true, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "@ DET", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "vs NYJ", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "@ NE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "vs MIA", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "mia",
            name: "Miami Dolphins",
            abbreviation: "MIA",
            city: "Miami",
            projectedRecord: "9-8",
            games: [
              { week: 1, date: "09/07", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "vs NE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ SEA", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs TEN", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "@ NYJ", isHome: false, time: "9:30 PM", network: "ESPN", isDivisional: true, isPrimetime: true },
              { week: 6, date: "10/12", opponent: "vs MIN", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "@ IND", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "vs BUF", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "@ ARI", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "vs LA", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "@ LV", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 13, date: "11/30", opponent: "vs GB", isHome: true, time: "8:15 PM", network: "Amazon", isDivisional: false, isPrimetime: true },
              { week: 14, date: "12/07", opponent: "vs NYJ", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "@ HOU", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "vs SF", isHome: true, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "@ CLE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "ne",
            name: "New England Patriots",
            abbreviation: "NE",
            city: "New England",
            projectedRecord: "6-11",
            games: [
              { week: 1, date: "09/07", opponent: "@ CIN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "@ MIA", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs SF", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "@ DAL", isHome: false, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "vs HOU", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "@ JAC", isHome: false, time: "9:30 AM", network: "NFL Network", isDivisional: false, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "vs NYJ", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "@ TEN", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "vs CHI", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "@ LA", isHome: false, time: "4:05 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "vs IND", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 13, date: "11/30", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 15, date: "12/14", opponent: "@ ARI", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 17, date: "01/04", opponent: "vs BUF", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "vs NYJ", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "nyj",
            name: "New York Jets",
            abbreviation: "NYJ",
            city: "New York",
            projectedRecord: "7-10",
            games: [
              { week: 1, date: "09/07", opponent: "vs SF", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 2, date: "09/14", opponent: "vs BUF", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ DEN", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs DEN", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "vs MIA", isHome: true, time: "9:30 PM", network: "ESPN", isDivisional: true, isPrimetime: true },
              { week: 6, date: "10/12", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "vs PIT", isHome: true, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 8, date: "10/26", opponent: "@ NE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "vs HOU", isHome: true, time: "8:15 PM", network: "Amazon", isDivisional: false, isPrimetime: true },
              { week: 10, date: "11/09", opponent: "@ ARI", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "vs IND", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 13, date: "11/30", opponent: "@ SEA", isHome: false, time: "4:05 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "@ MIA", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "@ JAC", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "@ BUF", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "vs MIA", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "@ NE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          }
        ]
      },
      {
        name: "North", 
        teams: [
          {
            id: "bal",
            name: "Baltimore Ravens",
            abbreviation: "BAL",
            city: "Baltimore", 
            projectedRecord: "12-5",
            games: [
              { week: 1, date: "09/07", opponent: "vs KC", isHome: true, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 2, date: "09/14", opponent: "@ LV", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "vs DAL", isHome: true, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs BUF", isHome: true, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 5, date: "10/05", opponent: "@ CIN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "@ WAS", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "vs CLE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "@ CLE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "vs DEN", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "@ CIN", isHome: false, time: "8:15 PM", network: "Amazon", isDivisional: true, isPrimetime: true },
              { week: 11, date: "11/16", opponent: "vs PIT", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "@ LAC", isHome: false, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 13, date: "11/30", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 14, date: "12/07", opponent: "vs NYG", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "@ PIT", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "vs HOU", isHome: true, time: "4:30 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "@ CLE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "vs CIN", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "pit",
            name: "Pittsburgh Steelers",
            abbreviation: "PIT",
            city: "Pittsburgh",
            projectedRecord: "11-6",
            games: [
              { week: 1, date: "09/07", opponent: "@ ATL", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "vs DEN", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ LAC", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs IND", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "@ DAL", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 6, date: "10/12", opponent: "@ LV", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "@ NYJ", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 8, date: "10/26", opponent: "vs NYG", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 9, date: "11/02", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 10, date: "11/09", opponent: "vs WAS", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "@ BAL", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "vs CLE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 13, date: "11/30", opponent: "@ CIN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "@ CLE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "vs BAL", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "@ KC", isHome: false, time: "1:00 PM", network: "Netflix", isDivisional: false, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "@ CIN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "vs CLE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "cin",
            name: "Cincinnati Bengals",
            abbreviation: "CIN",
            city: "Cincinnati",
            projectedRecord: "9-8",
            games: [
              { week: 1, date: "09/07", opponent: "vs NE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "@ KC", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "vs WAS", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 4, date: "09/28", opponent: "@ CAR", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "vs BAL", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "@ NYG", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 7, date: "10/19", opponent: "@ CLE", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "vs PHI", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "@ LV", isHome: false, time: "4:05 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "vs BAL", isHome: true, time: "8:15 PM", network: "Amazon", isDivisional: true, isPrimetime: true },
              { week: 11, date: "11/16", opponent: "@ LAC", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 12, date: "11/23", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 13, date: "11/30", opponent: "vs PIT", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "vs DAL", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 15, date: "12/14", opponent: "@ TEN", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "vs CLE", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "vs PIT", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "@ BAL", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          },
          {
            id: "cle",
            name: "Cleveland Browns",
            abbreviation: "CLE",
            city: "Cleveland",
            projectedRecord: "7-10",
            games: [
              { week: 1, date: "09/07", opponent: "@ DAL", isHome: false, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "vs JAC", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ NYG", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "@ LV", isHome: false, time: "4:25 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 5, date: "10/05", opponent: "vs WAS", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "@ PHI", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "@ BAL", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 8, date: "10/26", opponent: "vs BAL", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "vs LAC", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 10, date: "11/09", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 11, date: "11/16", opponent: "@ NO", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "@ PIT", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 13, date: "11/30", opponent: "vs DEN", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 14, date: "12/07", opponent: "vs PIT", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 15, date: "12/14", opponent: "@ KC", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "@ CIN", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 17, date: "12/28", opponent: "vs BAL", isHome: true, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "@ PIT", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
            ]
          }
        ]
      },
      {
        name: "South",
        teams: [
          {
            id: "hou",
            name: "Houston Texans", 
            abbreviation: "HOU",
            city: "Houston",
            projectedRecord: "10-7",
            games: [
              { week: 1, date: "09/07", opponent: "@ IND", isHome: false, time: "1:00 PM", network: "CBS", isDivisional: true, isPrimetime: false }
              // ... additional games would go here for brevity
            ]
          }
          // ... additional teams would go here for brevity  
        ]
      },
      {
        name: "West", 
        teams: [
          {
            id: "kc",
            name: "Kansas City Chiefs",
            abbreviation: "KC", 
            city: "Kansas City",
            projectedRecord: "13-4",
            games: [
              { week: 1, date: "09/07", opponent: "@ BAL", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true }
              // ... additional games would go here for brevity
            ]
          }
          // ... additional teams would go here for brevity
        ]
      }
    ]
  },
  {
    name: "NFC",
    color: "hsl(0 100% 65%)", // NFC Red
    divisions: [
      {
        name: "East",
        teams: [
          {
            id: "dal",
            name: "Dallas Cowboys",
            abbreviation: "DAL", 
            city: "Dallas",
            projectedRecord: "10-7",
            games: [
              { week: 1, date: "09/07", opponent: "vs CLE", isHome: true, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 2, date: "09/14", opponent: "@ NO", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 3, date: "09/21", opponent: "@ BAL", isHome: false, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 4, date: "09/28", opponent: "vs NYG", isHome: true, time: "8:20 PM", network: "NBC", isDivisional: true, isPrimetime: true },
              { week: 5, date: "10/05", opponent: "vs NE", isHome: true, time: "4:25 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 6, date: "10/12", opponent: "@ DET", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 7, date: "10/19", opponent: "vs SF", isHome: true, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true },
              { week: 8, date: "10/26", opponent: "@ ATL", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 9, date: "11/02", opponent: "vs PHI", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: true, isPrimetime: true },
              { week: 10, date: "11/09", opponent: "@ PHI", isHome: false, time: "4:25 PM", network: "FOX", isDivisional: true, isPrimetime: false },
              { week: 11, date: "11/16", opponent: "vs WAS", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: true, isPrimetime: false },
              { week: 12, date: "11/23", opponent: "BYE", isHome: true, time: "—", network: "—", isDivisional: false, isPrimetime: false, isBye: true },
              { week: 13, date: "11/30", opponent: "@ NYG", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: true, isPrimetime: false },
              { week: 14, date: "12/07", opponent: "vs CIN", isHome: true, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true },
              { week: 15, date: "12/14", opponent: "@ CAR", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false },
              { week: 16, date: "12/21", opponent: "@ TB", isHome: false, time: "8:15 PM", network: "Netflix", isDivisional: false, isPrimetime: true },
              { week: 17, date: "12/28", opponent: "vs PHI", isHome: true, time: "4:25 PM", network: "FOX", isDivisional: true, isPrimetime: false },
              { week: 18, date: "01/04", opponent: "@ WAS", isHome: false, time: "1:00 PM", network: "FOX", isDivisional: true, isPrimetime: false }
            ]
          }
          // ... additional teams would go here for brevity
        ]
      },
      {
        name: "North",
        teams: [
          {
            id: "det",
            name: "Detroit Lions",
            abbreviation: "DET",
            city: "Detroit", 
            projectedRecord: "11-6",
            games: [
              { week: 1, date: "09/07", opponent: "@ LA", isHome: false, time: "8:20 PM", network: "NBC", isDivisional: false, isPrimetime: true }
              // ... additional games would go here for brevity
            ]
          }
          // ... additional teams would go here for brevity
        ]
      },
      {
        name: "South",
        teams: [
          {
            id: "atl",
            name: "Atlanta Falcons",
            abbreviation: "ATL",
            city: "Atlanta",
            projectedRecord: "9-8", 
            games: [
              { week: 1, date: "09/07", opponent: "vs PIT", isHome: true, time: "1:00 PM", network: "FOX", isDivisional: false, isPrimetime: false }
              // ... additional games would go here for brevity
            ]
          }
          // ... additional teams would go here for brevity
        ]
      },
      {
        name: "West",
        teams: [
          {
            id: "sf", 
            name: "San Francisco 49ers",
            abbreviation: "SF",
            city: "San Francisco",
            projectedRecord: "11-6",
            games: [
              { week: 1, date: "09/07", opponent: "@ NYJ", isHome: false, time: "8:15 PM", network: "ESPN", isDivisional: false, isPrimetime: true }
              // ... additional games would go here for brevity
            ]
          }
          // ... additional teams would go here for brevity
        ]
      }
    ]
  }
];

// Helper functions for filtering and searching
export const searchTeams = (query: string): Team[] => {
  if (!query) return [];
  
  const allTeams = nflScheduleData.flatMap(conference => 
    conference.divisions.flatMap(division => division.teams)
  );
  
  return allTeams.filter(team => 
    team.name.toLowerCase().includes(query.toLowerCase()) ||
    team.city.toLowerCase().includes(query.toLowerCase()) ||
    team.abbreviation.toLowerCase().includes(query.toLowerCase())
  );
};

export const filterGamesByWeek = (team: Team, week: number): Game[] => {
  return team.games.filter(game => game.week === week);
};

export const getTeamByAbbreviation = (abbreviation: string): Team | undefined => {
  const allTeams = nflScheduleData.flatMap(conference => 
    conference.divisions.flatMap(division => division.teams)
  );
  
  return allTeams.find(team => team.abbreviation === abbreviation);
};