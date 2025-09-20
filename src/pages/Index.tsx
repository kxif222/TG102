import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import GameModeSelector from "@/components/GameModeSelector";
import { Trophy, Users, Brain, Zap, LogIn, LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="quiz-pulse text-8xl">🧠</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <div className="quiz-pulse text-8xl mb-6">🧠</div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 gradient-text">
              QuizMaster
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Challenge your knowledge, compete with friends, and climb the leaderboard!
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">Welcome back!</p>
                  <p className="text-sm text-muted-foreground">@{user.user_metadata?.username || user.email?.split('@')[0]}</p>
                </div>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Game Mode Selector */}
        <GameModeSelector />

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/leaderboard")}
            className="text-lg px-8 py-4 h-auto"
          >
            <Trophy className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            {
              icon: Brain,
              title: "Smart Questions",
              description: "AI-powered trivia covering multiple topics"
            },
            {
              icon: Zap,
              title: "Real-time Feedback", 
              description: "Instant answers with visual feedback"
            },
            {
              icon: Trophy,
              title: "Leaderboard",
              description: "Compete with players worldwide"
            },
            {
              icon: Users,
              title: "Multiplayer Ready",
              description: "Challenge friends in real-time"
            }
          ].map((feature, index) => (
            <Card
              key={index}
              className="card-3d p-6 text-center space-y-4 score-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center">
                <feature.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Developed by Team <span className="font-semibold text-primary">QuizMasters</span>, TechBrain 3.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;