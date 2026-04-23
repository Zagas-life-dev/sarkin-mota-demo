'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import CarContactForm from '@/components/CarContactForm'
import CarMessaging from '@/components/CarMessaging'
import { trackPageView, trackCarClick, trackContactClick } from '@/lib/analytics'
import { getCarById, formatPrice } from '@/lib/cars'
import { Car } from '@/types/database'
import { 
  ChevronRight,
  Phone,
  MessageCircle,
  CheckCircle,
  Calendar,
  Gauge,
  Palette,
  Users,
  ArrowLeft,
  Mail,
  Heart,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@/lib/supabase-client'
import { isCarFavorited, toggleFavorite } from '@/lib/favorites'
import { trackEvent } from '@/lib/analytics'

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isMessagingOpen, setIsMessagingOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      if (!params.id) return
      
      try {
        const carData = await getCarById(params.id as string)
        if (carData) {
          setCar(carData)
          trackPageView(`car_detail: ${carData.title}`)
          trackCarClick(carData.id, carData.title)
          
          // Track view for anonymous users too
          try {
            await fetch(`/api/cars/${params.id}/views`, {
              method: 'POST',
            })
          } catch (err) {
            console.error('Error tracking view:', err)
            // Don't fail the page load if view tracking fails
          }
        } else {
          setError('Car not found')
        }
      } catch (err) {
        console.error('Error fetching car:', err)
        setError('Failed to load car details')
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [params.id])

  // Check user and favorite status
  useEffect(() => {
    const checkUserAndFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      
      if (user && car) {
        const favorited = await isCarFavorited(car.id, user.id)
        setIsFavorited(favorited)
      }
    }
    
    if (car) {
      checkUserAndFavorite()
    }
  }, [car, supabase])

  const handleWhatsAppContact = () => {
    if (!car) return
    
    const message = `Hi, I'm interested in ${car.title}, manufactured in ${car.year} price is ${formatPrice(car.price)} listed on Sarkin Mota Autos`
    const whatsappUrl = `https://wa.me/${car.whatsapp_contact.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    trackContactClick(car.id, car.title, 'whatsapp')
  }

  const handleToggleFavorite = async () => {
    if (!car || !userId) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/cars/${car?.id}`))
      return
    }

    setIsTogglingFavorite(true)
    try {
      const success = await toggleFavorite(car.id, userId)
      if (success) {
        const newFavorited = !isFavorited
        setIsFavorited(newFavorited)
        
        // Track analytics
        await trackEvent({
          page_name: 'car_detail',
          event_type: newFavorited ? 'car_favorited' : 'car_unfavorited',
          event_data: {
            car_id: car.id,
            car_title: car.title,
          },
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-background text-foreground">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-800 mb-8" />
            <div className="h-12 bg-gray-800 rounded mb-4" />
            <div className="h-6 bg-gray-800 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-800 rounded mb-4" />
                <div className="h-4 bg-gray-800 rounded mb-2" />
                <div className="h-4 bg-gray-800 rounded mb-2" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
              </div>
              <div className="lg:col-span-1">
                <div className="h-32 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="bg-background text-foreground">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl text-white font-light mb-4">Car Not Found</h1>
          <p className="text-white/60 mb-8">{error || 'The car you are looking for does not exist.'}</p>
          <Link 
            href="/cars"
            className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Cars</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[80vh] bg-black">
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ 
            backgroundImage: car.images && car.images.length > 0 
              ? `url(${car.images[0]})` 
              : `url('/api/placeholder/1200/800')`
          }}
        />
        <div className="relative h-full flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 md:pb-16">
            <h1 className="text-2xl md:text-5xl lg:text-7xl font-light text-white mb-2 md:mb-4 tracking-tight">
              {car.title}
            </h1>
            <div className="flex items-center space-x-4 md:space-x-8 text-sm md:text-xl text-gray-300 font-light">
              <span>{car.year}</span>
              <span>&bull;</span>
              <span>{car.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-16">
              <h2 className="text-4xl text-white font-light mb-8">Vehicle Overview</h2>
              <p className="text-white/70 font-light text-xl leading-relaxed">
                {car.description || 'No description available for this vehicle.'}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-16">
              <h3 className="text-3xl text-white font-light mb-8">Key Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-white/50 text-sm">Brand</p>
                  <p className="text-2xl text-white font-light">{car.brand}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Model</p>
                  <p className="text-2xl text-white font-light">{car.model}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Year</p>
                  <p className="text-2xl text-white font-light">{car.year}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">Category</p>
                  <p className="text-2xl text-white font-light">{car.category}</p>
                </div>
                {car.mileage && (
                  <div>
                    <p className="text-white/50 text-sm">Mileage</p>
                    <p className="text-2xl text-white font-light">{car.mileage.toLocaleString()} km</p>
                  </div>
                )}
                {car.fuel_type && (
                  <div>
                    <p className="text-white/50 text-sm">Fuel Type</p>
                    <p className="text-2xl text-white font-light">{car.fuel_type}</p>
                  </div>
                )}
                {car.transmission && (
                  <div>
                    <p className="text-white/50 text-sm">Transmission</p>
                    <p className="text-2xl text-white font-light">{car.transmission}</p>
                  </div>
                )}
                <div>
                  <p className="text-white/50 text-sm">Condition</p>
                  <p className="text-2xl text-white font-light">{car.condition}</p>
                </div>
              </div>
            </div>
            
            {/* Features */}
            {car.features && (Object.keys(car.features).length > 0) && (
              <div>
                <h3 className="text-3xl text-white font-light mb-8">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(car.features).map(([category, features]) => 
                    features && features.length > 0 && features.map((feature: string, index: number) => (
                      <div key={`${category}-${index}`} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-white/50 mr-4" />
                        <span className="text-white/80 font-light">{feature}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Inquiry */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-transparent border border-border p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl text-white font-light">Inquire</h3>
                <button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  className={`p-2 rounded transition-colors ${
                    isFavorited
                      ? 'text-red-400 hover:text-red-300'
                      : 'text-gray-400 hover:text-red-400'
                  } disabled:opacity-50`}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isTogglingFavorite ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  )}
                </button>
              </div>
              <p className="text-3xl text-white font-medium mb-8">{formatPrice(car.price)}</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setIsMessagingOpen(true)
                    trackContactClick(car.id, car.title, 'message')
                  }}
                  className="w-full bg-[#d4af37] text-[#0a0e1a] py-4 px-6 hover:bg-[#e5c158] transition-colors flex items-center justify-center font-medium"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <span>Send Message</span>
                </button>
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-white text-black py-4 px-6 hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <span>Contact via WhatsApp</span>
                </button>
                <button
                  onClick={() => {
                    setIsContactFormOpen(true)
                    trackContactClick(car.id, car.title, 'email')
                  }}
                  className="w-full border border-border text-white py-4 px-6 hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  <span>Send Email Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {car.images && car.images.length > 0 && (
        <section className="py-24 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl text-white font-light mb-12 text-center">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {car.images.map((image, index) => (
                <div key={index} className="aspect-video bg-black flex items-center justify-center">
                  <img 
                    src={image}
                    alt={`${car.title} image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Modal */}
      {car && (
        <>
          <CarContactForm
            car={car}
            isOpen={isContactFormOpen}
            onClose={() => setIsContactFormOpen(false)}
          />
          <CarMessaging
            car={car}
            isOpen={isMessagingOpen}
            onClose={() => setIsMessagingOpen(false)}
          />
        </>
      )}
    </div>
  )
} 