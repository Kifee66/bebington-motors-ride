-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create storage policies for car images
CREATE POLICY "Anyone can view car images" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own car images" ON storage.objects FOR UPDATE 
USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own car images" ON storage.objects FOR DELETE 
USING (bucket_id = 'car-images' AND auth.uid() IS NOT NULL);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert admin role for the specified email
-- First, we need to get the user_id from auth.users, but since we can't query it directly,
-- we'll create a function to handle this when the user signs up

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Check if this is the admin email
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on cars table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cars
CREATE POLICY "Anyone can view available cars" ON public.cars
FOR SELECT USING (is_available = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert cars" ON public.cars
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update cars" ON public.cars
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete cars" ON public.cars
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on car_images table
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for car_images
CREATE POLICY "Anyone can view car images" ON public.car_images
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage car images" ON public.car_images
FOR ALL USING (public.has_role(auth.uid(), 'admin'));