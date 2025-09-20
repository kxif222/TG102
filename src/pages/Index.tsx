import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, Zap, Trophy, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              QuizMaster
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge with our interactive trivia game featuring smooth animations and engaging gameplay
            </p>
          </div>

          {/* 3D Start Button */}
          <div className="py-8">
            <Button
              onClick={() => navigate("/quiz")}
              size="lg"
              className="btn-quiz-start text-xl px-12 py-6 font-bold text-primary-foreground border-0 shadow-2xl"
            >
              <Brain className="mr-3 h-6 w-6" />
              Start Quiz Adventure
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`card-3d p-6 text-center space-y-4 animate-delay-${(index + 1) * 100}`}
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

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              variant="outline"
              onClick={() => navigate("/leaderboard")}
              className="px-8 py-3"
            >
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/quiz")}
              className="px-8 py-3"
            >
              <Zap className="mr-2 h-5 w-5" />
              Quick Play
            </Button>
          </div>
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