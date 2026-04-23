import { createClientComponentClient } from './supabase-client'
import { UserFavorite, Car } from '@/types/database'

// Check if a car is favorited by the current user
export async function isCarFavorited(carId: string, userId: string | null): Promise<boolean> {
  if (!userId) return false
  
  const supabase = createClientComponentClient()
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('car_id', carId)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking favorite:', error)
    return false
  }
  
  return !!data
}

// Add a car to favorites
export async function addToFavorites(carId: string, userId: string): Promise<boolean> {
  const supabase = createClientComponentClient()
  
  const { error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: userId,
      car_id: carId,
    })
  
  if (error) {
    console.error('Error adding to favorites:', error)
    return false
  }
  
  return true
}

// Remove a car from favorites
export async function removeFromFavorites(carId: string, userId: string): Promise<boolean> {
  const supabase = createClientComponentClient()
  
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('car_id', carId)
  
  if (error) {
    console.error('Error removing from favorites:', error)
    return false
  }
  
  return true
}

// Toggle favorite status
export async function toggleFavorite(carId: string, userId: string | null): Promise<boolean> {
  if (!userId) return false
  
  const isFavorited = await isCarFavorited(carId, userId)
  
  if (isFavorited) {
    return await removeFromFavorites(carId, userId)
  } else {
    return await addToFavorites(carId, userId)
  }
}

// Get all favorite cars for a user
export async function getFavoriteCars(userId: string): Promise<Car[]> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      car_id,
      created_at,
      cars (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching favorite cars:', error)
    return []
  }
  
  // Extract cars from the joined data
  if (data) {
    return data.map((item: any) => item.cars).filter(Boolean)
  }
  
  return []
}

// Get favorite count for a car
export async function getFavoriteCount(carId: string): Promise<number> {
  const supabase = createClientComponentClient()
  
  const { count, error } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('car_id', carId)
  
  if (error) {
    console.error('Error getting favorite count:', error)
    return 0
  }
  
  return count || 0
}



