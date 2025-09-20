-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create quiz categories table
CREATE TABLE public.quiz_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz types table (3D card, trivia, rapid fire, etc.)
CREATE TABLE public.quiz_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_multiplayer BOOLEAN DEFAULT false,
  max_players INTEGER DEFAULT 1,
  time_limit INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.quiz_categories(id),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game sessions table
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_type_id UUID REFERENCES public.quiz_types(id),
  category_id UUID REFERENCES public.quiz_categories(id),
  host_id UUID REFERENCES public.profiles(id),
  room_code TEXT UNIQUE,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  max_players INTEGER DEFAULT 4,
  current_question INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 10,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create game participants table
CREATE TABLE public.game_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  score INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Create game answers table
CREATE TABLE public.game_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  question_id UUID REFERENCES public.questions(id),
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  category_id UUID REFERENCES public.quiz_categories(id),
  quiz_type_id UUID REFERENCES public.quiz_types(id),
  score INTEGER NOT NULL,
  rank INTEGER,
  session_id UUID REFERENCES public.game_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for quiz categories and types (public read)
CREATE POLICY "Anyone can view quiz categories" ON public.quiz_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz types" ON public.quiz_types FOR SELECT USING (true);

-- Create RLS policies for questions (public read)
CREATE POLICY "Anyone can view questions" ON public.questions FOR SELECT USING (true);

-- Create RLS policies for game sessions
CREATE POLICY "Anyone can view active game sessions" ON public.game_sessions FOR SELECT USING (true);
CREATE POLICY "Users can create game sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can update their game sessions" ON public.game_sessions FOR UPDATE USING (auth.uid() = host_id);

-- Create RLS policies for game participants
CREATE POLICY "Users can view participants in their sessions" ON public.game_participants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.game_sessions gs 
    WHERE gs.id = session_id AND (gs.host_id = auth.uid() OR auth.uid() = user_id)
  )
);
CREATE POLICY "Users can join game sessions" ON public.game_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for game answers
CREATE POLICY "Users can view their own answers" ON public.game_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit their own answers" ON public.game_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for leaderboard
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "System can insert leaderboard entries" ON public.leaderboard FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default quiz categories
INSERT INTO public.quiz_categories (name, description, icon) VALUES
('General Knowledge', 'Test your general knowledge across various topics', '🧠'),
('Science & Technology', 'Questions about science, technology, and innovation', '🔬'),
('History & Geography', 'Explore historical events and world geography', '🌍'),
('Sports & Entertainment', 'Fun questions about sports, movies, and entertainment', '🎬'),
('Math & Logic', 'Challenge your mathematical and logical thinking', '🔢');

-- Insert quiz types
INSERT INTO public.quiz_types (name, description, is_multiplayer, max_players, time_limit) VALUES
('Classic Trivia', 'Traditional question and answer format', true, 8, 30),
('3D Card Flip', 'Interactive 3D card-based quiz experience', true, 6, 25),
('Rapid Fire', 'Quick-fire questions with shorter time limits', true, 10, 10),
('Solo Challenge', 'Single-player practice mode', false, 1, 45),
('Team Battle', 'Collaborative team-based quizzing', true, 12, 40);

-- Insert sample questions
INSERT INTO public.questions (category_id, question_text, options, correct_answer, difficulty) VALUES
(
  (SELECT id FROM public.quiz_categories WHERE name = 'General Knowledge'),
  'What is the capital of France?',
  '["Paris", "London", "Berlin", "Madrid"]',
  'Paris',
  1
),
(
  (SELECT id FROM public.quiz_categories WHERE name = 'Science & Technology'),
  'What does CPU stand for?',
  '["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"]',
  'Central Processing Unit',
  2
),
(
  (SELECT id FROM public.quiz_categories WHERE name = 'History & Geography'),
  'In which year did World War II end?',
  '["1944", "1945", "1946", "1947"]',
  '1945',
  2
);

-- Enable realtime for multiplayer functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_answers;

-- Set replica identity for realtime updates
ALTER TABLE public.game_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.game_participants REPLICA IDENTITY FULL;
ALTER TABLE public.game_answers REPLICA IDENTITY FULL;