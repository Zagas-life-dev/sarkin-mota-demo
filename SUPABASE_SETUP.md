# Supabase Integration Setup

This document explains how to set up and use the Supabase database integration for the Sarkin Mota Autos website.

## Prerequisites

1. A Supabase account and project
2. Environment variables configured
3. Database schema applied

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. **Apply the Schema**: Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor
2. **Enable Row Level Security**: The schema includes RLS policies for security
3. **Insert Initial Data**: The schema includes initial brands and car tags

## Database Structure

### Main Tables

- **users**: User accounts and roles
- **cars**: Vehicle listings with all details
- **car_requests**: User-submitted car sale requests
- **brands**: Car brands (Toyota, BMW, etc.)
- **car_tags**: Tags for categorizing cars
- **analytics**: Page views and user interactions

### Car Data Fields

- `title`: Full car title (e.g., "Mercedes-Benz G63 AMG")
- `price`: Price in Naira (integer)
- `brand`: Car brand (e.g., "Mercedes-Benz")
- `model`: Car model (e.g., "G63 AMG")
- `year`: Manufacturing year
- `category`: Category (e.g., "Luxury SUV", "Sports Car")
- `images`: Array of image URLs
- `features`: Array of feature strings
- `whatsapp_contact`: WhatsApp contact number
- `status`: "active", "sold", or "expired"

## Adding Sample Data

### Option 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Select the "cars" table
4. Click "Insert" and add cars manually

### Option 2: Using the Sample Data Script

1. Open `scripts/seed-data.js`
2. Copy the sample data
3. Use the Supabase client to insert the data:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Insert sample cars
sampleCars.forEach(async (car) => {
  const { data, error } = await supabase
    .from('cars')
    .insert(car)
  
  if (error) {
    console.error('Error inserting car:', error)
  } else {
    console.log('Car inserted successfully:', data)
  }
})
```

### Option 3: Browser Console

1. Open your website in the browser
2. Open the browser console
3. Copy and paste the sample data from `scripts/seed-data.js`
4. Use the Supabase client to insert the data

## API Functions

The following functions are available in `src/lib/cars.ts`:

- `getFeaturedCars(limit)`: Get featured cars for homepage
- `getAllCars()`: Get all active cars
- `getCarById(id)`: Get a specific car by ID
- `formatPrice(price)`: Format price in Nigerian Naira

## Usage Examples

### Fetching Featured Cars

```javascript
import { getFeaturedCars } from '@/lib/cars'

const featuredCars = await getFeaturedCars(3)
```

### Fetching All Cars

```javascript
import { getAllCars } from '@/lib/cars'

const allCars = await getAllCars()
```

### Formatting Prices

```javascript
import { formatPrice } from '@/lib/cars'

const formattedPrice = formatPrice(185000000) // Returns "₦185,000,000"
```

## Security

The database uses Row Level Security (RLS) with the following policies:

- **Public Read Access**: Anyone can view active cars
- **Admin Write Access**: Only admins can create, update, or delete cars
- **User-Specific Access**: Users can only view their own requests and profiles

## Troubleshooting

### Common Issues

1. **"No cars found"**: Make sure you have cars in the database with `status = 'active'`
2. **Authentication errors**: Check your environment variables
3. **Permission errors**: Verify RLS policies are correctly applied

### Debugging

1. Check the browser console for errors
2. Verify your Supabase URL and key are correct
3. Test database connections in the Supabase dashboard
4. Check RLS policies in the Supabase dashboard

## Next Steps

1. Add real car images to replace placeholder URLs
2. Implement admin interface for managing cars
3. Add user authentication for car requests
4. Implement analytics tracking
5. Add search and filtering functionality

## Support

For issues with the Supabase integration, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- Project issues and discussions
