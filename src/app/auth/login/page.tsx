'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { createClientComponentClient } from '@/lib/supabase-client'
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, Shield, Star, Zap } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        // Success - redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Invalid email or password')
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

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navigation />
      
      <div className="min-h-[80vh] flex">
        {/* Left Side - Logo & Content */}
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
              Welcome Back
            </h1>
            
            <p className="text-gray-300 font-light text-lg mb-8 leading-relaxed">
              Access your personalized dashboard, manage your car requests, and stay updated with the latest premium vehicles.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Secure Account</h3>
                  <p className="text-gray-400 text-sm font-light">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Exclusive Access</h3>
                  <p className="text-gray-400 text-sm font-light">Get first access to premium vehicles and special deals</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Fast Service</h3>
                  <p className="text-gray-400 text-sm font-light">Quick responses to your inquiries and requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
              <h1 className="text-3xl md:text-4xl font-light mb-3">Welcome Back</h1>
              <p className="text-gray-400 font-light">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <div className="bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-200 font-medium mb-1">Login Failed</p>
                  <p className="text-red-300 text-sm font-light">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#d4af37] hover:text-[#e5c158] transition-colors font-light"
                >
                  Forgot password?
                </Link>
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-[#1a1f35] text-center">
              <p className="text-sm text-gray-400 font-light">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-[#d4af37] hover:text-[#e5c158] transition-colors font-medium"
                >
                  Sign up
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

