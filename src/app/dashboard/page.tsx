'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { createClientComponentClient } from '@/lib/supabase-client'
import { CarRequest } from '@/types/database'
import { 
  User, 
  Car, 
  Heart, 
  FileText, 
  Plus, 
  Loader2,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Settings,
  MessageCircle
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [carRequests, setCarRequests] = useState<CarRequest[]>([])
  const [favorites, setFavorites] = useState<Array<{ id: string }>>([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      setCheckingAuth(false)
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      setUserProfile(profile)
      
      // Fetch car requests
      const { data: requests } = await supabase
        .from('car_requests')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (requests) {
        setCarRequests(requests)
      }
      
      // Fetch favorites count
      const { data: favs } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', authUser.id)
      
      if (favs) {
        setFavorites(favs)
      }
      
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (checkingAuth || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
            <p className="text-gray-400 font-light">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-light mb-3">
            Welcome back{userProfile?.name ? `, ${userProfile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-400 font-light text-lg">
            Manage your account, car requests, and favorites
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in-up delay-1">
          <div className="bg-[#0f1419] border-2 border-[#1a1f35] p-6 hover:border-[#d4af37]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-light mb-1">{carRequests.length}</h3>
            <p className="text-gray-400 font-light text-sm">Car Requests</p>
          </div>

          <div className="bg-[#0f1419] border-2 border-[#1a1f35] p-6 hover:border-[#d4af37]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h3 className="text-3xl font-light mb-1">{favorites.length}</h3>
            <p className="text-gray-400 font-light text-sm">Saved Favorites</p>
          </div>

          <div className="bg-[#0f1419] border-2 border-[#1a1f35] p-6 hover:border-[#d4af37]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-[#d4af37]" />
              </div>
            </div>
            <h3 className="text-3xl font-light mb-1">Member</h3>
            <p className="text-gray-400 font-light text-sm">Account Status</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in-up delay-2">
          <Link
            href="/dashboard/car-request"
            className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 hover:border-[#d4af37]/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#d4af37]/20 rounded-lg flex items-center justify-center group-hover:bg-[#d4af37]/30 transition-colors">
                <Plus className="w-6 h-6 text-[#d4af37]" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37] transition-colors" />
            </div>
            <h3 className="text-2xl font-light text-white mb-2">Request a Car</h3>
            <p className="text-gray-400 font-light">Submit a car listing request for review</p>
          </Link>

          <Link
            href="/dashboard/messages"
            className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 hover:border-[#d4af37]/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
            </div>
            <h3 className="text-2xl font-light text-white mb-2">Messages</h3>
            <p className="text-gray-400 font-light">View and respond to your conversations</p>
          </Link>

          <Link
            href="/cars"
            className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 hover:border-[#d4af37]/40 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Car className="w-6 h-6 text-blue-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-2xl font-light text-white mb-2">Browse Cars</h3>
            <p className="text-gray-400 font-light">Explore our premium vehicle collection</p>
          </Link>
        </div>

        {/* Recent Car Requests */}
        <section className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 rounded-lg mb-12 fade-in-up delay-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-[#d4af37]">Recent Car Requests</h2>
            {carRequests.length > 0 && (
              <Link
                href="/dashboard/car-requests"
                className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors font-light flex items-center gap-1"
              >
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {carRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 font-light mb-4">No car requests yet</p>
              <Link
                href="/dashboard/car-request"
                className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#e5c158] transition-colors font-light"
              >
                <Plus className="w-4 h-4" />
                Submit your first request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {carRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#0a0e1a] border border-[#1a1f35] p-6 hover:border-[#d4af37]/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(request.status)}
                        <h3 className="text-lg font-medium text-white">
                          {request.brand} {request.model} ({request.year})
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-light border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 font-light">
                        <div>
                          <span className="text-gray-500">Price:</span>{' '}
                          <span className="text-white">{formatPrice(request.price)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition:</span>{' '}
                          <span className="text-white">{request.condition}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>{' '}
                          <span className="text-white">{request.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>{' '}
                          <span className="text-white">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/car-requests/${request.id}`}
                      className="ml-4 p-2 text-gray-400 hover:text-[#d4af37] transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Account Info */}
        <section className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 rounded-lg fade-in-up delay-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-[#d4af37]">Account Information</h2>
            <Link
              href="/dashboard/settings"
              className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors font-light flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Full Name</p>
              <p className="text-white font-light">
                {userProfile?.name || user?.user_metadata?.name || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Email Address</p>
              <p className="text-white font-light">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Member Since</p>
              <p className="text-white font-light">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Account Type</p>
              <p className="text-white font-light capitalize">
                {userProfile?.role || 'user'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}


