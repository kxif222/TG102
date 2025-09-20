import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Home, RotateCcw, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { score = 0, total = 5 } = location.state || {};

  const percentage = Math.round((score / total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🏆", color: "text-yellow-400", icon: "🏆" };
    if (percentage >= 80) return { message: "Excellent! ⭐", color: "text-success", icon: "⭐" };
    if (percentage >= 70) return { message: "Great job! 👏", color: "text-primary", icon: "👏" };
    if (percentage >= 60) return { message: "Good effort! 👍", color: "text-accent", icon: "👍" };
    return { message: "Keep practicing! 💪", color: "text-muted-foreground", icon: "💪" };
  };

  const performance = getPerformanceMessage();

  const handleShare = () => {
    const message = `I just scored ${score}/${total} (${percentage}%) on QuizMaster! 🧠✨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'QuizMaster Results',
        text: message,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Results copied!",
        description: "Share your score with friends",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Quiz Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        {/* Results Card */}
        <Card className="card-3d p-8 text-center space-y-8">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="trophy-float text-6xl">
              {performance.icon}
            </div>
          </div>

          {/* Score Display */}
          <div className="space-y-4">
            <div className="text-6xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {score}
              </span>
              <span className="text-muted-foreground">/{total}</span>
            </div>
            
            <div className="text-2xl md:text-3xl font-semibold text-primary">
              {percentage}% Correct
            </div>

            <p className={`text-xl font-medium ${performance.color}`}>
              {performance.message}
            </p>
          </div>

          {/* Progress Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Your Score</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => navigate("/quiz")}
              className="btn-quiz-start flex items-center justify-center gap-2 py-3"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Share2 className="h-5 w-5" />
              Share Score
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/leaderboard")}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Trophy className="h-5 w-5" />
              Leaderboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 py-3"
            >
              <Home className="h-5 w-5" />
              Home
            </Button>
          </div>
        </Card>

        {/* Improvement Tips */}
        {percentage < 80 && (
          <Card className="card-3d p-6 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-3">💡 Tips to Improve</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Take your time to read each question carefully</li>
              <li>• Eliminate obviously wrong answers first</li>
              <li>• Practice regularly to expand your knowledge</li>
              <li>• Focus on your weaker subject areas</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;