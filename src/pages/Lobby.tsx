import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Crown, Play, ArrowLeft, Loader2 } from "lucide-react";

interface GameSession {
  id: string;
  room_code: string;
  status: string;
  max_players: number;
  host_id: string;
  quiz_types: { name: string };
  quiz_categories: { name: string; icon: string };
  profiles: { display_name: string };
}

interface Participant {
  id: string;
  profiles: { display_name: string; username: string };
  joined_at: string;
}

const Lobby = () => {
  const [searchParams] = useSearchParams();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const typeId = searchParams.get("type");
  const categoryId = searchParams.get("category");
  const joinCode = searchParams.get("join");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (joinCode) {
      joinGame(joinCode);
    } else if (typeId && categoryId) {
      createGame();
    }
  }, [user, typeId, categoryId, joinCode]);

  useEffect(() => {
    if (gameSession) {
      // Subscribe to real-time updates
      const channel = supabase
        .channel(`game-${gameSession.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'game_participants',
            filter: `session_id=eq.${gameSession.id}`
          },
          () => fetchParticipants()
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_sessions',
            filter: `id=eq.${gameSession.id}`
          },
          (payload) => {
            if (payload.new.status === 'active') {
              navigate(`/game/${gameSession.id}`);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [gameSession?.id]);

  const createGame = async () => {
    try {
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from("game_sessions")
        .insert({
          quiz_type_id: typeId,
          category_id: categoryId,
          host_id: user?.id,
          room_code: roomCode,
          status: 'waiting'
        })
        .select(`
          *,
          quiz_types(name),
          quiz_categories(name, icon),
          profiles(display_name)
        `)
        .single();

      if (error) throw error;

      setGameSession(data);
      setIsHost(true);
      
      // Join the game as host
      await supabase.from("game_participants").insert({
        session_id: data.id,
        user_id: user?.id
      });

      fetchParticipants();
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error",
        description: "Failed to create game room",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (code: string) => {
    setJoining(true);
    try {
      const { data: session, error } = await supabase
        .from("game_sessions")
        .select(`
          *,
          quiz_types(name),
          quiz_categories(name, icon),
          profiles(display_name)
        `)
        .eq("room_code", code)
        .eq("status", "waiting")
        .single();

      if (error || !session) {
        throw new Error("Game room not found or already started");
      }

      // Check if room is full
      const { count } = await supabase
        .from("game_participants")
        .select("*", { count: 'exact', head: true })
        .eq("session_id", session.id);

      if (count && count >= session.max_players) {
        throw new Error("Game room is full");
      }

      // Join the game
      const { error: joinError } = await supabase
        .from("game_participants")
        .insert({
          session_id: session.id,
          user_id: user?.id
        });

      if (joinError) {
        if (joinError.code === '23505') { // Unique constraint violation
          // User already in game, just show the lobby
        } else {
          throw joinError;
        }
      }

      setGameSession(session);
      setIsHost(session.host_id === user?.id);
      fetchParticipants();
      
    } catch (error: any) {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join game room",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setJoining(false);
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    if (!gameSession) return;

    const { data, error } = await supabase
      .from("game_participants")
      .select(`
        *,
        profiles(display_name, username)
      `)
      .eq("session_id", gameSession.id)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Error fetching participants:", error);
    } else {
      setParticipants(data || []);
    }
  };

  const startGame = async () => {
    if (!gameSession || !isHost) return;

    try {
      const { error } = await supabase
        .from("game_sessions")
        .update({ 
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq("id", gameSession.id);

      if (error) throw error;

      navigate(`/game/${gameSession.id}`);
    } catch (error) {
      console.error("Error starting game:", error);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
    }
  };

  const copyRoomCode = () => {
    if (gameSession?.room_code) {
      navigator.clipboard.writeText(gameSession.room_code);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    }
  };

  if (loading || joining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">{joining ? "Joining game..." : "Setting up game room..."}</p>
        </Card>
      </div>
    );
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-lg text-destructive">Game room not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-primary">Game Lobby</h1>
          <div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Info */}
          <Card className="p-6 card-3d">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{gameSession.quiz_categories.icon}</div>
                <h2 className="text-2xl font-bold">{gameSession.quiz_types.name}</h2>
                <p className="text-muted-foreground">{gameSession.quiz_categories.name}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Room Code</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-lg px-3 py-1 font-mono">
                      {gameSession.room_code}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={copyRoomCode}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Players</span>
                  <Badge className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {participants.length}/{gameSession.max_players}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Host</span>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    <span>{gameSession.profiles.display_name}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Players List */}
          <Card className="p-6 card-3d">
            <h3 className="text-xl font-bold mb-4">Players ({participants.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {participants.map((participant, index) => (
                <div 
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg player-join"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {participant.profiles.display_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{participant.profiles.display_name}</p>
                      <p className="text-sm text-muted-foreground">@{participant.profiles.username}</p>
                    </div>
                  </div>
                  {gameSession.host_id === user?.id && participant.profiles.username === user?.user_metadata?.username && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              ))}

              {participants.length < gameSession.max_players && (
                <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
                  Waiting for players...
                </div>
              )}
            </div>

            {isHost && (
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={startGame}
                  disabled={participants.length < 2}
                  className="w-full btn-quiz-start"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
                {participants.length < 2 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Need at least 2 players to start
                  </p>
                )}
              </div>
            )}

            {!isHost && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">Waiting for host to start the game...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Join Game Section */}
        <Card className="p-6 mt-8 card-3d">
          <h3 className="text-xl font-bold mb-4">Join Another Game</h3>
          <div className="flex gap-4">
            <Input
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="font-mono"
              maxLength={6}
            />
            <Button 
              onClick={() => joinGame(roomCode)}
              disabled={roomCode.length !== 6}
            >
              Join
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Lobby;