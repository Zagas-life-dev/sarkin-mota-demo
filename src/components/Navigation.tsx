'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogIn, LogOut, Bell, MessageCircle } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getUnreadMessageCount, getRecentUnreadMessages } from '@/lib/messaging'
import { Message } from '@/types/database'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Array<Message & { conversation_id: string; conversation_subject: string }>>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [newNotification, setNewNotification] = useState<Message & { conversation_id: string; conversation_subject: string } | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const notificationRef = useRef<HTMLDivElement>(null)
  const bellButtonRef = useRef<HTMLButtonElement>(null)
  const previousNotificationIdsRef = useRef<Set<string>>(new Set())

  // Check auth status on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
      
      if (user) {
        loadNotifications(user.id, true) // Initial load
      }
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          loadNotifications(session.user.id, true) // Initial load
        } else {
          setUnreadCount(0)
          setNotifications([])
        }
      }
    )

    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    // Close notifications when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      // Close popup when clicking outside (but not on the popup itself)
      const target = event.target as HTMLElement
      if (showPopup && !target.closest('.notification-popup')) {
        setShowPopup(false)
        setTimeout(() => setNewNotification(null), 300)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Poll for new notifications every 10 seconds if user is logged in
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      loadNotifications(user.id, false) // Not initial load, so check for new notifications
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  // Play ding sound
  const playDingSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800 // Higher pitch for ding
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  // Shake animation
  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500) // Animation duration
  }

  // Show popup notification
  const showNotificationPopup = (notification: Message & { conversation_id: string; conversation_subject: string }) => {
    setNewNotification(notification)
    setShowPopup(true)
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowPopup(false)
      setTimeout(() => setNewNotification(null), 300) // Wait for fade out
    }, 5000)
  }

  const loadNotifications = async (userId: string, isInitialLoad: boolean = false) => {
    try {
      const count = await getUnreadMessageCount(userId)
      const recent = await getRecentUnreadMessages(userId, 5)
      
      // Detect new notifications (only if not initial load)
      if (!isInitialLoad) {
        const currentIds = new Set(recent.map(n => n.id))
        const previousIds = previousNotificationIdsRef.current
        
        // Find new notifications (messages that weren't in the previous list)
        const newNotifications = recent.filter(n => !previousIds.has(n.id))
        
        // If there are new notifications and we have previous notifications to compare
        if (newNotifications.length > 0 && previousIds.size > 0) {
          // Play sound
          playDingSound()
          
          // Shake bell
          triggerShake()
          
          // Show popup for the most recent new notification
          if (newNotifications[0]) {
            showNotificationPopup(newNotifications[0])
          }
        }
        
        // Update previous IDs
        previousNotificationIdsRef.current = currentIds
      } else {
        // On initial load, just store the IDs without triggering effects
        previousNotificationIdsRef.current = new Set(recent.map(n => n.id))
      }
      
      setUnreadCount(count)
      setNotifications(recent)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const handleNotificationClick = (conversationId: string) => {
    setShowNotifications(false)
    setShowPopup(false)
    router.push(`/dashboard/messages?conversationId=${conversationId}`)
  }

  const handlePopupClick = () => {
    if (newNotification) {
      handleNotificationClick(newNotification.conversation_id)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0e1a]/80 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo%20with%20outname.png" alt="Sarkin Mota Autos" width={96} height={96} className="h-10 sm:h-12 w-auto" />
            <div className="hidden xs:block text-xl sm:text-2xl md:text-3xl text-white font-light tracking-wider ml-3 sm:ml-4">
              SARKIN MOTA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/cars" 
              className={`text-sm tracking-wider transition-colors ${
                isActive('/cars') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              COLLECTION
            </Link>
            <Link 
              href="/about" 
              className={`text-sm tracking-wider transition-colors ${
                isActive('/about') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ABOUT
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm tracking-wider transition-colors ${
                isActive('/contact') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              CONTACT
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                      <button
                        ref={bellButtonRef}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 text-white/70 hover:text-white transition-colors ${
                          isShaking ? 'animate-shake' : ''
                        }`}
                      >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </button>
                      
                      {/* Notification Popup */}
                      {showPopup && newNotification && (
                        <div 
                          onClick={handlePopupClick}
                          className="notification-popup fixed top-20 right-4 md:right-8 w-80 bg-[#0f1419] border-2 border-[#d4af37] rounded-lg shadow-2xl z-[100] cursor-pointer animate-slide-in-right"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-5 h-5 text-[#d4af37]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium mb-1">
                                  New Message
                                </p>
                                <p className="text-[#d4af37] text-xs font-medium truncate mb-2">
                                  {newNotification.conversation_subject}
                                </p>
                                <p className="text-gray-400 text-xs line-clamp-2">
                                  {newNotification.message_text}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                  Click to view
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowPopup(false)
                                  setTimeout(() => setNewNotification(null), 300)
                                }}
                                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Notifications Dropdown */}
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                          <div className="p-4 border-b border-[#1a1f35]">
                            <h3 className="text-white font-medium text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <p className="text-gray-400 text-xs mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                            )}
                          </div>
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm font-light">No new messages</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-[#1a1f35]">
                              {notifications.map((notification) => (
                                <button
                                  key={notification.id}
                                  onClick={() => handleNotificationClick(notification.conversation_id)}
                                  className="w-full p-4 text-left hover:bg-[#0a0e1a] transition-colors"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-[#d4af37] rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-medium truncate">
                                        {notification.conversation_subject}
                                      </p>
                                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                        {notification.message_text}
                                      </p>
                                      <p className="text-gray-500 text-xs mt-2">
                                        {new Date(notification.created_at).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {notifications.length > 0 && (
                            <div className="p-3 border-t border-[#1a1f35]">
                              <Link
                                href="/dashboard/messages"
                                onClick={() => setShowNotifications(false)}
                                className="block text-center text-[#d4af37] text-sm hover:text-[#e5c158] transition-colors"
                              >
                                View all messages
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      href="/dashboard" 
                      className="text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <Link 
                      href="/auth/login" 
                      className="text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                    >
                      SIGN IN
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="text-sm tracking-wider bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300"
                    >
                      REGISTER
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link 
              href="/cars" 
              className={`block py-3 text-sm tracking-wider transition-colors ${
                isActive('/cars') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              COLLECTION
            </Link>
            <Link 
              href="/about" 
              className={`block py-3 text-sm tracking-wider transition-colors ${
                isActive('/about') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              href="/contact" 
              className={`block py-3 text-sm tracking-wider transition-colors ${
                isActive('/contact') 
                  ? 'text-white' 
                  : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
            
            {/* Mobile Auth */}
            {!loading && (
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-4">
                    {/* Mobile Notification Bell */}
                    <div className="flex items-center justify-between py-3">
                      <Link 
                        href="/dashboard/messages" 
                        className="flex items-center gap-2 text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Bell className="w-4 h-4" />
                        <span>Messages</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="block py-3 text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left py-3 text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                    >
                      SIGN OUT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      href="/auth/login" 
                      className="block py-3 text-sm tracking-wider text-white/70 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      SIGN IN
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block py-3 text-sm tracking-wider text-white text-center bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REGISTER
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 