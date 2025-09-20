import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Award, Home, Play } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  total: number;
  percentage: number;
  badge: string;
  country: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();

  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: "Alex Chen", score: 95, total: 100, percentage: 95, badge: "🏆", country: "🇺🇸" },
    { rank: 2, name: "Sarah Kumar", score: 92, total: 100, percentage: 92, badge: "🥈", country: "🇮🇳" },
    { rank: 3, name: "Mike Johnson", score: 89, total: 100, percentage: 89, badge: "🥉", country: "🇬🇧" },
    { rank: 4, name: "Emma Wilson", score: 87, total: 100, percentage: 87, badge: "⭐", country: "🇨🇦" },
    { rank: 5, name: "David Park", score: 85, total: 100, percentage: 85, badge: "⭐", country: "🇰🇷" },
    { rank: 6, name: "Lisa Zhang", score: 83, total: 100, percentage: 83, badge: "⭐", country: "🇦🇺" },
    { rank: 7, name: "James Smith", score: 81, total: 100, percentage: 81, badge: "⭐", country: "🇺🇸" },
    { rank: 8, name: "Maria Garcia", score: 79, total: 100, percentage: 79, badge: "⭐", country: "🇪🇸" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "border-yellow-400/50 bg-yellow-400/10";
      case 2: return "border-gray-400/50 bg-gray-400/10";
      case 3: return "border-amber-600/50 bg-amber-600/10";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">🏆 Leaderboard</h1>
            <p className="text-muted-foreground">Top performers in QuizMaster</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              onClick={() => navigate("/quiz")}
              className="btn-quiz-start flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Take Quiz
            </Button>
          </div>
        </div>

        {/* Trophy Animation */}
        <div className="text-center mb-8">
          <div className="trophy-float text-8xl inline-block">
            🏆
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((entry, index) => (
            <Card 
              key={entry.rank}
              className={`card-3d p-6 text-center ${getRankColor(entry.rank)} score-item`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">{entry.country}</span>
                    <h3 className="text-lg font-bold text-card-foreground">{entry.name}</h3>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {entry.percentage}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.score}/{entry.total} correct
                  </p>
                </div>
                <Badge variant="secondary" className="text-2xl px-3 py-1">
                  {entry.badge}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="card-3d">
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary mb-6">All Rankings</h2>
            <div className="space-y-3">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getRankColor(entry.rank)} score-item hover:bg-muted/50 transition-colors`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <span className="text-2xl">{entry.country}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{entry.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {entry.score}/{entry.total} questions correct
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {entry.percentage}%
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {entry.badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="card-3d p-6 mt-6">
          <h3 className="text-lg font-semibold text-primary mb-4">📊 Global Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">1,247</div>
              <p className="text-sm text-muted-foreground">Total Players</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">12,450</div>
              <p className="text-sm text-muted-foreground">Quizzes Taken</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">78%</div>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">42</div>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;