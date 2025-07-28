/*
  # Complete Viva Leve 30+ Database Schema

  1. New Tables
    - `profiles` - User profiles with plan information
    - `weight_entries` - Weight tracking records
    - `achievements` - User achievements for TAE system
    - `recipes` - Recipe database
    - `webhook_logs` - Kiwify webhook processing logs
    - `exercise_videos` - Premium exercise videos

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin policies for management

  3. Functions
    - Function to check and award achievements
    - Function to process webhook events
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  plan_expiry timestamptz DEFAULT (now() + interval '5 days'),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weight_entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  weight decimal(5,2) NOT NULL,
  notes text,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('discipline', 'transformation', 'consistency')),
  title text NOT NULL,
  description text NOT NULL,
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('vegana', 'cetogenica', 'lowcarb')),
  ingredients text[] NOT NULL,
  instructions text[] NOT NULL,
  prep_time integer NOT NULL,
  difficulty text DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  calories integer NOT NULL,
  protein decimal(5,2) NOT NULL,
  carbs decimal(5,2) NOT NULL,
  fat decimal(5,2) NOT NULL,
  substitutions text[] DEFAULT '{}',
  image_url text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  evento text NOT NULL,
  produto text,
  status text DEFAULT 'success',
  processed_at timestamptz DEFAULT now(),
  user_updated boolean DEFAULT false,
  error_message text
);

-- Create exercise_videos table
CREATE TABLE IF NOT EXISTS exercise_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer, -- in minutes
  category text DEFAULT 'cardio' CHECK (category IN ('cardio', 'strength', 'flexibility', 'hiit')),
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_premium boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_videos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Weight entries policies
CREATE POLICY "Users can manage own weight entries"
  ON weight_entries
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Achievements policies
CREATE POLICY "Users can read own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Recipes policies
CREATE POLICY "Users can read recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage recipes"
  ON recipes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Webhook logs policies (admin only)
CREATE POLICY "Admins can read webhook logs"
  ON webhook_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Exercise videos policies
CREATE POLICY "Users can read exercise videos"
  ON exercise_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage exercise videos"
  ON exercise_videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Insert sample data
INSERT INTO profiles (user_id, email, name, plan, plan_expiry, is_admin) VALUES
  (gen_random_uuid(), 'admin@vivaleve.com', 'Admin', 'premium', now() + interval '365 days', true),
  (gen_random_uuid(), 'maria@email.com', 'Maria Silva', 'premium', now() + interval '30 days', false),
  (gen_random_uuid(), 'joao@email.com', 'João Santos', 'free', now() + interval '3 days', false);

-- Insert sample recipes
INSERT INTO recipes (name, category, ingredients, instructions, prep_time, difficulty, calories, protein, carbs, fat, substitutions, image_url, is_premium) VALUES
  ('Bowl de Quinoa com Vegetais', 'vegana', 
   ARRAY['1 xícara de quinoa', '2 xícaras de água', '1 brócolis pequeno', '1 abobrinha média', '1 cenoura', '2 colheres de azeite', 'Sal e pimenta a gosto', 'Suco de 1 limão'],
   ARRAY['Cozinhe a quinoa em água fervente por 15 minutos', 'Corte os vegetais em cubos pequenos', 'Refogue os vegetais no azeite por 8 minutos', 'Tempere com sal, pimenta e limão', 'Sirva a quinoa com os vegetais por cima'],
   25, 'easy', 320, 12.0, 45.0, 8.0,
   ARRAY['Quinoa por arroz integral', 'Brócolis por couve-flor', 'Azeite por óleo de coco'],
   'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', false),
   
  ('Salmão Grelhado com Aspargos', 'cetogenica',
   ARRAY['200g de filé de salmão', '300g de aspargos', '3 colheres de manteiga', '2 dentes de alho', 'Sal e pimenta a gosto', 'Suco de 1/2 limão', '1 colher de ervas finas'],
   ARRAY['Tempere o salmão com sal, pimenta e limão', 'Grelhe o salmão por 4 minutos de cada lado', 'Refogue os aspargos na manteiga com alho', 'Tempere com ervas finas', 'Sirva o salmão com os aspargos'],
   15, 'medium', 420, 35.0, 8.0, 28.0,
   ARRAY['Salmão por truta', 'Aspargos por brócolis', 'Manteiga por azeite'],
   'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg', true);

-- Insert exercise videos
INSERT INTO exercise_videos (title, description, video_url, thumbnail_url, duration, category, difficulty) VALUES
  ('Cardio HIIT para Iniciantes', 'Treino de alta intensidade de 15 minutos para queimar gordura', 'https://example.com/video1', 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg', 15, 'hiit', 'beginner'),
  ('Fortalecimento Core', 'Exercícios para fortalecer o abdômen e core', 'https://example.com/video2', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg', 20, 'strength', 'intermediate'),
  ('Yoga para Flexibilidade', 'Sequência de yoga para melhorar a flexibilidade', 'https://example.com/video3', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 30, 'flexibility', 'beginner');

-- Function to process webhook events
CREATE OR REPLACE FUNCTION process_webhook_event(
  p_email text,
  p_evento text,
  p_produto text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_new_plan text;
  v_new_expiry timestamptz;
  v_result json;
BEGIN
  -- Find user by email
  SELECT id INTO v_user_id
  FROM profiles
  WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    -- Log the event even if user not found
    INSERT INTO webhook_logs (email, evento, produto, status, error_message)
    VALUES (p_email, p_evento, p_produto, 'error', 'User not found');
    
    RETURN json_build_object(
      'success', false,
      'message', 'User not found'
    );
  END IF;
  
  -- Determine new plan and expiry based on event
  CASE 
    WHEN p_evento IN ('assinatura cancelada', 'assinatura atrasada') THEN
      v_new_plan := 'free';
      v_new_expiry := now() + interval '7 days';
    WHEN p_evento IN ('assinatura renovada', 'assinatura aprovada', 'compra aprovada') THEN
      v_new_plan := 'premium';
      v_new_expiry := now() + interval '30 days';
    ELSE
      v_new_plan := 'free';
      v_new_expiry := now() + interval '7 days';
  END CASE;
  
  -- Update user plan
  UPDATE profiles
  SET 
    plan = v_new_plan,
    plan_expiry = v_new_expiry,
    updated_at = now()
  WHERE id = v_user_id;
  
  -- Log successful processing
  INSERT INTO webhook_logs (email, evento, produto, status, user_updated)
  VALUES (p_email, p_evento, p_produto, 'success', true);
  
  RETURN json_build_object(
    'success', true,
    'message', 'User plan updated successfully',
    'new_plan', v_new_plan,
    'new_expiry', v_new_expiry
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log error
  INSERT INTO webhook_logs (email, evento, produto, status, error_message)
  VALUES (p_email, p_evento, p_produto, 'error', SQLERRM);
  
  RETURN json_build_object(
    'success', false,
    'message', 'Error processing webhook: ' || SQLERRM
  );
END;
$$;