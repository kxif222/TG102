import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Clock, Brain, Zap, Trophy, Play } from "lucide-react";

interface QuizType {
  id: string;
  name: string;
  description: string;
  is_multiplayer: boolean;
  max_players: number;
  time_limit: number;
}

interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const GameModeSelector = () => {
  const [quizTypes, setQuizTypes] = useState<QuizType[]>([]);
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [typesResult, categoriesResult] = await Promise.all([
        supabase.from("quiz_types").select("*"),
        supabase.from("quiz_categories").select("*")
      ]);

      if (typesResult.data) setQuizTypes(typesResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "classic trivia": return <Brain className="h-6 w-6" />;
      case "3d card flip": return <div className="text-2xl">🃏</div>;
      case "rapid fire": return <Zap className="h-6 w-6" />;
      case "solo challenge": return <Trophy className="h-6 w-6" />;
      case "team battle": return <Users className="h-6 w-6" />;
      default: return <Play className="h-6 w-6" />;
    }
  };

  const startGame = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!selectedType || !selectedCategory) return;

    const gameType = quizTypes.find(t => t.id === selectedType);
    if (gameType?.is_multiplayer) {
      navigate(`/lobby?type=${selectedType}&category=${selectedCategory}`);
    } else {
      navigate(`/quiz?type=${selectedType}&category=${selectedCategory}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-24 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quiz Types */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">🎮 Choose Your Game Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizTypes.map((type, index) => (
            <Card 
              key={type.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 game-mode-card ${
                selectedType === type.id ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' : ''
              }`}
              onClick={() => setSelectedType(type.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-primary">
                  {getGameIcon(type.name)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{type.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {type.is_multiplayer && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {type.max_players} players
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {type.time_limit}s
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{type.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">📚 Select Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 category-card ${
                selectedCategory === category.id ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={startGame}
          disabled={!selectedType || !selectedCategory}
          className="btn-quiz-start text-lg px-8 py-4 h-auto"
        >
          <Play className="mr-2 h-5 w-5" />
          {selectedType && quizTypes.find(t => t.id === selectedType)?.is_multiplayer 
            ? "Create Game Room" 
            : "Start Quiz"}
        </Button>
      </div>
    </div>
  );
};

export default GameModeSelector;