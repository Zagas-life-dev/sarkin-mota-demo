'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientComponentClient } from '@/lib/supabase-client'
import { 
  LayoutDashboard, 
  Car, 
  Heart, 
  FileText,
  MessageCircle,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/car-request', label: 'Request Car', icon: Plus },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
    { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-[#0f1419] border-r border-[#1a1f35] pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo%20with%20outname.png" 
                alt="Sarkin Mota Autos" 
                width={40} 
                height={40} 
                className="h-10 w-auto"
              />
              <div>
                <div className="text-white font-light text-sm tracking-wider">SARKIN MOTA</div>
                <div className="text-xs text-gray-400 font-light">My Dashboard</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard') && pathname === '/dashboard')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#d4af37] text-[#0a0e1a]'
                      : 'text-gray-300 hover:bg-[#1a1f35] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-light">{item.label}</span>
                </Link>
              )
            })}
            <Link
              href="/cars"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a1f35] hover:text-white transition-colors"
            >
              <Car className="w-5 h-5" />
              <span className="font-light">Browse Cars</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="px-4 pb-4 border-t border-[#1a1f35] pt-4">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-3">
                <div className="w-8 h-8 bg-[#1a1f35] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-light truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a1f35] hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-light">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#0f1419] border-b border-[#1a1f35] sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/logo%20with%20outname.png" 
                alt="Sarkin Mota Autos" 
                width={32} 
                height={32} 
                className="h-8 w-auto"
              />
              <div className="text-white font-light text-sm tracking-wider">SARKIN MOTA</div>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1419] border-r border-[#1a1f35] overflow-y-auto lg:hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[#1a1f35]">
                    <div className="flex items-center gap-3">
                      <Image 
                        src="/logo%20with%20outname.png" 
                        alt="Sarkin Mota Autos" 
                        width={32} 
                        height={32} 
                        className="h-8 w-auto"
                      />
                      <div className="text-white font-light text-sm tracking-wider">SARKIN MOTA</div>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 text-gray-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="flex-1 px-4 py-4 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard') && pathname === '/dashboard')
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-[#d4af37] text-[#0a0e1a]'
                              : 'text-gray-300 hover:bg-[#1a1f35] hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-light">{item.label}</span>
                        </Link>
                      )
                    })}
                    <Link
                      href="/cars"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a1f35] hover:text-white transition-colors"
                    >
                      <Car className="w-5 h-5" />
                      <span className="font-light">Browse Cars</span>
                    </Link>
                  </nav>

                  <div className="px-4 pb-4 border-t border-[#1a1f35] pt-4">
                    {user && (
                      <div className="flex items-center gap-3 px-4 py-3 mb-3">
                        <div className="w-8 h-8 bg-[#1a1f35] rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-light truncate">{user.email}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut()
                        setSidebarOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-[#1a1f35] hover:text-white transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-light">Sign Out</span>
                    </button>
                  </div>
                </div>
              </aside>
            </>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f1419] border-t border-[#1a1f35] z-50">
          <div className="flex items-center justify-around h-16">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard') && pathname === '/dashboard')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isActive
                      ? 'text-[#d4af37]'
                      : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-light">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom padding for mobile nav */}
        <div className="lg:hidden h-16" />
      </div>
    </div>
  )
}

