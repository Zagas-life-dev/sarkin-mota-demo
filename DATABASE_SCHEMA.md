# Database Schema Documentation

## Overview

This database schema is designed for Sarkin Mota Autos, a comprehensive car marketplace platform. All images and videos are stored on Cloudinary, while all data is stored in Supabase (PostgreSQL).

## Table Structure

### Core Tables

#### 1. `users`
User accounts and authentication
- **Fields**: id, email, name, role, affiliate_code, affiliate_status, total_earnings
- **Roles**: user, affiliate, content_admin, super_admin

#### 2. `dealers`
Dealer information and contact details
- **Fields**: id, name, phone, email, address, city, state, location, whatsapp_contact, website, logo_url, description, is_verified
- **Purpose**: Store dealer information for car listings

#### 3. `cars` ⭐ **Main Table**
Comprehensive car listings with all specifications

**Basic Information:**
- `title`, `stock_number`, `price`, `original_price`, `offer_price`

**Car Overview:**
- `brand`, `model`, `year`, `body`, `category`, `condition`

**Engine & Performance:**
- `engine_size`, `engine_description`, `cylinders`, `fuel_type`, `fuel_consumption_city/hwy`, `fuel_tank_capacity`

**Transmission & Drivetrain:**
- `transmission`, `drive_type`

**Physical Specifications:**
- `doors`, `color`, `interior_color`, `vin`, `mileage`

**Dimensions & Capacity:**
- `length`, `width`, `width_with_mirrors`, `height`, `height_with_roof_rails`, `wheelbase`, `turning_circle`
- `luggage_capacity_seats_up/down`, `gross_vehicle_weight`, `max_loading_weight`, `max_roof_load`
- `max_towing_weight_braked/unbraked`, `minimum_kerbweight`, `number_of_seats`

**Media (Cloudinary URLs):**
- `images` (TEXT[]) - Array of Cloudinary image URLs
- `videos` (TEXT[]) - Array of Cloudinary video URLs
- `thumbnail_url` - Primary image URL for listings

**Features (JSONB):**
```json
{
  "interior": ["Air Conditioner", "Digital Odometer", "Heater", "Leather Seats"],
  "comfort": ["Android Auto", "Apple CarPlay", "Bluetooth", "Power Steering"],
  "safety": ["Anti-lock Braking", "Brake Assist", "Driver Air Bag", "Stability Control"],
  "exterior": ["Fog Lights Front", "Rain Sensing Wiper", "Windows - Electric"]
}
```

**Location & Contact:**
- `location`, `dealer_id`, `whatsapp_contact`, `phone_contact`, `email_contact`

**Status & Tracking:**
- `status` (active, sold, expired, pending, draft)
- `is_featured`, `clicks`, `views`, `favorites_count`

**Financing:**
- `financing_available`, `financing_interest_rate`, `financing_min_down_payment`, `financing_max_term`

#### 4. `car_requests`
User-submitted car listing requests
- **Fields**: All car details plus seller information and status tracking
- **Images**: exterior_image1/2, interior_image1/2 (Cloudinary URLs)

#### 5. `brands`
Car brand catalog
- **Fields**: id, name, logo_url (Cloudinary URL)

#### 6. `car_tags`
Categorization tags for cars
- **Fields**: id, name, category (condition, type, feature, etc.)

#### 7. `car_tags_junction`
Many-to-many relationship between cars and tags

### Feature Tables

#### 8. `car_reviews`
Customer reviews with ratings
- **Ratings**: comfort, interior_design, exterior_styling, value, performance, reliability (1-5 scale)
- **Fields**: car_id, user_id, review_text, is_approved

#### 9. `car_offers`
"Make an Offer" functionality
- **Fields**: car_id, user_id, offer_price, name, email, phone, trade_in_price, status

#### 10. `test_drive_requests`
Test drive scheduling
- **Fields**: car_id, user_id, name, email, phone, best_time, status, scheduled_date

#### 11. `trade_in_requests`
Trade-in vehicle evaluation
- **Fields**: car_id (desired car), trade-in vehicle details, contact info, estimated_value

#### 12. `user_favorites`
Saved favorite cars
- **Fields**: user_id, car_id (unique constraint)

#### 13. `analytics`
User interaction tracking
- **Fields**: page_name, user_id, session_id, event_type, event_data (JSONB)

## Cloudinary Integration

All media files are stored on Cloudinary and referenced by URL in the database:

- **Images**: Stored in `images` array (TEXT[])
- **Videos**: Stored in `videos` array (TEXT[])
- **Thumbnails**: Single `thumbnail_url` for quick loading
- **Dealer Logos**: `logo_url` in dealers table
- **Brand Logos**: `logo_url` in brands table

### Example Cloudinary URLs:
```
https://res.cloudinary.com/ddnlbizum/image/upload/v1234567890/car-image.jpg
https://res.cloudinary.com/ddnlbizum/video/upload/v1234567890/car-video.mp4
```

## Key Features

### 1. Comprehensive Car Specifications
Based on competitor sites (buyabujacars.com, cars45.com, abujacarsonline.com), the schema includes:
- Full car overview (body, mileage, fuel type, year, transmission, drive type, condition, engine size, doors, cylinders, color, VIN)
- Detailed dimensions and capacity
- Engine and transmission specifications
- Structured features (interior, comfort, safety, exterior)

### 2. Search Optimization
- `search_keywords` array for full-text search
- GIN indexes on JSONB fields for fast queries
- Multiple indexes on commonly filtered fields

### 3. Security (Row Level Security)
- Public can view active cars
- Users can only manage their own data
- Admins have full access
- All tables have RLS enabled

### 4. Performance
- Comprehensive indexing strategy
- GIN indexes for array and JSONB fields
- Indexes on frequently queried fields (status, brand, category, price, location, etc.)

## Usage Examples

### Inserting a Car with Cloudinary URLs
```sql
INSERT INTO cars (
  title, brand, model, year, price, condition,
  images, videos, features, location, whatsapp_contact
) VALUES (
  '2017 Mercedes-Benz S-Class AMG',
  'Mercedes-Benz',
  'S-Class AMG',
  2017,
  61000000,
  'Foreign Used',
  ARRAY[
    'https://res.cloudinary.com/ddnlbizum/image/upload/v123/exterior1.jpg',
    'https://res.cloudinary.com/ddnlbizum/image/upload/v123/exterior2.jpg'
  ],
  ARRAY[
    'https://res.cloudinary.com/ddnlbizum/video/upload/v123/car-video.mp4'
  ],
  '{
    "interior": ["Air Conditioner", "Leather Seats", "Panoramic Moonroof"],
    "comfort": ["Android Auto", "Apple CarPlay", "Bluetooth"],
    "safety": ["Anti-lock Braking", "Driver Air Bag", "Stability Control"],
    "exterior": ["Fog Lights Front", "Rain Sensing Wiper"]
  }'::jsonb,
  'Abuja, Nigeria',
  '+2348053682130'
);
```

### Querying Cars with Features
```sql
SELECT 
  title, price, brand, model, year,
  images, videos,
  features->'interior' as interior_features,
  features->'safety' as safety_features
FROM cars
WHERE status = 'active'
  AND brand = 'Mercedes-Benz'
  AND features->'interior' @> '["Leather Seats"]'::jsonb;
```

## Migration Notes

If you're updating from the old schema:

1. **Backup your data** before running the migration
2. The new `cars` table has many additional fields - existing data will have NULL values for new fields
3. You'll need to migrate existing `images` array to include `videos` array
4. Convert existing `features` array to JSONB structure if needed
5. Add dealer information if you have dealer relationships

## Next Steps

1. Run the schema in your Supabase SQL editor
2. Update your TypeScript types (already done in `src/types/database.ts`)
3. Update your API functions to use the new fields
4. Migrate existing data if applicable
5. Test all CRUD operations





