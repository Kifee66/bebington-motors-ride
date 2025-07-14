-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.car_images CASCADE;
DROP TABLE IF EXISTS public.cars CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create storage bucket for car images (drop and recreate)
DELETE FROM storage.objects WHERE bucket_id = 'car-images';
DELETE FROM storage.buckets WHERE id = 'car-images';

INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create users table (profiles)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Create cars table
CREATE TABLE public.cars (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    mileage BIGINT,
    price NUMERIC(12,2) NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('new', 'used', 'certified')),
    description TEXT,
    location TEXT,
    image_url TEXT,
    owner_id UUID REFERENCES public.users(id),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_images table
CREATE TABLE public.car_images (
    id BIGSERIAL PRIMARY KEY,
    car_id BIGINT REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    image_description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON public.cars
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cars table
CREATE POLICY "Anyone can view available cars" ON public.cars
    FOR SELECT USING (is_available = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert cars" ON public.cars
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update cars" ON public.cars
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete cars" ON public.cars
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for car_images table
CREATE POLICY "Anyone can view car images" ON public.car_images
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage car images" ON public.car_images
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for car images
CREATE POLICY "Anyone can view car images" ON storage.objects 
    FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update car images" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete car images" ON storage.objects 
    FOR DELETE USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert user into public.users table
  INSERT INTO public.users (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.created_at
  );
  
  -- Assign role based on email
  IF NEW.email = 'muturimichael66@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();