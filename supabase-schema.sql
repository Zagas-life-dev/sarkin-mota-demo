-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'affiliate', 'content_admin', 'super_admin')),
  affiliate_code TEXT UNIQUE,
  affiliate_status TEXT DEFAULT 'pending' CHECK (affiliate_status IN ('pending', 'approved', 'rejected')),
  total_earnings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dealers table (for dealer information)
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  location TEXT, -- Full address or location description
  whatsapp_contact TEXT,
  website TEXT,
  logo_url TEXT, -- Cloudinary URL
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Car requests table
CREATE TABLE car_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  condition TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  exterior_image1 TEXT, -- Cloudinary URL
  exterior_image2 TEXT, -- Cloudinary URL
  interior_image1 TEXT, -- Cloudinary URL
  interior_image2 TEXT, -- Cloudinary URL
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cars table (comprehensive with all fields from competitor sites)
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  title TEXT NOT NULL,
  stock_number TEXT UNIQUE, -- e.g., "stock # 117"
  price INTEGER NOT NULL,
  original_price INTEGER, -- For showing discounted price
  offer_price INTEGER, -- Make an offer price
  
  -- Car Overview
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  body TEXT, -- Sedan, SUV, Hatchback, etc.
  category TEXT NOT NULL, -- Luxury SUV, Sports Car, etc.
  condition TEXT NOT NULL CHECK (condition IN ('Brand New', 'Used', 'Foreign Used', 'Nigerian Used', 'Certified')),
  
  -- Engine & Performance
  engine_size TEXT, -- e.g., "5.5 Liter twin Turbo V8 Engine"
  engine_description TEXT, -- e.g., "3.0-liter V6 twin-turbocharged engine"
  cylinders INTEGER, -- e.g., 8
  fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG')),
  fuel_consumption_city INTEGER, -- MPG or L/100km
  fuel_consumption_hwy INTEGER, -- MPG or L/100km
  fuel_tank_capacity INTEGER, -- Liters
  
  -- Transmission & Drivetrain
  transmission TEXT CHECK (transmission IN ('Automatic', 'Manual', 'CVT', 'Semi-Automatic')),
  drive_type TEXT, -- e.g., "Rear-Wheel Drive", "AWD", "FWD", "4WD"
  
  -- Physical Specifications
  doors INTEGER, -- e.g., 4
  color TEXT, -- Exterior color
  interior_color TEXT,
  vin TEXT, -- Vehicle Identification Number
  mileage INTEGER, -- in kilometers
  
  -- Dimensions & Capacity
  length DECIMAL(10,2), -- in meters or cm
  width DECIMAL(10,2),
  width_with_mirrors DECIMAL(10,2),
  height DECIMAL(10,2),
  height_with_roof_rails DECIMAL(10,2),
  wheelbase DECIMAL(10,2),
  turning_circle DECIMAL(10,2), -- Kerb to Kerb in meters
  luggage_capacity_seats_up INTEGER, -- Liters
  luggage_capacity_seats_down INTEGER, -- Liters
  gross_vehicle_weight INTEGER, -- kg
  max_loading_weight INTEGER, -- kg
  max_roof_load INTEGER, -- kg
  max_towing_weight_braked INTEGER, -- kg
  max_towing_weight_unbraked INTEGER, -- kg
  minimum_kerbweight INTEGER, -- kg
  number_of_seats INTEGER,
  
  -- Media (Cloudinary URLs)
  images TEXT[] DEFAULT '{}', -- Array of Cloudinary image URLs
  videos TEXT[] DEFAULT '{}', -- Array of Cloudinary video URLs
  thumbnail_url TEXT, -- Primary image URL for listings
  
  -- Features (structured as JSONB for better organization)
  features JSONB DEFAULT '{}', -- Structure: { "interior": [...], "comfort": [...], "safety": [...], "exterior": [...] }
  /* Example structure:
  {
    "interior": ["Air Conditioner", "Digital Odometer", "Heater", "Leather Seats"],
    "comfort": ["Android Auto", "Apple CarPlay", "Bluetooth", "Power Steering"],
    "safety": ["Anti-lock Braking", "Brake Assist", "Driver Air Bag", "Stability Control"],
    "exterior": ["Fog Lights Front", "Rain Sensing Wiper", "Windows - Electric"]
  }
  */
  
  -- Location & Contact
  location TEXT NOT NULL, -- City/State or full address
  dealer_id UUID REFERENCES dealers(id), -- Link to dealer
  whatsapp_contact TEXT NOT NULL,
  phone_contact TEXT,
  email_contact TEXT,
  
  -- Description & Details
  description TEXT,
  short_description TEXT, -- For listing previews
  
  -- Status & Tracking
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'pending', 'draft')),
  is_featured BOOLEAN DEFAULT false,
  clicks INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  -- Financing Information
  financing_available BOOLEAN DEFAULT false,
  financing_interest_rate DECIMAL(5,2), -- Percentage
  financing_min_down_payment INTEGER, -- Minimum down payment in Naira
  financing_max_term INTEGER, -- Maximum loan term in months
  
  -- Admin & Metadata
  admin_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Search optimization
  search_keywords TEXT[] DEFAULT '{}' -- For full-text search
);

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT, -- Cloudinary URL for brand logo
  created_at TIMESTAMP DEFAULT NOW()
);

-- Car tags table
CREATE TABLE car_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT, -- e.g., "condition", "type", "feature"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Car tags junction table
CREATE TABLE car_tags_junction (
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES car_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (car_id, tag_id)
);

-- Car reviews table (for customer reviews)
CREATE TABLE car_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating_comfort INTEGER CHECK (rating_comfort >= 1 AND rating_comfort <= 5),
  rating_interior_design INTEGER CHECK (rating_interior_design >= 1 AND rating_interior_design <= 5),
  rating_exterior_styling INTEGER CHECK (rating_exterior_styling >= 1 AND rating_exterior_styling <= 5),
  rating_value INTEGER CHECK (rating_value >= 1 AND rating_value <= 5),
  rating_performance INTEGER CHECK (rating_performance >= 1 AND rating_performance <= 5),
  rating_reliability INTEGER CHECK (rating_reliability >= 1 AND rating_reliability <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Car offers table (for "Make an Offer" functionality)
CREATE TABLE car_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  offer_price INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  trade_in_price INTEGER, -- If they want to trade in
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Test drive requests table
CREATE TABLE test_drive_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  best_time TEXT, -- Preferred time for test drive
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trade-in requests table
CREATE TABLE trade_in_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE, -- Car they want to buy
  user_id UUID REFERENCES users(id),
  -- Trade-in vehicle details
  trade_make TEXT NOT NULL,
  trade_model TEXT NOT NULL,
  trade_year INTEGER NOT NULL,
  trade_transmission TEXT,
  trade_mileage INTEGER,
  trade_exterior_color TEXT,
  trade_interior_color TEXT,
  trade_owner TEXT,
  trade_exterior_condition TEXT,
  trade_interior_condition TEXT,
  trade_accident_history TEXT,
  trade_images TEXT[], -- Cloudinary URLs
  trade_video_url TEXT, -- Cloudinary video URL
  -- Contact details
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  comments TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'evaluated', 'accepted', 'rejected')),
  estimated_value INTEGER, -- Admin estimated trade-in value
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User favorites table (for saving favorite cars)
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_affiliate_status ON users(affiliate_status);

CREATE INDEX idx_dealers_name ON dealers(name);
CREATE INDEX idx_dealers_city ON dealers(city);
CREATE INDEX idx_dealers_is_verified ON dealers(is_verified);

CREATE INDEX idx_car_requests_user_id ON car_requests(user_id);
CREATE INDEX idx_car_requests_status ON car_requests(status);

CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_location ON cars(location);
CREATE INDEX idx_cars_dealer_id ON cars(dealer_id);
CREATE INDEX idx_cars_is_featured ON cars(is_featured);
CREATE INDEX idx_cars_condition ON cars(condition);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_transmission ON cars(transmission);
CREATE INDEX idx_cars_stock_number ON cars(stock_number);
CREATE INDEX idx_cars_search_keywords ON cars USING GIN(search_keywords);
CREATE INDEX idx_cars_features ON cars USING GIN(features);

CREATE INDEX idx_car_reviews_car_id ON car_reviews(car_id);
CREATE INDEX idx_car_reviews_user_id ON car_reviews(user_id);
CREATE INDEX idx_car_reviews_is_approved ON car_reviews(is_approved);

CREATE INDEX idx_car_offers_car_id ON car_offers(car_id);
CREATE INDEX idx_car_offers_user_id ON car_offers(user_id);
CREATE INDEX idx_car_offers_status ON car_offers(status);

CREATE INDEX idx_test_drive_requests_car_id ON test_drive_requests(car_id);
CREATE INDEX idx_test_drive_requests_user_id ON test_drive_requests(user_id);
CREATE INDEX idx_test_drive_requests_status ON test_drive_requests(status);

CREATE INDEX idx_trade_in_requests_car_id ON trade_in_requests(car_id);
CREATE INDEX idx_trade_in_requests_user_id ON trade_in_requests(user_id);
CREATE INDEX idx_trade_in_requests_status ON trade_in_requests(status);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_car_id ON user_favorites(car_id);

CREATE INDEX idx_analytics_page_name ON analytics(page_name);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);

-- Insert initial brands
INSERT INTO brands (name) VALUES 
  ('Toyota'), ('Honda'), ('Ford'), ('Nissan'), ('Mazda'), 
  ('Hyundai'), ('Kia'), ('BMW'), ('Mercedes-Benz'), ('Audi'),
  ('Volkswagen'), ('Peugeot'), ('Renault'), ('Chevrolet'), ('Lexus'),
  ('Infiniti'), ('Acura'), ('Subaru'), ('Mitsubishi'), ('Suzuki'),
  ('Dodge'), ('Jeep'), ('Land Rover'), ('Range Rover'), ('Porsche'),
  ('Bentley'), ('Rolls-Royce'), ('Ferrari'), ('Lamborghini'), ('Maserati');

-- Insert initial car tags
INSERT INTO car_tags (name, category) VALUES 
  ('Brand New', 'condition'), ('Used', 'condition'), ('Foreign Used', 'condition'), 
  ('Nigerian Used', 'condition'), ('Certified', 'condition'),
  ('Financing Available', 'feature'), ('Low Mileage', 'feature'), 
  ('High Mileage', 'feature'), ('Automatic', 'transmission'), ('Manual', 'transmission'),
  ('Petrol', 'fuel'), ('Diesel', 'fuel'), ('Hybrid', 'fuel'), ('Electric', 'fuel'),
  ('SUV', 'body'), ('Sedan', 'body'), ('Hatchback', 'body'), ('Pickup', 'body'),
  ('Coupe', 'body'), ('Convertible', 'body'), ('Wagon', 'body'), ('Truck', 'body'),
  ('Luxury', 'type'), ('Economy', 'type'), ('Family Car', 'type'), 
  ('Sports Car', 'type'), ('Commercial', 'type'), ('Imported', 'origin'),
  ('Local', 'origin'), ('Accident Free', 'condition'), ('Full Service History', 'feature'),
  ('One Owner', 'feature'), ('Warranty', 'feature'), ('Trade-in Accepted', 'feature');

-- Create function to handle new user creation
-- This automatically creates a record in public.users when a user signs up in auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create user in public.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON dealers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_car_requests_updated_at BEFORE UPDATE ON car_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_car_reviews_updated_at BEFORE UPDATE ON car_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_car_offers_updated_at BEFORE UPDATE ON car_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_drive_requests_updated_at BEFORE UPDATE ON test_drive_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trade_in_requests_updated_at BEFORE UPDATE ON trade_in_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_tags_junction ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drive_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_in_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Function to check if current user is admin (bypasses RLS to avoid recursion)
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
  
  RETURN user_role IN ('content_admin', 'super_admin');
END;
$$;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());

-- Dealers policies
CREATE POLICY "Anyone can view verified dealers" ON dealers FOR SELECT USING (is_verified = true);
CREATE POLICY "Admins can view all dealers" ON dealers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage dealers" ON dealers FOR ALL USING (is_admin());

-- Car requests policies
CREATE POLICY "Users can view their own requests" ON car_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own requests" ON car_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all requests" ON car_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all requests" ON car_requests FOR UPDATE USING (is_admin());

-- Cars policies (public read, admin write)
CREATE POLICY "Anyone can view active cars" ON cars FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can view all cars" ON cars FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert cars" ON cars FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update cars" ON cars FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete cars" ON cars FOR DELETE USING (is_admin());

-- Brands and tags policies (public read, admin write)
CREATE POLICY "Anyone can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Admins can manage brands" ON brands FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view car tags" ON car_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage car tags" ON car_tags FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view car tags junction" ON car_tags_junction FOR SELECT USING (true);
CREATE POLICY "Admins can manage car tags junction" ON car_tags_junction FOR ALL USING (is_admin());

-- Car reviews policies
CREATE POLICY "Anyone can view approved reviews" ON car_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert their own reviews" ON car_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own reviews" ON car_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reviews" ON car_reviews FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update reviews" ON car_reviews FOR UPDATE USING (is_admin());

-- Car offers policies
CREATE POLICY "Users can view their own offers" ON car_offers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own offers" ON car_offers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all offers" ON car_offers FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update offers" ON car_offers FOR UPDATE USING (is_admin());

-- Test drive requests policies
CREATE POLICY "Users can view their own test drive requests" ON test_drive_requests FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert test drive requests" ON test_drive_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all test drive requests" ON test_drive_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update test drive requests" ON test_drive_requests FOR UPDATE USING (is_admin());

-- Trade-in requests policies
CREATE POLICY "Users can view their own trade-in requests" ON trade_in_requests FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert trade-in requests" ON trade_in_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all trade-in requests" ON trade_in_requests FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update trade-in requests" ON trade_in_requests FOR UPDATE USING (is_admin());

-- User favorites policies
CREATE POLICY "Users can view their own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Anyone can insert analytics" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON analytics FOR SELECT USING (is_admin());
