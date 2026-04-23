'use client'

import { useState } from 'react'
import { X, Send, Loader2, CheckCircle } from 'lucide-react'
import { Car } from '@/types/database'
import { formatPrice } from '@/lib/cars'

interface CarContactFormProps {
  car: Car
  isOpen: boolean
  onClose: () => void
}

export default function CarContactForm({ car, isOpen, onClose }: CarContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/cars/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carId: car.id,
          carDetails: {
            title: car.title,
            brand: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            image: car.images && car.images.length > 0 ? car.images[0] : car.thumbnail_url,
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', phone: '', message: '' })
      setError(null)
      setIsSuccess(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1419] border-b border-[#1a1f35] p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl text-white font-light mb-1">Contact About This Car</h2>
            <p className="text-gray-400 text-sm font-light">{car.title}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Car Info Preview */}
        <div className="p-6 border-b border-[#1a1f35] bg-[#0a0e1a]">
          <div className="flex gap-4">
            {car.images && car.images.length > 0 && (
              <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-[#1a1f35] flex items-center justify-center">
                <img 
                  src={car.images[0]} 
                  alt={car.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg text-white font-light mb-1">{car.title}</h3>
              <p className="text-gray-400 text-sm font-light mb-2">
                {car.brand} {car.model} • {car.year}
              </p>
              <p className="text-xl text-[#d4af37] font-light">{formatPrice(car.price)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">Message sent successfully! We'll get back to you soon.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-400 mb-2 font-light">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#0a0e1a] border border-[#1a1f35] text-white px-4 py-3 focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 font-light"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2 font-light">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full bg-[#0a0e1a] border border-[#1a1f35] text-white px-4 py-3 focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 font-light"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm text-gray-400 mb-2 font-light">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full bg-[#0a0e1a] border border-[#1a1f35] text-white px-4 py-3 focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 font-light"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-2 font-light">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows={5}
              className="w-full bg-[#0a0e1a] border border-[#1a1f35] text-white px-4 py-3 focus:border-[#d4af37] focus:outline-none transition-colors disabled:opacity-50 resize-none font-light"
              placeholder="I'm interested in this vehicle. Please contact me with more information..."
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#d4af37] text-[#0a0e1a] px-6 py-3 font-medium hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-[#1a1f35] text-white hover:bg-white/10 transition-colors disabled:opacity-50 font-light"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center font-light">
            Car details (image, name, price, brand, model, year) will be automatically included in your message.
          </p>
        </form>
      </div>
    </div>
  )
}


