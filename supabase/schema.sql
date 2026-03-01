-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  full_name text,
  description text,
  avatar_url text,
  mbti text,
  zodiac text,
  location text,
  tags text[] DEFAULT '{}'::text[],
  match_score integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  followers_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  role text NOT NULL DEFAULT 'user'::text,
  theme text NOT NULL DEFAULT 'glassmorphism'::text,
  theme_config jsonb DEFAULT '{
    "auroraIntensity": 0.5,
    "glassIntensity": 10,
    "grainOpacity": 0.1,
    "profileGlow": 0.5,
    "profileBorderWidth": 2,
    "profileBorderRadius": 50,
    "nameScale": 1,
    "contentGap": 16,
    "linkRadius": 12,
    "linkGap": 8,
    "linkHoverScale": 1.02,
    "linkGlow": true
  }'::jsonb NOT NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Create links table
CREATE TABLE public.links (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  profile_id uuid NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  icon text,
  clicks integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT links_pkey PRIMARY KEY (id),
  CONSTRAINT links_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public links are viewable by everyone" ON public.links FOR SELECT USING (true);

-- Authenticated user access
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Standardized Link Management
CREATE POLICY "Users can manage own links" ON public.links
  FOR ALL USING (profile_id = auth.uid());

-- RPC Function for incrementing likes
CREATE OR REPLACE FUNCTION increment_likes(profile_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET likes_count = likes_count + 1
  WHERE id = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
