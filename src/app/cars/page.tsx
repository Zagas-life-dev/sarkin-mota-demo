'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { trackPageView, trackSearch } from '@/lib/analytics'
import { getAllCars, formatPrice } from '@/lib/cars'
import { Car } from '@/types/database'
import { 
  Search, 
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')

  useEffect(() => {
    trackPageView('cars')
    
    const fetchCars = async () => {
      try {
        const allCars = await getAllCars()
        setCars(allCars)
        setFilteredCars(allCars)
      } catch (error) {
        console.error('Error fetching cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Filter cars based on search term and filters
  useEffect(() => {
    let filtered = cars

    if (searchTerm) {
      filtered = filtered.filter(car => {
        const searchLower = searchTerm.toLowerCase()
        const priceMatch = car.price.toString().includes(searchTerm.replace(/[^0-9]/g, ''))
        return (
          car.title.toLowerCase().includes(searchLower) ||
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          priceMatch
        )
      })
    }

    if (selectedBrand) {
      filtered = filtered.filter(car => car.brand === selectedBrand)
    }

    if (selectedCategory) {
      filtered = filtered.filter(car => car.category === selectedCategory)
    }

    // Price filtering
    if (minPrice !== '') {
      filtered = filtered.filter(car => car.price >= minPrice)
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(car => car.price <= maxPrice)
    }

    setFilteredCars(filtered)
  }, [cars, searchTerm, selectedBrand, selectedCategory, minPrice, maxPrice])

  const handleSearch = () => {
    trackSearch('cars', { 
      searchTerm, 
      brand: selectedBrand, 
      category: selectedCategory,
      minPrice,
      maxPrice
    })
  }

  // Get unique brands and categories for filters
  const brands = [...new Set(cars.map(car => car.brand))].sort()
  const categories = [...new Set(cars.map(car => car.category))].sort()
  
  // Calculate price range from available cars
  const priceRange = cars.length > 0 ? {
    min: Math.min(...cars.map(car => car.price)),
    max: Math.max(...cars.map(car => car.price))
  } : { min: 0, max: 0 }

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section - Hidden on mobile */}
      <section className="hidden md:flex relative h-[60vh] items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center">
          <div className="absolute inset-0 bg-[#0f1419]/60" />
        </div>
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-tight">
            The Collection
          </h1>
          <p className="text-xl text-gray-300 font-light">
            An exclusive selection of the world's finest automobiles.
          </p>
        </div>
      </section>

      {/* Mobile Header */}
      <section className="md:hidden py-8 px-4 border-b border-border">
        <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
          The Collection
        </h1>
        <p className="text-base text-gray-300 font-light">
          An exclusive selection of the world's finest automobiles.
        </p>
      </section>

      {/* Filters & Results Section */}
      <section className="py-8 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="bg-black/60 border border-border p-4 md:p-6 mb-8 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
              <input 
                type="text" 
                placeholder="Search Model, Brand, Price..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
              />
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
              >
                <option value="" className='text-black'>All Brands</option>
                {brands.map(brand => (
                  <option className='text-black' key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
              >
                <option value="" className='text-black'>All Categories</option>
                {categories.map(category => (
                  <option className='text-black' key={category} value={category}>{category}</option>
                ))}
              </select>
              <input 
                type="number" 
                placeholder={`Min Price (${formatPrice(priceRange.min)})`}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                min={0}
                className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <input 
                type="number" 
                placeholder={`Max Price (${formatPrice(priceRange.max)})`}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                min={minPrice || 0}
                className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button 
                onClick={handleSearch}
                className="bg-white text-black px-8 py-3 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-3" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-white/60">
              Showing {filteredCars.length} of {cars.length} vehicles
            </p>
          </div>

          {/* Car Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-800 mb-4" />
                  <div className="h-6 bg-gray-800 rounded mb-2" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-4 bg-gray-800 rounded w-24" />
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredCars.map((car) => (
                <Link key={car.id} href={`/cars/${car.id}`} className="group">
                  <div className="relative overflow-hidden aspect-video bg-black">
                    {car.images && car.images.length > 0 ? (
                      <div 
                        className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105" 
                        style={{ backgroundImage: `url(${car.images[0]})` }}
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-[url('/api/placeholder/800/600')] bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105" 
                      />
                    )}
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl text-white font-light">{car.title}</h3>
                        <p className="text-white/50 font-light">{car.year}</p>
                      </div>
                      <p className="text-white font-medium">{formatPrice(car.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {searchTerm || selectedBrand || selectedCategory || minPrice !== '' || maxPrice !== ''
                  ? 'No cars match your search criteria.' 
                  : 'No cars available at the moment.'
                }
              </p>
              {(searchTerm || selectedBrand || selectedCategory || minPrice !== '' || maxPrice !== '') && (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedBrand('')
                    setSelectedCategory('')
                    setMinPrice('')
                    setMaxPrice('')
                  }}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 