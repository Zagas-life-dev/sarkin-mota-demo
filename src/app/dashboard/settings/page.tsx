'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { createClientComponentClient } from '@/lib/supabase-client'
import { 
  ArrowLeft,
  User, 
  Mail, 
  Lock, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      setEmail(authUser.email || '')
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (profile) {
        setUserProfile(profile)
        setName(profile.name || authUser.user_metadata?.name || '')
      } else {
        // If no profile exists, use metadata
        setName(authUser.user_metadata?.name || '')
      }
      
      setCheckingAuth(false)
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8
    const hasUpper = /[A-Z]/.test(pwd)
    const hasLower = /[a-z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    return minLength && hasUpper && hasLower && hasNumber
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: name,
        },
      })

      if (updateError) throw updateError

      // Update or insert user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          name: name,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        })

      if (profileError) throw profileError

      setSuccess('Profile updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setSaving(false)
      return
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and a number')
      setSaving(false)
      return
    }

    try {
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Password update error:', err)
      setError(err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
            <p className="text-gray-400 font-light">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors mb-6 font-light"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-light mb-3">Account Settings</h1>
          <p className="text-gray-400 font-light text-lg">
            Manage your account information and security
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3 fade-in-up">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-200 font-light">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 fade-in-up">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 font-light">{error}</p>
          </div>
        )}

        {/* Profile Settings */}
        <section className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 rounded-lg mb-8 fade-in-up delay-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#d4af37]/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h2 className="text-2xl font-light text-[#d4af37]">Profile Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-400 mb-2 font-light">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0a0e1a] border border-[#1a1f35] px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                placeholder="Enter your full name"
                disabled={saving}
              />
            </div>

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
                  disabled
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-4 py-3 text-gray-500 cursor-not-allowed font-light"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 font-light">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto bg-[#d4af37] text-[#0a0e1a] px-6 py-3 text-base font-medium hover:bg-[#e5c158] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Password Settings */}
        <section className="bg-[#0f1419] border-2 border-[#1a1f35] p-8 rounded-lg fade-in-up delay-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-light text-[#d4af37]">Change Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm text-gray-400 mb-2 font-light">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-[#0a0e1a] border border-[#1a1f35] pl-12 pr-12 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors font-light"
                  placeholder="Enter new password"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-light">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-400 mb-2 font-light">
                Confirm New Password
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
                  placeholder="Confirm new password"
                  disabled={saving}
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

            <button
              type="submit"
              disabled={saving || !newPassword || !confirmPassword}
              className="w-full md:w-auto bg-[#d4af37] text-[#0a0e1a] px-6 py-3 text-base font-medium hover:bg-[#e5c158] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Account Info */}
        <section className="mt-8 bg-[#0f1419] border-2 border-[#1a1f35] p-8 rounded-lg fade-in-up delay-3">
          <h2 className="text-2xl font-light text-[#d4af37] mb-6">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 font-light mb-1">Account Type</p>
              <p className="text-white font-light capitalize">
                {userProfile?.role || 'user'}
              </p>
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
            {userProfile?.affiliate_code && (
              <div>
                <p className="text-sm text-gray-500 font-light mb-1">Affiliate Code</p>
                <p className="text-white font-light font-mono">{userProfile.affiliate_code}</p>
              </div>
            )}
            {userProfile?.affiliate_status && (
              <div>
                <p className="text-sm text-gray-500 font-light mb-1">Affiliate Status</p>
                <p className="text-white font-light capitalize">{userProfile.affiliate_status}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}




