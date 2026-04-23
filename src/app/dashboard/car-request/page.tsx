'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ImageUpload from '@/components/ImageUpload'
import { createClientComponentClient } from '@/lib/supabase-client'
import { 
  ArrowLeft, 
  Send, 
  Loader2,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function CarRequestPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [exteriorImages, setExteriorImages] = useState<string[]>([])
  const [interiorImages, setInteriorImages] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    seller_name: '',
    seller_phone: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    condition: 'Foreign Used',
    location: '',
    description: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleExteriorImagesUpload = (urls: string[]) => {
    setExteriorImages(urls)
  }

  const handleInteriorImagesUpload = (urls: string[]) => {
    setInteriorImages(urls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to submit a car request')
      }

      // Prepare car request data
      const requestData = {
        user_id: user.id,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        condition: formData.condition,
        location: formData.location,
        description: formData.description || undefined,
        exterior_image1: exteriorImages[0] || undefined,
        exterior_image2: exteriorImages[1] || undefined,
        interior_image1: interiorImages[0] || undefined,
        interior_image2: interiorImages[1] || undefined,
        status: 'pending',
      }

      // Insert into database
      const { error: insertError } = await supabase
        .from('car_requests')
        .insert(requestData)

      if (insertError) {
        throw insertError
      }

      // Success
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error('Error submitting car request:', err)
      setError(err.message || 'Failed to submit car request')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <CheckCircle className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
          <h1 className="text-4xl font-light mb-4">Request Submitted!</h1>
          <p className="text-gray-400 text-lg mb-8">
            Your car listing request has been submitted successfully. Our team will review it and get back to you soon.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#d4af37] hover:text-[#e5c158] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-[#d4af37] hover:text-[#e5c158] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-light mb-2">Submit Car for Sale</h1>
          <p className="text-gray-400">Fill out the form below to submit your car for listing</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seller Information */}
          <section className="bg-[#0f1419] border border-[#1a1f35] p-8 rounded-lg">
            <h2 className="text-2xl font-light mb-6 text-[#d4af37]">Seller Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="seller_name"
                  value={formData.seller_name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="seller_phone"
                  value={formData.seller_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="+2348053682130"
                />
              </div>
            </div>
          </section>

          {/* Car Information */}
          <section className="bg-[#0f1419] border border-[#1a1f35] p-8 rounded-lg">
            <h2 className="text-2xl font-light mb-6 text-[#d4af37]">Car Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="Mercedes-Benz"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="S-Class AMG"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="2017"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Price (₦) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="61000000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Used">Used</option>
                  <option value="Foreign Used">Foreign Used</option>
                  <option value="Nigerian Used">Nigerian Used</option>
                  <option value="Certified">Certified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                  placeholder="Abuja, Nigeria"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none resize-none"
                placeholder="Describe your car..."
              />
            </div>
          </section>

          {/* Images */}
          <section className="bg-[#0f1419] border border-[#1a1f35] p-8 rounded-lg">
            <h2 className="text-2xl font-light mb-6 text-[#d4af37]">Car Images</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Exterior Images (2 required)</label>
                <ImageUpload
                  onUploadComplete={handleExteriorImagesUpload}
                  onUploadError={(err) => setError(err)}
                  maxFiles={2}
                  accept="image/*"
                  folder="sarkin-mota-autos/car-requests/exterior"
                  label="Upload Exterior Images"
                />
                {exteriorImages.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {exteriorImages.length} exterior image(s) uploaded
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Interior Images (2 required)</label>
                <ImageUpload
                  onUploadComplete={handleInteriorImagesUpload}
                  onUploadError={(err) => setError(err)}
                  maxFiles={2}
                  accept="image/*"
                  folder="sarkin-mota-autos/car-requests/interior"
                  label="Upload Interior Images"
                />
                {interiorImages.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {interiorImages.length} interior image(s) uploaded
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || exteriorImages.length < 2 || interiorImages.length < 2}
              className="px-8 py-3 bg-[#d4af37] text-[#0a0e1a] hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}





