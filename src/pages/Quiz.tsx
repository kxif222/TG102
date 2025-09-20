import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Clock, Home } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFlipping, setIsFlipping] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      category: "Geography"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      category: "Science"
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Rembrandt"],
      correct: 2,
      category: "Art"
    },
    {
      id: 4,
      question: "What is the largest mammal in the world?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correct: 1,
      category: "Nature"
    },
    {
      id: 5,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: 1,
      category: "History"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleNextQuestion();
    }
  }, [timeLeft, selectedAnswer]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setIsFlipping(true);
      
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsFlipping(false);
      }, 300);
    } else {
      navigate("/results", { state: { score, total: questions.length } });
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const timeProgress = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">QuizMaster</h1>
            <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-accent">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Card */}
        <Card className={`card-3d p-8 mb-8 ${isFlipping ? 'card-flip flipped' : ''}`}>
          <div className="card-face">
            {/* Timer */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
                <Clock className="h-5 w-5 text-accent" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div 
                className="timer-bar h-2 rounded-full transition-all duration-1000"
                style={{ width: `${timeProgress}%` }}
              />
            </div>

            {/* Category */}
            <div className="text-center mb-4">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {currentQ.category}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-card-foreground">
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`
                    p-6 h-auto text-left justify-start text-lg transition-all duration-300
                    ${selectedAnswer === index 
                      ? index === currentQ.correct 
                        ? 'answer-correct border-success text-success-foreground' 
                        : 'answer-wrong border-destructive text-destructive-foreground'
                      : selectedAnswer !== null && index === currentQ.correct
                        ? 'answer-correct border-success text-success-foreground'
                        : 'hover:scale-105 hover:shadow-lg'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    {option}
                  </div>
                </Button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className="text-center mt-6">
                <p className={`text-lg font-bold ${
                  selectedAnswer === currentQ.correct ? 'text-success' : 'text-destructive'
                }`}>
                  {selectedAnswer === currentQ.correct ? '🎉 Correct!' : '❌ Wrong!'}
                  {selectedAnswer !== currentQ.correct && (
                    <span className="block text-sm text-muted-foreground mt-1">
                      Correct answer: {currentQ.options[currentQ.correct]}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;