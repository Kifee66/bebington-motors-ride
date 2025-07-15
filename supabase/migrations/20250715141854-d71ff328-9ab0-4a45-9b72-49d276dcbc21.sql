-- Add transmission and engine_cc columns to the cars table
ALTER TABLE public.cars 
ADD COLUMN transmission TEXT,
ADD COLUMN engine_cc INTEGER;