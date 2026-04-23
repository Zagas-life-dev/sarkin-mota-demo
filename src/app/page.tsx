'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import { trackPageView } from '@/lib/analytics'
import { getFeaturedCars, formatPrice } from '@/lib/cars'
import { Car } from '@/types/database'
import { 
  ChevronRight,
  Star,
  Shield,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  Users,
  Handshake,
  CreditCard,
  Camera,
  TrendingUp,
  Network,
  Heart
} from 'lucide-react'

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    trackPageView('home')
    
    const fetchFeaturedCars = async () => {
      try {
        const cars = await getFeaturedCars(3)
        setFeaturedCars(cars)
      } catch (error) {
        console.error('Error fetching featured cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCars()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navigation />
      
      {/* Hero Section - Full Bleed */}
      <section className="relative h-screen md:h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a]">
          <video
            className="w-full h-full object-cover opacity-30"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/ddnlbizum/video/upload/v1768496776/social-cat-instagram_instagram_1_ib41db.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/80 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
            <div className="max-w-4xl fade-in-up">
              <div className="inline-block mb-4 md:mb-8">
                <span className="text-xs md:text-sm lg:text-base tracking-[0.3em] md:tracking-[0.5em] px-2 text-[#d4af37]/80 uppercase font-light">
                  Dr. Aliyu Muhammad
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white mb-4 md:mb-8 leading-[0.95] tracking-tight">
                Sarkin Mota
                <span className="block mt-1 md:mt-2 text-lg md:text-xl lg:text-2xl space-x-0.5 tracking-normal text-[#d4af37]">Jan Kasar Hausa</span> 
              </h1>
              <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 font-light leading-relaxed max-w-2xl">
                The First King of Cars. Built from zero capital to a nationwide network, one car, one relationship, and one good name at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <Link 
                  href="/cars" 
                  className="group inline-flex items-center justify-center bg-[#d4af37] text-[#0a0e1a] px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-medium hover:bg-[#e5c158] transition-all duration-300 shadow-lg shadow-[#d4af37]/20"
                >
                  <span>Explore Collection</span>
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about" 
                  className="group inline-flex items-center justify-center border-2 border-white/30 text-white px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-light hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <span>The Full Story</span>
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden on mobile */}
        <div className="hidden md:flex absolute bottom-12 left-1/2 transform -translate-x-1/2 flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#d4af37] to-transparent animate-pulse" />
          <span className="text-[#d4af37]/60 text-xs mt-6 font-light tracking-[0.3em]">SCROLL</span>
        </div>
      </section>

      {/* Network Stats - Full Bleed Strip */}
      <section className="border-y border-[#1a1f35] bg-[#0f1419] py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="text-center md:text-left fade-in-up">
              <div className="text-[#d4af37]/70 text-xs tracking-[0.3em] mb-2 md:mb-4 uppercase font-light">DEALER NETWORK</div>
              <div className="text-3xl md:text-4xl lg:text-5xl text-white font-light">2,500+</div>
              <div className="text-sm md:text-lg text-gray-400 font-light mt-1 md:mt-2">Verified dealers nationwide</div>
            </div>
            <div className="text-center md:text-left fade-in-up delay-1">
              <div className="text-[#d4af37]/70 text-xs tracking-[0.3em] mb-2 md:mb-4 uppercase font-light">ACTIVE GROUPS</div>
              <div className="text-3xl md:text-4xl lg:text-5xl text-white font-light">500+</div>
              <div className="text-sm md:text-lg text-gray-400 font-light mt-1 md:mt-2">WhatsApp dealer groups</div>
            </div>
            <div className="text-center md:text-left fade-in-up delay-2">
              <div className="text-[#d4af37]/70 text-xs tracking-[0.3em] mb-2 md:mb-4 uppercase font-light">REACH</div>
              <div className="text-3xl md:text-4xl lg:text-5xl text-white font-light">Nationwide</div>
              <div className="text-sm md:text-lg text-gray-400 font-light mt-1 md:mt-2">Complete coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars - Bold Cards */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-20 fade-in-up gap-4">
            <div>
              <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-2 md:mb-4 uppercase font-light">FEATURED</div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light leading-tight">Latest Arrivals</h2>
            </div>
            <Link 
              href="/cars" 
              className="group flex items-center text-white hover:text-[#d4af37] transition-colors text-sm md:text-lg font-light"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#1a1f35] mb-6" />
                  <div className="h-6 bg-[#1a1f35] rounded mb-3" />
                  <div className="h-4 bg-[#1a1f35] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {featuredCars.map((car, index) => (
                <Link 
                  key={car.id}
                  href={`/cars/${car.id}`} 
                  className={`group relative overflow-hidden fade-in-up ${index === 1 ? 'delay-1' : ''} ${
                    index === 2 ? 'delay-2' : ''
                  }`}
                >
                  <div className="aspect-[4/3] bg-[#1a1f35] relative overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <div 
                        className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${car.images[0]})` }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[url('/api/placeholder/800/600')] bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="mt-4 md:mt-6">
                    <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-wider mb-1 md:mb-2 uppercase font-light">{car.category}</div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-light mb-2 md:mb-3">{car.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-gray-400 font-light">{car.year}</span>
                      <span className="text-white text-lg md:text-xl font-medium">{formatPrice(car.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-xl mb-6">No featured cars available at the moment.</p>
              <Link 
                href="/cars" 
                className="inline-flex items-center text-white hover:text-[#d4af37] transition-colors"
              >
                <span className="text-lg font-light">Browse All Cars</span>
                <ChevronRight className="w-6 h-6 ml-3" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* The Story - Full Bleed Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#0f1419] border-y border-[#1a1f35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
            {/* Story Content */}
            <div className="fade-in-up">
              <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-4 md:mb-6 uppercase font-light">THE FOUNDER</div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-8 leading-tight">
                From Middleman to King of Cars
              </h2>
              <p className="text-base md:text-xl text-gray-300 font-light mb-4 md:mb-8 leading-relaxed">
                Sarkin Mota Autos was built from zero capital, persistence, and an obsession with doing right by every client. 
                Started in 2018-2019, three BMWs sold in 24 hours, followed by three months with no sales. But persistence won.
              </p>
              
              <div className="space-y-6 md:space-y-8 mt-8 md:mt-12">
                <div className="border-l-2 border-[#d4af37]/50 pl-4 md:pl-6">
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">PHILOSOPHY</div>
                  <p className="text-lg md:text-2xl text-white font-light italic leading-relaxed">
                    "My mistakes were my mentor."
                  </p>
                </div>
                <div className="border-l-2 border-[#d4af37]/50 pl-4 md:pl-6">
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">ORIGIN</div>
                  <p className="text-lg md:text-2xl text-white font-light italic leading-relaxed">
                    "I started Sarkin Mota Autos without a dime."
                  </p>
                </div>
                <div className="border-l-2 border-[#d4af37]/50 pl-4 md:pl-6">
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">INVITATION</div>
                  <p className="text-lg md:text-2xl text-white font-light italic leading-relaxed">
                    "Come and buy before you hear sold."
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="lg:pl-8">
              <div className="relative lg:border-l-2 lg:border-[#1a1f35] lg:pl-8 md:lg:pl-12 space-y-8 md:space-y-12">
                {/* 2018-2019 */}
                <div className="relative fade-in-up">
                  <div className="hidden lg:block absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">
                    2018-19 · ORIGIN
                  </div>
                  <h3 className="text-xl md:text-2xl text-white font-light mb-2 md:mb-3">First Sales on Twitter</h3>
                  <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed">
                    Three BMW 3 Series sold within 24 hours of posting — followed by three months with no sales. 
                    Persistence in the face of silence defined the early days.
                  </p>
                </div>

                {/* Network */}
                <div className="relative fade-in-up delay-1">
                  <div className="hidden lg:block absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">
                    NETWORK
                  </div>
                  <h3 className="text-xl md:text-2xl text-white font-light mb-2 md:mb-3">Building a Dealer Ecosystem</h3>
                  <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed">
                    Systematic networking grew into 2,500+ direct dealer contacts across 500+ groups — moving from 
                    taking pictures for others to owning the brand and the listings.
                  </p>
                </div>

                {/* Honours */}
                <div className="relative fade-in-up delay-2">
                  <div className="hidden lg:block absolute -left-[12px] top-1 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <div className="text-xs tracking-[0.3em] text-[#d4af37]/70 uppercase mb-2 md:mb-3 font-light">
                    HONOURS
                  </div>
                  <h3 className="text-xl md:text-2xl text-white font-light mb-2 md:mb-3">Recognised as Sarkin Motor</h3>
                  <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed">
                    Honoured by the Federal Road Safety Corps, awarded an honorary doctorate, and turbaned by the 
                    Emir of Daura as <span className="font-medium text-[#d4af37]">Sarkin Motor Jan Kasar Hausa</span> — 
                    the first King of Cars.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Experience - Bold Cards */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 md:mb-20 fade-in-up">
            <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-3 md:mb-6 uppercase font-light">TRUST & EXPERIENCE</div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-8 leading-tight px-4">Why People Trust Sarkin Mota Autos</h2>
            <p className="text-base md:text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed px-4">
              We curate an exceptional collection of quality vehicles, offering a seamless experience from selection to delivery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-[#0f1419] border border-[#1a1f35] p-6 md:p-10 hover:border-[#d4af37]/30 transition-all duration-300 fade-in-up">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-8 relative">
                <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37]" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl text-white font-light mb-3 md:mb-4">Extended Due Diligence (EDD)</h3>
              <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                We apply extended due diligence on every buyer and transaction to protect both our clients and our reputation.
              </p>
            </div>

            <div className="bg-[#0f1419] border border-[#1a1f35] p-6 md:p-10 hover:border-[#d4af37]/30 transition-all duration-300 fade-in-up delay-1">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-8 relative">
                <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37]" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl text-white font-light mb-3 md:mb-4">We Only List What We've Inspected</h3>
              <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                Every car we promote has been seen, inspected, and photographed by us — no blind reposts, no anonymous stock images.
              </p>
            </div>

            <div className="bg-[#0f1419] border border-[#1a1f35] p-6 md:p-10 hover:border-[#d4af37]/30 transition-all duration-300 fade-in-up delay-2">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-8 relative">
                <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full transform -rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Handshake className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37]" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl text-white font-light mb-3 md:mb-4">Customer‑First Resolution</h3>
              <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                When challenges arise, we prioritise fixing the problem, even if it costs us — because a good name is our most valuable asset.
              </p>
            </div>
          </div>

          {/* Recognitions - Bold Cards */}
          <div className="mt-12 md:mt-24 border-t border-[#1a1f35] pt-8 md:pt-16 fade-in-up">
            <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-6 md:mb-10 uppercase font-light text-center">
              RECOGNITIONS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="border-2 border-[#d4af37]/40 bg-[#0f1419] p-6 md:p-8 hover:border-[#d4af37]/60 transition-all duration-300">
                <div className="text-xs text-[#d4af37] tracking-[0.3em] mb-3 md:mb-4 uppercase font-light">SAFETY & STANDARDS</div>
                <p className="text-base md:text-xl text-white font-light">Honoured by the Federal Road Safety Corps</p>
              </div>
              <div className="border-2 border-[#d4af37]/40 bg-[#0f1419] p-6 md:p-8 hover:border-[#d4af37]/60 transition-all duration-300">
                <div className="text-xs text-[#d4af37] tracking-[0.3em] mb-3 md:mb-4 uppercase font-light">EXCELLENCE</div>
                <p className="text-base md:text-xl text-white font-light">Recipient of an honorary doctorate</p>
              </div>
              <div className="border-2 border-[#d4af37]/40 bg-[#0f1419] p-6 md:p-8 hover:border-[#d4af37]/60 transition-all duration-300">
                <div className="text-xs text-[#d4af37] tracking-[0.3em] mb-3 md:mb-4 uppercase font-light">ROYAL RECOGNITION</div>
                <p className="text-base md:text-xl text-white font-light">
                  Turbaned by the Emir of Daura as <span className="font-medium text-[#d4af37]">Sarkin Motor Jan Kasar Hausa</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 40% Initial Deposit Program - Full Bleed */}
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#0f1419] via-[#1a1f35] to-[#0f1419] border-y border-[#1a1f35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8 md:mb-20 fade-in-up">
            <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-3 md:mb-6 uppercase font-light">ACCESSIBLE LUXURY</div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-8 leading-tight px-4">40% Initial Deposit Program</h2>
            <p className="text-base md:text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed px-4">
              Drive today, pay gradually. Designed for civil servants, salary earners, and business owners who value both assets and cashflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-16">
            <div className="bg-[#0a0e1a] border-2 border-[#1a1f35] p-6 md:p-10 hover:border-[#d4af37]/40 transition-all duration-300 fade-in-up">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-xl md:text-3xl text-white font-light">Civil Servants & Salary Earners</h3>
              </div>
              <ul className="space-y-3 md:space-y-4 text-gray-300 font-light text-sm md:text-lg">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>40% initial deposit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>Simple documentation and proof of income</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>Flexible monthly repayments tailored to your salary schedule</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0a0e1a] border-2 border-[#1a1f35] p-6 md:p-10 hover:border-[#d4af37]/40 transition-all duration-300 fade-in-up delay-1">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-[#d4af37]" />
                </div>
                <h3 className="text-xl md:text-3xl text-white font-light">Business Owners & Investors</h3>
              </div>
              <ul className="space-y-3 md:space-y-4 text-gray-300 font-light text-sm md:text-lg">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>40% initial deposit, keep 60% to reinvest in your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>Basic business documentation and references</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2 md:mr-3 flex-shrink-0">•</span>
                  <span>Structure repayments around your cashflow cycles</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-8 bg-[#0a0e1a] border-2 border-[#d4af37]/30 p-6 md:p-10 fade-in-up delay-2">
            <div>
              <div className="text-xs md:text-sm text-[#d4af37]/70 tracking-[0.3em] uppercase mb-2 md:mb-3 font-light">HOW IT WORKS</div>
              <p className="text-base md:text-xl text-white font-light">
                1. 40% deposit · 2. Simple documents · 3. Drive your car · 4. Pay monthly
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center bg-[#d4af37] text-[#0a0e1a] px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-medium hover:bg-[#e5c158] transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <span>Check if you qualify</span>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mentorship Section - Full Bleed */}
      <section className="py-12 md:py-24 lg:py-32 bg-[#0a0e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
            <div className="fade-in-up">
              <div className="text-[#d4af37]/70 text-xs md:text-sm tracking-[0.3em] mb-4 md:mb-6 uppercase font-light">FOR UPCOMING DEALERS</div>
              <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-8 leading-tight">
                No Mentor? Start Where I Started.
              </h2>
              <p className="text-base md:text-xl text-gray-300 font-light mb-4 md:mb-6 leading-relaxed">
                Sarkin Mota Autos was built without investors or mentors—only hard lessons, relationships, and resilience. 
                Today, we open the door for the next generation of dealers.
              </p>
              <p className="text-sm md:text-lg text-gray-400 font-light mb-6 md:mb-10 leading-relaxed">
                Whether you're just snapping cars on your street or already in the business, you don't have to walk the same road alone.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center bg-[#d4af37] text-[#0a0e1a] px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium hover:bg-[#e5c158] transition-all duration-300"
                >
                  <span>Apply for Mentorship</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/affiliate"
                  className="group inline-flex items-center justify-center border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-light hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <span>Join Dealer Network</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 fade-in-up delay-1">
              <div className="aspect-[4/5] bg-[#1a1f35] bg-[url('/api/placeholder/800/1000')] bg-cover bg-center rounded" />
              <div className="aspect-[4/5] bg-[#1a1f35] bg-[url('/api/placeholder/800/1001')] bg-cover bg-center rounded" />
              <div className="aspect-[4/5] bg-[#1a1f35] bg-[url('/api/placeholder/800/1002')] bg-cover bg-center rounded" />
              <div className="aspect-[4/5] bg-[#1a1f35] bg-[url('/api/placeholder/800/1003')] bg-cover bg-center rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA - Full Bleed */}
      <section className="relative py-16 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-[#0f1419] via-[#1a1f35] to-[#0f1419]">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/90 to-[#0a0e1a]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-7xl text-white font-light mb-4 md:mb-8 leading-tight px-4">
            Ready to Experience Excellence?
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-gray-300 font-light mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Connect with our team to discover your next exceptional vehicle.
          </p>
          <Link 
            href="/contact" 
            className="group inline-flex items-center bg-[#d4af37] text-[#0a0e1a] px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-medium hover:bg-[#e5c158] transition-all duration-300 shadow-lg shadow-[#d4af37]/20"
          >
            <span>Contact Us</span>
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e1a] text-white py-12 md:py-20 border-t border-[#1a1f35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
            <div>
              <div className="mb-6">
                <Image
                  src="/logo%20with%20name.png"
                  alt="Sarkin Mota Autos"
                  width={220}
                  height={80}
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-gray-400 font-light leading-relaxed">
                Nigeria's premier destination for quality automobiles. The first King of Cars.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm tracking-[0.3em] mb-6 uppercase font-light text-[#d4af37]/70">EXPLORE</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/cars" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Collection</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm tracking-[0.3em] mb-6 uppercase font-light text-[#d4af37]/70">CONTACT</h4>
              <ul className="space-y-4 text-gray-400 font-light">
                <li>Lagos, Nigeria</li>
                <li>+234 XXX XXX XXXX</li>
                <li>info@sarkinmotaautos.com</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm tracking-[0.3em] mb-6 uppercase font-light text-[#d4af37]/70">FOLLOW</h4>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#1a1f35] pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 font-light">
              © 2024 Sarkin Mota Autos. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#d4af37] transition-colors font-light">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
