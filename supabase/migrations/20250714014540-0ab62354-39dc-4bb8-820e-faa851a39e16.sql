-- Fix user creation and ensure admin user exists
-- First, check if the admin user exists in auth.users and add to our tables if needed
DO $$
BEGIN
    -- Insert admin user into users table if not exists (assuming they signed up via auth)
    INSERT INTO public.users (id, email, full_name, created_at)
    SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), created_at
    FROM auth.users 
    WHERE email = 'muturimichael66@gmail.com'
    AND NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'muturimichael66@gmail.com');
    
    -- Insert admin role if not exists
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role
    FROM auth.users 
    WHERE email = 'muturimichael66@gmail.com'
    AND NOT EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN auth.users au ON ur.user_id = au.id 
        WHERE au.email = 'muturimichael66@gmail.com' AND ur.role = 'admin'
    );
END $$;

-- Recreate the trigger function to ensure it works properly
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

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();