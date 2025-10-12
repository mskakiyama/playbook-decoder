-- Create power_rankings table
CREATE TABLE IF NOT EXISTS public.power_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INTEGER NOT NULL,
  team TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  record TEXT NOT NULL,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  ties INTEGER NOT NULL DEFAULT 0,
  rank_change INTEGER NOT NULL DEFAULT 0,
  week INTEGER NOT NULL,
  season INTEGER NOT NULL DEFAULT 2025,
  source TEXT NOT NULL DEFAULT 'Sharp Football Analysis',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team, week, season)
);

-- Enable Row Level Security
ALTER TABLE public.power_rankings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view power rankings)
CREATE POLICY "Power rankings are viewable by everyone" 
ON public.power_rankings 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert power rankings" 
ON public.power_rankings 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update power rankings" 
ON public.power_rankings 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_power_rankings_week_season ON public.power_rankings(week, season);
CREATE INDEX idx_power_rankings_rank ON public.power_rankings(rank);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_power_rankings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_power_rankings_updated_at
BEFORE UPDATE ON public.power_rankings
FOR EACH ROW
EXECUTE FUNCTION public.update_power_rankings_updated_at();

-- Enable realtime
ALTER TABLE public.power_rankings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.power_rankings;

-- Insert initial Week 6 data
INSERT INTO public.power_rankings (rank, team, abbreviation, record, wins, losses, ties, rank_change, week, season) VALUES
(1, 'Philadelphia Eagles', 'PHI', '4-1', 4, 1, 0, 1, 6, 2025),
(2, 'Detroit Lions', 'DET', '4-1', 4, 1, 0, 1, 6, 2025),
(3, 'Buffalo Bills', 'BUF', '4-1', 4, 1, 0, -2, 6, 2025),
(4, 'Tampa Bay Buccaneers', 'TB', '4-1', 4, 1, 0, 1, 6, 2025),
(5, 'Indianapolis Colts', 'IND', '4-1', 4, 1, 0, 4, 6, 2025),
(6, 'San Francisco 49ers', 'SF', '4-1', 4, 1, 0, 7, 6, 2025),
(7, 'Washington Commanders', 'WAS', '3-2', 3, 2, 0, 5, 6, 2025),
(8, 'Los Angeles Rams', 'LAR', '3-2', 3, 2, 0, -4, 6, 2025),
(9, 'Green Bay Packers', 'GB', '2-2-1', 2, 2, 1, -2, 6, 2025),
(10, 'Denver Broncos', 'DEN', '3-2', 3, 2, 0, 4, 6, 2025),
(11, 'Seattle Seahawks', 'SEA', '3-2', 3, 2, 0, 0, 6, 2025),
(12, 'Jacksonville Jaguars', 'JAX', '4-1', 4, 1, 0, 5, 6, 2025),
(13, 'Los Angeles Chargers', 'LAC', '3-2', 3, 2, 0, -5, 6, 2025),
(14, 'Kansas City Chiefs', 'KC', '2-3', 2, 3, 0, -8, 6, 2025),
(15, 'New England Patriots', 'NE', '2-3', 2, 3, 0, 8, 6, 2025),
(16, 'Pittsburgh Steelers', 'PIT', '3-1', 3, 1, 0, -1, 6, 2025),
(17, 'Houston Texans', 'HOU', '2-3', 2, 3, 0, 7, 6, 2025),
(18, 'Atlanta Falcons', 'ATL', '2-2', 2, 2, 0, -2, 6, 2025),
(19, 'Minnesota Vikings', 'MIN', '3-2', 3, 2, 0, 1, 6, 2025),
(20, 'Chicago Bears', 'CHI', '2-2', 2, 2, 0, 1, 6, 2025),
(21, 'Baltimore Ravens', 'BAL', '1-4', 1, 4, 0, -11, 6, 2025),
(22, 'Dallas Cowboys', 'DAL', '2-2-1', 2, 2, 1, -3, 6, 2025),
(23, 'Arizona Cardinals', 'ARI', '2-3', 2, 3, 0, -5, 6, 2025),
(24, 'Cincinnati Bengals', 'CIN', '2-3', 2, 3, 0, -2, 6, 2025),
(25, 'Carolina Panthers', 'CAR', '2-3', 2, 3, 0, 4, 6, 2025),
(26, 'New Orleans Saints', 'NO', '1-4', 1, 4, 0, 5, 6, 2025),
(27, 'Cleveland Browns', 'CLE', '1-4', 1, 4, 0, -2, 6, 2025),
(28, 'New York Giants', 'NYG', '1-4', 1, 4, 0, -2, 6, 2025),
(29, 'Tennessee Titans', 'TEN', '1-4', 1, 4, 0, 3, 6, 2025),
(30, 'Las Vegas Raiders', 'LV', '1-4', 1, 4, 0, -3, 6, 2025),
(31, 'Miami Dolphins', 'MIA', '1-4', 1, 4, 0, -1, 6, 2025),
(32, 'New York Jets', 'NYJ', '0-5', 0, 5, 0, -4, 6, 2025)
ON CONFLICT (team, week, season) DO NOTHING;