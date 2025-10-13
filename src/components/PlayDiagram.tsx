import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Target } from "lucide-react";
import { FORMATIONS, FormationData } from "@/lib/formations-data";
import { detectFormation } from "@/lib/formation-detector";

interface Play {
  id: number;
  quarter: number;
  time: string;
  down: number;
  distance: number;
  yardLine: string;
  playType: string;
  result: string;
  description: string;
  players: string[];
  yards: number;
  success: boolean;
  keyPlay: boolean;
}

interface PlayDiagramProps {
  play?: Play;
}

export const PlayDiagram = ({ play }: PlayDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Early return if no play data
  if (!play) {
    return (
      <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Select a play to view diagram</p>
        </div>
      </Card>
    );
  }

  useEffect(() => {
    if (!canvasRef.current || !play) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#16a34a');
    gradient.addColorStop(1, '#14532d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw yard lines
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      const x = (i * canvas.width) / 10;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw hash marks
    ctx.strokeStyle = '#ffffff30';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = ((i + 0.5) * canvas.width) / 10;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.4);
      ctx.lineTo(x, canvas.height * 0.6);
      ctx.stroke();
    }

    // Detect formation and draw it
    const formationKey = detectFormation(play.description, play.playType);
    const formation = FORMATIONS[formationKey];
    
    if (formation) {
      drawFormation(ctx, canvas, formation);
    }

  }, [play]);

  const drawFormation = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    formation: FormationData
  ) => {
    formation.playerPositions.forEach((player) => {
      const x = (player.x / 100) * canvas.width;
      const y = (player.y / 100) * canvas.height;
      
      // Draw routes first (so they appear behind players)
      if (player.route && player.route.length > 0) {
        ctx.strokeStyle = '#22c55e80';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        player.route.forEach((point) => {
          const routeX = (point.x / 100) * canvas.width;
          const routeY = (point.y / 100) * canvas.height;
          ctx.lineTo(routeX, routeY);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Draw player circle
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw white border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw position label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.label, x, y);
    });
  };


  // Get formation info for display
  const formationKey = play ? detectFormation(play.description, play.playType) : 'shotgun-spread';
  const formation = FORMATIONS[formationKey];

  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-glass-secondary rounded-lg backdrop-blur-sm">
            <Activity className="h-5 w-5 text-field-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Play Diagram</h2>
            {play && formation && (
              <p className="text-xs text-muted-foreground mt-1">{formation.name}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary text-white backdrop-blur-lg border border-white/20">
            <Users className="h-3 w-3 mr-1" />
            <span className="text-white font-semibold">Offense</span>
          </Badge>
          <Badge className="bg-card-glass text-white backdrop-blur-lg border border-white/20">
            <Target className="h-3 w-3 mr-1" />
            <span className="text-white font-semibold">Defense</span>
          </Badge>
        </div>
      </div>

      <div className="relative">
        <div className="p-4 bg-gradient-glass-secondary backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
          <canvas 
            ref={canvasRef}
            className="w-full rounded-lg bg-field-green animate-field-glow shadow-diagram"
            style={{ maxHeight: '300px' }}
          />
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 p-2 bg-card-glass backdrop-blur-lg rounded-lg border border-white/10">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-glass"></div>
            <span>Offensive Line</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card-glass backdrop-blur-lg rounded-lg border border-white/10">
            <div className="w-4 h-4 bg-interception-red rounded-full border-2 border-white shadow-glass"></div>
            <span>Quarterback</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card-glass backdrop-blur-lg rounded-lg border border-white/10">
            <div className="w-4 h-4 bg-success-green rounded-full border-2 border-white shadow-glass"></div>
            <span>Receivers</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card-glass backdrop-blur-lg rounded-lg border border-white/10">
            <div className="w-4 h-4 bg-neutral-gray rounded-full border-2 border-white shadow-glass"></div>
            <span>Defense</span>
          </div>
        </div>
      </div>

      {/* Formation Details */}
      {play && formation && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-glass-primary backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
            <h3 className="font-semibold mb-2 text-primary">Offensive Personnel</h3>
            <p className="text-sm text-muted-foreground">{formation.offensivePersonnel}</p>
          </div>
          <div className="p-4 bg-gradient-glass-secondary backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
            <h3 className="font-semibold mb-2 text-field-green">Defensive Personnel</h3>
            <p className="text-sm text-muted-foreground">{formation.defensivePersonnel}</p>
          </div>
        </div>
      )}
    </Card>
  );
};