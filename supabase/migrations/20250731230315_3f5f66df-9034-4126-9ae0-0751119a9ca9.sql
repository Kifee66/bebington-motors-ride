-- Add table for car images with descriptions
CREATE TABLE IF NOT EXISTS public.car_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE
);

-- Enable RLS on car_images table
ALTER TABLE public.car_images ENABLE ROW LEVEL SECURITY;

-- Create policies for car_images
CREATE POLICY "Everyone can view car images" 
ON public.car_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert car images" 
ON public.car_images 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update car images" 
ON public.car_images 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete car images" 
ON public.car_images 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates on car_images
CREATE TRIGGER update_car_images_updated_at
BEFORE UPDATE ON public.car_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();