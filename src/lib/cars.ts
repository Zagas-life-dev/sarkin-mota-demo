import { createClientComponentClient } from './supabase-client'
import { Car } from '@/types/database'

export async function getFeaturedCars(limit: number = 3): Promise<Car[]> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured cars:', error)
    return []
  }

  return data || []
}

export async function getAllCars(): Promise<Car[]> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all cars:', error)
    return []
  }

  return data || []
}

export async function getCarById(id: string): Promise<Car | null> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error) {
    console.error('Error fetching car by id:', error)
    return null
  }

  return data
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
} 