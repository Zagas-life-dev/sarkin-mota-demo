-- Migration: Add function to increment car views
-- This allows anonymous users to increment views without RLS blocking

-- Create function to increment car views (bypasses RLS using SECURITY DEFINER)
CREATE OR REPLACE FUNCTION increment_car_views(car_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE cars
  SET views = COALESCE(views, 0) + 1
  WHERE id = car_id;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_car_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_car_views(UUID) TO anon;



