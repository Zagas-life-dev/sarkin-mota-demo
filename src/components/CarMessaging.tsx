'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, Send, Loader2, MessageCircle, LogIn, UserPlus } from 'lucide-react'
import { Car } from '@/types/database'
import { createClientComponentClient } from '@/lib/supabase-client'
import { formatPrice } from '@/lib/cars'
import { decryptMessage, encryptMessage } from '@/lib/encryption'
import Link from 'next/link'

interface CarMessagingProps {
  car: Car
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_name: string
  sender_email: string | null
  message_text: string
  is_read: boolean
  is_admin: boolean
  created_at: string
}

export default function CarMessaging({ car, isOpen, onClose }: CarMessagingProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      checkUser()
      setError(null)
      setShowSignInPrompt(false)
    } else {
      // Clean up when modal closes (but keep conversationId for next time)
      setMessages([])
      setMessageText('')
      setShowSignInPrompt(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (conversationId) {
      loadMessages()
      // Poll for new messages every 5 seconds
      const interval = setInterval(loadMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      
      // Show sign-in prompt for anonymous users
      if (!user) {
        setShowSignInPrompt(true)
      }
      
      if (user) {
        // Find existing open conversation for this user and this car
        // Same user + same car = same conversation (reuse it)
        const { data: existingConv, error } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', user.id)
          .eq('car_id', car.id)
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!error && existingConv) {
          setConversationId(existingConv.id)
        }
      }
    } catch (err) {
      console.error('Error checking user:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!conversationId) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      // Decrypt messages
      if (data && data.length > 0) {
        const decryptedMessages = await Promise.all(
          data.map(async (msg) => ({
            ...msg,
            message_text: await decryptMessage(msg.message_text)
          }))
        )
        setMessages(decryptedMessages)
      } else {
        setMessages([])
      }
    } catch (err: any) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Encrypt the message before sending
      const encryptedMessage = await encryptMessage(messageText)
      
      // If no conversation exists in this session, create a NEW one
      // This ensures each new inquiry/modal session creates a separate conversation
      // Messages within the same modal session go to the same conversation
      if (!conversationId) {
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            car_id: car.id,
            subject: `Inquiry about ${car.title}`,
          })
          .select()
          .single()

        if (convError) throw convError
        setConversationId(convData.id)

        // Create first message in the new conversation (encrypted)
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: convData.id,
            sender_id: userId,
            sender_name: userId ? 'You' : 'Guest',
            sender_email: null,
            message_text: encryptedMessage,
            is_admin: false,
          })
          .select()
          .single()

        if (msgError) throw msgError
        
        // Message is already decrypted in memory, just use the original text
        const decryptedMsg = {
          ...msgData,
          message_text: messageText // Use original unencrypted text for display
        }
        setMessages([decryptedMsg])
      } else {
        // Add message to the conversation created in this session (encrypted)
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: userId,
            sender_name: userId ? 'You' : 'Guest',
            sender_email: null,
            message_text: encryptedMessage,
            is_admin: false,
          })
          .select()
          .single()

        if (error) throw error
        
        // Message is already decrypted in memory, just use the original text
        const decryptedMsg = {
          ...data,
          message_text: messageText // Use original unencrypted text for display
        }
        setMessages([...messages, decryptedMsg])
      }

      setMessageText('')
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#0f1419] border-2 border-[#1a1f35] rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0f1419] border-b border-[#1a1f35] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {car.images && car.images.length > 0 && (
              <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#1a1f35] flex items-center justify-center">
                <img 
                  src={car.images[0]} 
                  alt={car.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div>
              <h2 className="text-xl text-white font-light mb-1">Message About This Car</h2>
              <p className="text-gray-400 text-sm font-light">{car.title}</p>
              <p className="text-[#d4af37] text-sm font-light">{formatPrice(car.price)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0e1a]">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37] mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm mb-2">Start a conversation about this car</p>
              <p className="text-gray-500 text-xs">Our team will respond as soon as possible</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.is_admin
                      ? 'bg-[#1a1f35] text-white'
                      : 'bg-[#d4af37] text-[#0a0e1a]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.is_admin ? 'Admin' : message.sender_name}
                    </span>
                    <span className={`text-xs ${message.is_admin ? 'text-gray-400' : 'text-[#0a0e1a]/70'}`}>
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sign-in Prompt for Anonymous Users */}
        {showSignInPrompt && !userId && (
          <div className="border-t border-[#1a1f35] p-4 bg-[#1a1f35]/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#d4af37]" />
                <p className="text-sm text-white font-medium">Sign in for better experience</p>
              </div>
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Sign in to track your conversations and get faster responses
            </p>
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => {
                  onClose()
                  router.push('/auth/login')
                }}
                className="flex-1 bg-[#d4af37] text-[#0a0e1a] px-4 py-2 rounded hover:bg-[#e5c158] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => {
                  onClose()
                  router.push('/auth/signup')
                }}
                className="flex-1 border border-[#1a1f35] text-white px-4 py-2 rounded hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-[#1a1f35] p-4 bg-[#0f1419]">
          {error && (
            <div className="mb-3 bg-red-500/20 border border-red-500/50 text-red-400 p-2 rounded text-xs">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={userId ? "Type your message..." : "Type your message (you can sign in for better experience)..."}
              rows={2}
              disabled={isSubmitting}
              className="flex-1 bg-[#0a0e1a] border border-[#1a1f35] text-white px-4 py-2 rounded focus:border-[#d4af37] focus:outline-none resize-none disabled:opacity-50 font-light"
            />
            <button
              type="submit"
              disabled={isSubmitting || !messageText.trim()}
              className="bg-[#d4af37] text-[#0a0e1a] px-6 py-2 rounded hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

