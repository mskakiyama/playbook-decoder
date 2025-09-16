import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Target } from "lucide-react";

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
  play: Play;
}

export const PlayDiagram = ({ play }: PlayDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !play) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = '#16a34a'; // field-green
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw yard lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      const x = (i * canvas.width) / 10;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw hash marks
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = ((i + 0.5) * canvas.width) / 10;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.4);
      ctx.lineTo(x, canvas.height * 0.6);
      ctx.stroke();
    }

    // Draw formations based on play type
    if (play.playType === 'passing') {
      drawPassingFormation(ctx, canvas);
    } else if (play.playType === 'rushing') {
      drawRushingFormation(ctx, canvas);
    } else {
      drawSpecialTeamsFormation(ctx, canvas);
    }

  }, [play]);

  const drawPassingFormation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Offensive line (blue)
    ctx.fillStyle = '#1e40af';
    const lineY = canvas.height * 0.7;
    for (let i = 0; i < 5; i++) {
      const x = canvas.width * 0.3 + (i * 30);
      drawPlayer(ctx, x, lineY, 12);
    }

    // Quarterback (red)
    ctx.fillStyle = '#dc2626';
    drawPlayer(ctx, canvas.width * 0.35, lineY - 40, 14);

    // Receivers (green) with routes
    ctx.fillStyle = '#16a34a';
    const receiverPositions = [
      { x: canvas.width * 0.2, y: lineY - 20 },
      { x: canvas.width * 0.6, y: lineY - 30 },
      { x: canvas.width * 0.8, y: lineY - 10 }
    ];

    receiverPositions.forEach((pos, index) => {
      drawPlayer(ctx, pos.x, pos.y, 10);
      // Draw route
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + 50 + (index * 20), pos.y - 80);
      ctx.stroke();
    });

    // Defense (gray)
    ctx.fillStyle = '#6b7280';
    for (let i = 0; i < 7; i++) {
      const x = canvas.width * 0.25 + (i * 40);
      drawPlayer(ctx, x, canvas.height * 0.3, 10);
    }
  };

  const drawRushingFormation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Tight formation for running play
    ctx.fillStyle = '#1e40af';
    const lineY = canvas.height * 0.7;
    for (let i = 0; i < 5; i++) {
      const x = canvas.width * 0.35 + (i * 25);
      drawPlayer(ctx, x, lineY, 12);
    }

    // Running back (yellow)
    ctx.fillStyle = '#eab308';
    drawPlayer(ctx, canvas.width * 0.4, lineY - 30, 12);

    // Fullback (orange)
    ctx.fillStyle = '#f97316';
    drawPlayer(ctx, canvas.width * 0.45, lineY - 15, 10);

    // Defense (gray) - run defense
    ctx.fillStyle = '#6b7280';
    for (let i = 0; i < 8; i++) {
      const x = canvas.width * 0.3 + (i * 35);
      drawPlayer(ctx, x, canvas.height * 0.35, 10);
    }
  };

  const drawSpecialTeamsFormation = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Spread formation for special teams
    ctx.fillStyle = '#1e40af';
    for (let i = 0; i < 11; i++) {
      const x = canvas.width * 0.1 + (i * (canvas.width * 0.8) / 10);
      drawPlayer(ctx, x, canvas.height * 0.7, 10);
    }

    ctx.fillStyle = '#6b7280';
    for (let i = 0; i < 11; i++) {
      const x = canvas.width * 0.1 + (i * (canvas.width * 0.8) / 10);
      drawPlayer(ctx, x, canvas.height * 0.3, 10);
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <Card className="p-6 bg-card-glass backdrop-blur-xl border border-white/20 shadow-glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-glass-secondary rounded-lg backdrop-blur-sm">
            <Activity className="h-5 w-5 text-field-green" />
          </div>
          <h2 className="text-xl font-bold">Play Diagram</h2>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-gradient-glass-primary backdrop-blur-lg border border-white/20 text-primary-foreground">
            <Users className="h-3 w-3 mr-1" />
            Offense
          </Badge>
          <Badge className="bg-card-glass backdrop-blur-lg border border-white/20">
            <Target className="h-3 w-3 mr-1" />
            Defense
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

      {/* Play Analysis */}
      <div className="mt-6 p-4 bg-gradient-glass-primary backdrop-blur-lg rounded-xl border border-white/20 shadow-glass">
        <h3 className="font-semibold mb-2 text-field-green">Formation Analysis</h3>
        <p className="text-sm text-muted-foreground">
          {play.playType === 'passing' 
            ? "Spread formation with receivers running precise routes. The quarterback has multiple options depending on defensive coverage."
            : play.playType === 'rushing'
            ? "Power running formation with tight end and fullback providing extra blocking. Designed to create running lanes between tackles."
            : "Special teams alignment with coverage specialists positioned for maximum field position advantage."
          }
        </p>
      </div>
    </Card>
  );
};