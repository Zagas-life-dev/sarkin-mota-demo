'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { createClientComponentClient } from '@/lib/supabase-client'
import { getFavoriteCars } from '@/lib/favorites'
import { formatPrice } from '@/lib/cars'
import { Car } from '@/types/database'
import { 
  Heart, 
  Loader2,
  Eye,
  ArrowLeft,
  Trash2,
  Car as CarIcon
} from 'lucide-react'
import Image from 'next/image'

export default function FavoritesPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      setCheckingAuth(false)
      
      // Fetch favorite cars
      const cars = await getFavoriteCars(authUser.id)
      setFavoriteCars(cars)
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  const handleRemoveFavorite = async (carId: string) => {
    if (!user) return
    
    setRemovingId(carId)
    
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId)
      
      if (error) throw error
      
      // Remove from local state
      setFavoriteCars(prev => prev.filter(car => car.id !== carId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    } finally {
      setRemovingId(null)
    }
  }

  if (checkingAuth || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
            <p className="text-gray-400 font-light">Loading favorites...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-light mb-3">My Favorites</h1>
          <p className="text-gray-400 font-light text-lg">
            {favoriteCars.length === 0 
              ? 'No saved favorites yet' 
              : `${favoriteCars.length} saved ${favoriteCars.length === 1 ? 'car' : 'cars'}`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteCars.length === 0 ? (
          <div className="bg-[#0f1419] border-2 border-[#1a1f35] p-12 rounded-lg text-center">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-white mb-4">No Favorites Yet</h2>
            <p className="text-gray-400 font-light mb-6">
              Start saving your favorite cars to view them here
            </p>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-[#d4af37] text-[#0a0e1a] px-6 py-3 hover:bg-[#e5c158] transition-colors font-light"
            >
              <CarIcon className="w-5 h-5" />
              <span>Browse Cars</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCars.map((car) => (
              <div
                key={car.id}
                className="bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg overflow-hidden hover:border-[#d4af37]/40 transition-all duration-300 group"
              >
                {/* Car Image */}
                <Link href={`/cars/${car.id}`}>
                  <div className="relative h-48 bg-[#0a0e1a] overflow-hidden flex items-center justify-center">
                    {car.thumbnail_url || (car.images && car.images.length > 0) ? (
                      <Image
                        src={car.thumbnail_url || car.images[0]}
                        alt={car.title}
                        fill
                        className="object-contain transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CarIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="bg-[#d4af37] text-[#0a0e1a] px-3 py-1 rounded-full text-sm font-medium">
                        {formatPrice(car.price)}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Car Details */}
                <div className="p-6">
                  <Link href={`/cars/${car.id}`}>
                    <h3 className="text-xl font-light text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                      {car.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>{car.year}</span>
                    {car.mileage && (
                      <>
                        <span>•</span>
                        <span>{car.mileage.toLocaleString()} km</span>
                      </>
                    )}
                    {car.fuel_type && (
                      <>
                        <span>•</span>
                        <span>{car.fuel_type}</span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1a1f35]">
                    <Link
                      href={`/cars/${car.id}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-light"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(car.id)}
                      disabled={removingId === car.id}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 text-sm font-light"
                    >
                      {removingId === car.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


