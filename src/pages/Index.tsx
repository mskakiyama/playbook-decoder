import { useState } from "react";
import { GameSelector } from "@/components/GameSelector";
import { PlayTimeline } from "@/components/PlayTimeline";
import { PlayDiagram } from "@/components/PlayDiagram";
import { PlayCard } from "@/components/PlayCard";
import { FilterBar } from "@/components/FilterBar";
import { PlaysGrid } from "@/components/PlaysGrid";
import playerImage from "@/assets/player.svg";
import player2Image from "@/assets/player2.svg";
const Index = () => {
  const [selectedGame, setSelectedGame] = useState("chiefs-bills");
  const [selectedPlay, setSelectedPlay] = useState(0);
  const [playFilter, setPlayFilter] = useState("all");
  const mockPlays = [{
    id: 1,
    quarter: 1,
    time: "14:23",
    down: 1,
    distance: 10,
    yardLine: "KC 25",
    playType: "passing",
    result: "Touchdown",
    description: "Mahomes finds Kelce for 75-yard touchdown pass",
    players: ["P. Mahomes", "T. Kelce"],
    yards: 75,
    success: true,
    keyPlay: true
  }, {
    id: 2,
    quarter: 1,
    time: "10:15",
    down: 2,
    distance: 7,
    yardLine: "BUF 15",
    playType: "rushing",
    result: "First Down",
    description: "Allen scrambles right for 12 yards",
    players: ["J. Allen"],
    yards: 12,
    success: true,
    keyPlay: false
  }, {
    id: 3,
    quarter: 2,
    time: "8:42",
    down: 3,
    distance: 3,
    yardLine: "KC 40",
    playType: "passing",
    result: "Interception",
    description: "Allen's pass intercepted by Sneed",
    players: ["J. Allen", "L.D. Sneed"],
    yards: 0,
    success: false,
    keyPlay: true
  }];
  const filteredPlays = playFilter === "all" ? mockPlays : mockPlays.filter(play => play.playType === playFilter);
  return <div className="min-h-screen bg-gradient-background bg-slate-900 px-0 mx-0">
      {/* Hero Header */}
      <div className="relative h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-hero backdrop-blur-sm mx-0 my-0 py-0 px-0 bg-transparent"></div>
        <div className="relative z-10 flex items-center justify-center backdrop-blur-lg rounded-2xl p-8 border border-transparent bg-transparent">
          <img src={playerImage} alt="Football Player" className="w-21 h-21 md:w-26 md:h-26 mr-6 object-contain" />
          <div className="text-center">
            <h1 className="text-4xl font-gugi text-primary-foreground mb-4 bg-gradient-to-r from-white via-primary-foreground to-field-green bg-clip-text text-transparent font-normal md:text-6xl">
              NFL Plays Breakdown
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Deep dive into every play with interactive analysis
            </p>
          </div>
          <img src={player2Image} alt="Football Player 2" className="w-21 h-21 md:w-26 md:h-26 ml-6 object-contain" />
        </div>
      </div>

      <div className="w-full bg-slate-900 py-[30px]">
        <div className="container px-[36px] mx-[81px]">
        {/* Game Selection & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <GameSelector selectedGame={selectedGame} onGameChange={setSelectedGame} />
            
            {/* All Plays Grid - Shows when "All Plays" filter is selected */}
            {playFilter === "all" && <PlaysGrid plays={filteredPlays} onPlaySelect={setSelectedPlay} />}
          </div>
          <div>
            <FilterBar activeFilter={playFilter} onFilterChange={setPlayFilter} />
          </div>
        </div>

        {/* Main Content Grid - Hidden when All Plays is selected */}
        {playFilter !== "all" && <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Play Timeline */}
            <div className="xl:col-span-1">
              <PlayTimeline plays={filteredPlays} selectedPlay={selectedPlay} onPlaySelect={setSelectedPlay} />
            </div>

            {/* Play Details & Diagram */}
            <div className="xl:col-span-2 space-y-6">
              {/* Selected Play Card */}
              <PlayCard play={filteredPlays[selectedPlay]} expanded={true} />

              {/* Interactive Play Diagram */}
              <PlayDiagram play={filteredPlays[selectedPlay]} />
            </div>
          </div>}
        </div>
      </div>
    </div>;
};
export default Index;