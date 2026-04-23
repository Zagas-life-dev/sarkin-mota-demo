'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, User, CheckCircle, Check, TrendingUp, Heart, Gift } from 'lucide-react'
import Image from 'next/image'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      } else {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const validatePassword = (pwd: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = pwd.length >= 8
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    return minLength && hasUpper && hasLower && hasNumber
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and a number')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        setSuccess(true)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
            <p className="text-gray-400 font-light">Checking authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 py-24">
          <div className="w-full max-w-md text-center fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-4">Account Created!</h1>
            <p className="text-gray-400 font-light text-lg mb-6">
              Your account has been created successfully. Redirecting to dashboard...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-[#d4af37] mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navigation />
      
      <div className="min-h-[80vh] flex">
        {/* Left Side - Logo & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f1419] to-[#1a1f35] items-center justify-center p-12 xl:p-16">
          <div className="max-w-md fade-in-up">
            <div className="mb-8">
              <Image
                src="/logo with name.png"
                alt="Sarkin Mota Autos"
                width={250}
                height={100}
                className="h-auto"
                priority
              />
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-light mb-6 leading-tight">
              Join Sarkin Mota Autos
            </h1>
            
            <p className="text-gray-300 font-light text-lg mb-8 leading-relaxed">
              Become part of Nigeria's premier automotive community. Get exclusive access to premium vehicles and exceptional service.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">40% Deposit Program</h3>
                  <p className="text-gray-400 text-sm font-light">Drive your dream car with just 40% initial deposit. Flexible payment plans available.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Premium Selection</h3>
                  <p className="text-gray-400 text-sm font-light">Access to verified, inspected vehicles from trusted dealers nationwide.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Personalized Service</h3>
                  <p className="text-gray-400 text-sm font-light">Dedicated support from our award-winning team, led by Dr. Aliyu Muhammad.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Exclusive Benefits</h3>
                  <p className="text-gray-400 text-sm font-light">Early access to new listings, special promotions, and priority customer service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
          <div className="w-full max-w-md fade-in-up">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/logo with name.png"
                alt="Sarkin Mota Autos"
                width={200}
                height={80}
                className="h-auto mx-auto"
                priority
              />
            </div>

            <div className="mb-8 lg:mb-12">
              <h1 className="text-3xl md:text-4xl font-light mb-3">Create Account</h1>
              <p className="text-gray-400 font-light">Join Sarkin Mota Autos</p>
            </div>

            {/* Sign Up Form */}
            <div className="bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-200 font-medium mb-1">Sign Up Failed</p>
                  <p className="text-red-300 text-sm font-light">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-400 mb-2 font-light">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-400 mb-2 font-light">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm text-gray-400 mb-2 font-light">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-12 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 font-light">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-400 mb-2 font-light">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-12 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] text-[#0a0e1a] px-6 py-4 text-base font-medium hover:bg-[#e5c158] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-[#1a1f35] text-center">
              <p className="text-sm text-gray-400 font-light">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#d4af37] hover:text-[#e5c158] transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

