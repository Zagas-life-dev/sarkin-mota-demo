// This script helps populate the Supabase database with sample car data
// Run this in your browser console or create a proper seeding script

const sampleCars = [
  {
    title: 'Mercedes-Benz G63 AMG',
    price: 185000000,
    original_price: 195000000,
    category: 'Luxury SUV',
    brand: 'Mercedes-Benz',
    model: 'G63 AMG',
    year: 2023,
    mileage: 15000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'A symbol of power and luxury, the 2023 G63 AMG combines rugged capability with opulent comfort. Its handcrafted biturbo V8 engine delivers exhilarating performance, while the iconic design commands attention on any road.',
    features: [
      'Nappa Leather Upholstery',
      'Burmester Surround Sound',
      'Active Multicontour Seats',
      '64-Color Ambient Lighting',
      '22-inch AMG Wheels',
      'Carbon Fiber Trim'
    ],
    whatsapp_contact: '+2348012345678'
  },
  {
    title: 'Porsche 911 GT3',
    price: 220000000,
    original_price: 235000000,
    category: 'Sports Car',
    brand: 'Porsche',
    model: '911 GT3',
    year: 2023,
    mileage: 8000,
    fuel_type: 'Petrol',
    transmission: 'Manual',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'The ultimate expression of Porsche engineering, the 911 GT3 delivers pure driving pleasure with its naturally aspirated flat-six engine and precision handling.',
    features: [
      'Naturally Aspirated Flat-Six Engine',
      'PDK Transmission',
      'Carbon Ceramic Brakes',
      'Sport Chrono Package',
      'PASM Sport Suspension',
      'GT3 Aerodynamics'
    ],
    whatsapp_contact: '+2348012345678'
  },
  {
    title: 'Range Rover Autobiography',
    price: 195000000,
    original_price: 210000000,
    category: 'Luxury SUV',
    brand: 'Range Rover',
    model: 'Autobiography',
    year: 2023,
    mileage: 12000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'The pinnacle of luxury and capability, the Range Rover Autobiography offers unparalleled refinement and off-road prowess in one exceptional package.',
    features: [
      'Meridian Surround Sound System',
      'Executive Class Rear Seats',
      'Terrain Response 2',
      'Adaptive Dynamics',
      'Windsor Leather Interior',
      '22-inch Alloy Wheels'
    ],
    whatsapp_contact: '+2348012345678'
  },
  {
    title: 'Toyota Land Cruiser V8',
    price: 85000000,
    original_price: 95000000,
    category: 'SUV',
    brand: 'Toyota',
    model: 'Land Cruiser V8',
    year: 2022,
    mileage: 25000,
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'The legendary Land Cruiser V8 combines rugged reliability with modern luxury, making it the perfect companion for any adventure.',
    features: [
      '4.5L V8 Diesel Engine',
      'KDSS Suspension',
      'Multi-Terrain Select',
      'Crawl Control',
      'Premium Audio System',
      'Heated and Ventilated Seats'
    ],
    whatsapp_contact: '+2348012345678'
  },
  {
    title: 'BMW X7 M60i',
    price: 165000000,
    original_price: 180000000,
    category: 'Luxury SUV',
    brand: 'BMW',
    model: 'X7 M60i',
    year: 2023,
    mileage: 18000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'The BMW X7 M60i represents the ultimate in luxury and performance, offering seven seats of pure driving pleasure with M performance credentials.',
    features: [
      '4.4L Twin-Turbo V8',
      'M Sport Exhaust',
      'Adaptive M Suspension',
      'Panoramic Sky Lounge',
      'Bowers & Wilkins Diamond Sound',
      'Gesture Control'
    ],
    whatsapp_contact: '+2348012345678'
  },
  {
    title: 'Lexus LX 600',
    price: 145000000,
    original_price: 160000000,
    category: 'Luxury SUV',
    brand: 'Lexus',
    model: 'LX 600',
    year: 2023,
    mileage: 15000,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop'
    ],
    status: 'active',
    location: 'Lagos',
    description: 'The Lexus LX 600 combines Japanese craftsmanship with American luxury, offering a refined driving experience with exceptional reliability.',
    features: [
      '3.5L Twin-Turbo V6',
      'Multi-Terrain Monitor',
      'Mark Levinson Audio',
      'Semi-Aniline Leather',
      '25-speaker Surround Sound',
      'Heads-Up Display'
    ],
    whatsapp_contact: '+2348012345678'
  }
]

// To use this data, you can:
// 1. Copy this script and run it in your browser console
// 2. Create a proper seeding script that uses the Supabase client
// 3. Use the Supabase dashboard to manually insert the data

console.log('Sample car data ready for insertion:', sampleCars)

// Example of how to insert using Supabase client (if you have access):
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

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
*/ 