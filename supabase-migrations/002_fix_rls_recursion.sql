-- Migration: Fix infinite recursion in RLS policies
-- The issue: Policies that check admin role by querying users table cause infinite recursion
-- Solution: Create a SECURITY DEFINER function that bypasses RLS to check admin status

-- Create function to check if current user is admin (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM users
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role IN ('content_admin', 'super_admin'), false);
END;
$$;

-- Drop and recreate all admin policies to use is_admin() function
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all dealers" ON dealers;
DROP POLICY IF EXISTS "Admins can manage dealers" ON dealers;
CREATE POLICY "Admins can view all dealers" ON dealers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage dealers" ON dealers FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all requests" ON car_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON car_requests;
CREATE POLICY "Admins can view all requests" ON car_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all requests" ON car_requests FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all cars" ON cars;
DROP POLICY IF EXISTS "Admins can insert cars" ON cars;
DROP POLICY IF EXISTS "Admins can update cars" ON cars;
DROP POLICY IF EXISTS "Admins can delete cars" ON cars;
CREATE POLICY "Admins can view all cars" ON cars FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert cars" ON cars FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update cars" ON cars FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete cars" ON cars FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
CREATE POLICY "Admins can manage brands" ON brands FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage car tags" ON car_tags;
CREATE POLICY "Admins can manage car tags" ON car_tags FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage car tags junction" ON car_tags_junction;
CREATE POLICY "Admins can manage car tags junction" ON car_tags_junction FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all reviews" ON car_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON car_reviews;
CREATE POLICY "Admins can view all reviews" ON car_reviews FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update reviews" ON car_reviews FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all offers" ON car_offers;
DROP POLICY IF EXISTS "Admins can update offers" ON car_offers;
CREATE POLICY "Admins can view all offers" ON car_offers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update offers" ON car_offers FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all test drive requests" ON test_drive_requests;
DROP POLICY IF EXISTS "Admins can update test drive requests" ON test_drive_requests;
CREATE POLICY "Admins can view all test drive requests" ON test_drive_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update test drive requests" ON test_drive_requests FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all trade-in requests" ON trade_in_requests;
DROP POLICY IF EXISTS "Admins can update trade-in requests" ON trade_in_requests;
CREATE POLICY "Admins can view all trade-in requests" ON trade_in_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update trade-in requests" ON trade_in_requests FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can view analytics" ON analytics;
CREATE POLICY "Admins can view analytics" ON analytics FOR SELECT USING (is_admin());




