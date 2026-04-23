'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { createClientComponentClient } from '@/lib/supabase-client'
import { getConversations, getMessages, createMessage, markMessagesAsRead, getUnreadCountForConversation } from '@/lib/messaging'
import { Conversation, Message, Car } from '@/types/database'
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  ArrowLeft,
  Car as CarIcon,
  User,
  Clock,
  CheckCircle
} from 'lucide-react'
import { formatPrice } from '@/lib/cars'

function MessagesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [carDetails, setCarDetails] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }
      setUser(authUser)
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      setUserProfile(profile)
      setLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  useEffect(() => {
    if (user) {
      loadConversations()
      
      // Poll for new conversations every 10 seconds
      const interval = setInterval(loadConversations, 10000)
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    // Check if there's a conversationId in URL params
    const conversationId = searchParams.get('conversationId')
    if (conversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === conversationId)
      if (conv) {
        setSelectedConversation(conv)
      }
    }
  }, [searchParams, conversations])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      if (selectedConversation.car_id) {
        loadCarDetails(selectedConversation.car_id)
      }
      markMessagesAsRead(selectedConversation.id)
      
      // Update unread count after marking as read
      if (user) {
        getUnreadCountForConversation(selectedConversation.id, user.id).then(count => {
          setUnreadCounts(prev => ({ ...prev, [selectedConversation.id]: count }))
        })
      }
      
      // Update URL without navigation
      const url = new URL(window.location.href)
      url.searchParams.set('conversationId', selectedConversation.id)
      window.history.pushState({}, '', url.toString())
      
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => {
        loadMessages(selectedConversation.id)
        if (user) {
          getUnreadCountForConversation(selectedConversation.id, user.id).then(count => {
            setUnreadCounts(prev => ({ ...prev, [selectedConversation.id]: count }))
          })
        }
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [selectedConversation, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    if (!user) return
    try {
      const data = await getConversations(user.id)
      setConversations(data)
      
      // Load unread counts for each conversation
      const counts: Record<string, number> = {}
      for (const conv of data) {
        counts[conv.id] = await getUnreadCountForConversation(conv.id, user.id)
      }
      setUnreadCounts(counts)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const loadCarDetails = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single()
      
      if (!error && data) {
        setCarDetails(data)
      }
    } catch (error) {
      console.error('Error loading car details:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !user || sending) return

    setSending(true)
    try {
      const sentMessage = await createMessage(
        selectedConversation.id,
        user.id,
        userProfile?.name || user.email?.split('@')[0] || 'User',
        user.email || null,
        messageText,
        false
      )

      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage])
        setMessageText('')
        // Refresh conversations to update last_message_at
        loadConversations()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getUnreadCount = async (conversationId: string) => {
    if (!user) return 0
    try {
      const { data } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .eq('is_read', false)
        .eq('is_admin', true)
      
      return data?.length || 0
    } catch (error) {
      return 0
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
            <p className="text-gray-400 font-light">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-8 fade-in-up">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-light mb-3">Messages</h1>
          <p className="text-gray-400 font-light text-lg">
            View and respond to your conversations
          </p>
        </div>

        <div className="bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-[#1a1f35] overflow-y-auto">
              <div className="p-4 border-b border-[#1a1f35]">
                <h2 className="text-xl font-light text-white">Conversations</h2>
              </div>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-light">No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1a1f35]">
                  {conversations.map((conv) => {
                    const unreadCount = unreadCounts[conv.id] || 0
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full p-4 text-left hover:bg-[#0a0e1a] transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-[#0a0e1a] border-l-4 border-[#d4af37]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-medium text-sm truncate flex-1">
                            {conv.subject}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {unreadCount > 0 && (
                              <span className="bg-yellow-400 text-[#0a0e1a] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                            {conv.status === 'open' && unreadCount === 0 && (
                              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(conv.last_message_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            conv.status === 'open' 
                              ? 'bg-green-500/20 text-green-400' 
                              : conv.status === 'closed'
                              ? 'bg-gray-500/20 text-gray-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {conv.status}
                          </span>
                          {conv.car_id && (
                            <CarIcon className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Messages View */}
            <div className="flex-1 flex flex-col hidden md:flex">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-[#1a1f35] bg-[#0a0e1a]">
                    <h3 className="text-white font-medium">{selectedConversation.subject}</h3>
                    {carDetails && (
                      <div className="flex items-center gap-3 mt-3 p-3 bg-[#0f1419] rounded border border-[#1a1f35]">
                        <CarIcon className="w-5 h-5 text-[#d4af37]" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{carDetails.title}</p>
                          <p className="text-gray-400 text-xs">{formatPrice(carDetails.price)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 py-10">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="font-light">No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.is_admin
                                ? 'bg-[#1a1f35] text-white'
                                : 'bg-[#d4af37] text-[#0a0e1a]'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {msg.is_admin ? (
                                <span className="text-xs font-medium">Admin</span>
                              ) : (
                                <>
                                  <User className="w-3 h-3" />
                                  <span className="text-xs font-medium">{msg.sender_name}</span>
                                </>
                              )}
                            </div>
                            <p className="text-sm mb-1">{msg.message_text}</p>
                            <p className="text-xs opacity-70 text-right">
                              {new Date(msg.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-[#1a1f35] bg-[#0a0e1a]">
                    <div className="flex items-center gap-2">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 bg-[#0f1419] border border-[#1a1f35] px-4 py-2 text-white rounded focus:border-[#d4af37] focus:outline-none resize-none"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="bg-[#d4af37] text-[#0a0e1a] p-3 rounded hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="font-light">Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto mb-4" />
              <p className="text-gray-400 font-light">Loading messages...</p>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <MessagesPageContent />
    </Suspense>
  )
}

