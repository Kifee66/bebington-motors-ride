-- Add hire purchase fields to cars table
ALTER TABLE public.cars 
ADD COLUMN hire_purchase_available boolean DEFAULT false,
ADD COLUMN hire_purchase_deposit numeric,
ADD COLUMN hire_purchase_monthly_payment numeric,
ADD COLUMN hire_purchase_duration_months integer;