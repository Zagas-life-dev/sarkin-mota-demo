'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { trackPageView } from '@/lib/analytics'
import { 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Loader2
} from 'lucide-react'
import ContactMessaging from '@/components/ContactMessaging'

type ContactMode = 'email' | 'whatsapp' | 'message'

export default function ContactPage() {
  const [activeMode, setActiveMode] = useState<ContactMode>('email')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    trackPageView('contact')
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.message) {
      setError('Please provide a message')
      return
    }

    try {
      // Get WhatsApp number from environment or use default
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2340000000000'
      
      // Format the message
      let whatsappMessage = formData.message
      
      if (formData.name) {
        whatsappMessage = `Hello, my name is ${formData.name}.\n\n${whatsappMessage}`
      }
      
      if (formData.email) {
        whatsappMessage += `\n\nEmail: ${formData.email}`
      }
      
      if (formData.phone) {
        whatsappMessage += `\n\nPhone: ${formData.phone}`
      }
      
      // Create WhatsApp URL - always use the configured WhatsApp number
      const phoneNumber = whatsappNumber.replace(/[^0-9]/g, '')
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank')
      
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 font-light">
            We are here to assist with any inquiries you may have.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-4xl text-white font-light mb-8">Get in Touch</h2>
              
              {/* Mode Selector */}
              <div className="flex gap-4 mb-8 border-b border-border">
                <button
                  onClick={() => {
                    setActiveMode('email')
                    setError(null)
                    setIsSuccess(false)
                  }}
                  className={`pb-4 px-2 transition-colors ${
                    activeMode === 'email'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span className="font-light">Email</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveMode('whatsapp')
                    setError(null)
                    setIsSuccess(false)
                  }}
                  className={`pb-4 px-2 transition-colors ${
                    activeMode === 'whatsapp'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-light">WhatsApp</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveMode('message')
                    setError(null)
                    setIsSuccess(false)
                  }}
                  className={`pb-4 px-2 transition-colors ${
                    activeMode === 'message'
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    <span className="font-light">Message</span>
                  </div>
                </button>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {isSuccess && (
                <div className="mb-6 bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded">
                  <p className="text-sm">
                    {activeMode === 'email' && 'Thank you for your message. We will be in touch shortly.'}
                    {activeMode === 'whatsapp' && 'Opening WhatsApp...'}
                    {activeMode === 'message' && 'Message sent successfully!'}
                  </p>
                </div>
              )}

              {/* Email Form */}
              {activeMode === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                      className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number (Optional)"
                    className="w-full bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center bg-white text-black px-12 py-5 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        <span className="text-lg">Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">Send Email</span>
                        <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* WhatsApp Form */}
              {activeMode === 'whatsapp' && (
                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded mb-6">
                    <p className="text-sm text-blue-300">
                      Write your message below and we'll open WhatsApp with your message pre-filled. You can then send it directly.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name (Optional)"
                      className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your WhatsApp Number (Optional)"
                      className="bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address (Optional)"
                    className="w-full bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message (This will be pre-filled in WhatsApp)"
                    rows={5}
                    className="w-full bg-transparent border-b border-border focus:border-white transition-colors py-3 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="group inline-flex items-center bg-green-600 text-white px-12 py-5 hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <span className="text-lg">Open WhatsApp</span>
                    <ChevronRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              {/* In-Platform Messaging */}
              {activeMode === 'message' && (
                <div>
                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded mb-6">
                    <p className="text-sm text-purple-300">
                      Chat with us directly on the platform. We'll respond as soon as possible.
                    </p>
                  </div>
                  <ContactMessaging />
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <h2 className="text-4xl text-white font-light mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-white/50 mr-6 mt-1" />
                  <div>
                    <h3 className="text-xl text-white font-light">Location</h3>
                    <p className="text-white/70 font-light">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-white/50 mr-6 mt-1" />
                  <div>
                    <h3 className="text-xl text-white font-light">Email</h3>
                    <a href="mailto:info@sarkinmotaautos.com" className="text-white/70 font-light hover:text-white transition-colors">info@sarkinmotaautos.com</a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-white/50 mr-6 mt-1" />
                  <div>
                    <h3 className="text-xl text-white font-light">Phone</h3>
                    <a href="tel:+2340000000000" className="text-white/70 font-light hover:text-white transition-colors">+234 XXX XXX XXXX</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
