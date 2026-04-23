export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'affiliate' | 'content_admin' | 'super_admin'
  affiliate_code?: string
  affiliate_status?: 'pending' | 'approved' | 'rejected'
  total_earnings?: number
  created_at: string
  updated_at: string
}

export interface Dealer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  city?: string
  state?: string
  location?: string
  whatsapp_contact?: string
  website?: string
  logo_url?: string
  description?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CarRequest {
  id: string
  user_id: string
  seller_name: string
  seller_phone: string
  brand: string
  model: string
  year: number
  price: number
  mileage?: number
  fuel_type?: string
  transmission?: string
  condition: string
  location: string
  description?: string
  exterior_image1?: string
  exterior_image2?: string
  interior_image1?: string
  interior_image2?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface CarFeatures {
  interior?: string[]
  comfort?: string[]
  safety?: string[]
  exterior?: string[]
  [key: string]: string[] | undefined
}

export interface Car {
  id: string
  title: string
  stock_number?: string
  price: number
  original_price?: number
  offer_price?: number
  
  // Car Overview
  brand: string
  model: string
  year: number
  body?: string
  category: string
  condition: 'Brand New' | 'Used' | 'Foreign Used' | 'Nigerian Used' | 'Certified'
  
  // Engine & Performance
  engine_size?: string
  engine_description?: string
  cylinders?: number
  fuel_type?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'CNG'
  fuel_consumption_city?: number
  fuel_consumption_hwy?: number
  fuel_tank_capacity?: number
  
  // Transmission & Drivetrain
  transmission?: 'Automatic' | 'Manual' | 'CVT' | 'Semi-Automatic'
  drive_type?: string
  
  // Physical Specifications
  doors?: number
  color?: string
  interior_color?: string
  vin?: string
  mileage?: number
  
  // Dimensions & Capacity
  length?: number
  width?: number
  width_with_mirrors?: number
  height?: number
  height_with_roof_rails?: number
  wheelbase?: number
  turning_circle?: number
  luggage_capacity_seats_up?: number
  luggage_capacity_seats_down?: number
  gross_vehicle_weight?: number
  max_loading_weight?: number
  max_roof_load?: number
  max_towing_weight_braked?: number
  max_towing_weight_unbraked?: number
  minimum_kerbweight?: number
  number_of_seats?: number
  
  // Media (Cloudinary URLs)
  images: string[]
  videos: string[]
  thumbnail_url?: string
  
  // Features (structured)
  features: CarFeatures
  
  // Location & Contact
  location: string
  dealer_id?: string
  whatsapp_contact: string
  phone_contact?: string
  email_contact?: string
  
  // Description & Details
  description?: string
  short_description?: string
  
  // Status & Tracking
  status: 'active' | 'sold' | 'expired' | 'pending' | 'draft'
  is_featured: boolean
  clicks: number
  views: number
  favorites_count: number
  
  // Financing Information
  financing_available: boolean
  financing_interest_rate?: number
  financing_min_down_payment?: number
  financing_max_term?: number
  
  // Admin & Metadata
  admin_id?: string
  created_at: string
  updated_at: string
  
  // Search optimization
  search_keywords: string[]
}

export interface Brand {
  id: string
  name: string
  logo_url?: string
  created_at: string
}

export interface CarTag {
  id: string
  name: string
  category?: string
  created_at: string
}

export interface CarTagJunction {
  car_id: string
  tag_id: string
}

export interface CarReview {
  id: string
  car_id: string
  user_id: string
  rating_comfort?: number
  rating_interior_design?: number
  rating_exterior_styling?: number
  rating_value?: number
  rating_performance?: number
  rating_reliability?: number
  review_text?: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface CarOffer {
  id: string
  car_id: string
  user_id?: string
  offer_price: number
  name: string
  email: string
  phone: string
  trade_in_price?: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface TestDriveRequest {
  id: string
  car_id: string
  user_id?: string
  name: string
  email: string
  phone: string
  best_time?: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  scheduled_date?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface TradeInRequest {
  id: string
  car_id: string
  user_id?: string
  trade_make: string
  trade_model: string
  trade_year: number
  trade_transmission?: string
  trade_mileage?: number
  trade_exterior_color?: string
  trade_interior_color?: string
  trade_owner?: string
  trade_exterior_condition?: string
  trade_interior_condition?: string
  trade_accident_history?: string
  trade_images: string[]
  trade_video_url?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  comments?: string
  status: 'pending' | 'evaluated' | 'accepted' | 'rejected'
  estimated_value?: number
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  page_name: string
  user_id?: string
  session_id?: string
  event_type: string
  event_data?: any
  created_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  car_id: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string | null
  car_id: string | null
  subject: string
  status: 'open' | 'closed' | 'archived'
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_name: string
  sender_email: string | null
  message_text: string
  is_read: boolean
  is_admin: boolean
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      dealers: {
        Row: Dealer
        Insert: Omit<Dealer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Dealer, 'id' | 'created_at' | 'updated_at'>>
      }
      car_requests: {
        Row: CarRequest
        Insert: Omit<CarRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CarRequest, 'id' | 'created_at' | 'updated_at'>>
      }
      cars: {
        Row: Car
        Insert: Omit<Car, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>
      }
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at'>
        Update: Partial<Omit<Brand, 'id' | 'created_at'>>
      }
      car_tags: {
        Row: CarTag
        Insert: Omit<CarTag, 'id' | 'created_at'>
        Update: Partial<Omit<CarTag, 'id' | 'created_at'>>
      }
      car_tags_junction: {
        Row: CarTagJunction
        Insert: CarTagJunction
        Update: Partial<CarTagJunction>
      }
      car_reviews: {
        Row: CarReview
        Insert: Omit<CarReview, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CarReview, 'id' | 'created_at' | 'updated_at'>>
      }
      car_offers: {
        Row: CarOffer
        Insert: Omit<CarOffer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CarOffer, 'id' | 'created_at' | 'updated_at'>>
      }
      test_drive_requests: {
        Row: TestDriveRequest
        Insert: Omit<TestDriveRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TestDriveRequest, 'id' | 'created_at' | 'updated_at'>>
      }
      trade_in_requests: {
        Row: TradeInRequest
        Insert: Omit<TradeInRequest, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TradeInRequest, 'id' | 'created_at' | 'updated_at'>>
      }
      analytics: {
        Row: Analytics
        Insert: Omit<Analytics, 'id' | 'created_at'>
        Update: Partial<Omit<Analytics, 'id' | 'created_at'>>
      }
      user_favorites: {
        Row: UserFavorite
        Insert: Omit<UserFavorite, 'id' | 'created_at'>
        Update: Partial<Omit<UserFavorite, 'id' | 'created_at'>>
      }
    }
  }
}
