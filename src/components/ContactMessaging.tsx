'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2, MessageCircle, LogIn, UserPlus } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { decryptMessage, encryptMessage } from '@/lib/encryption'
import Link from 'next/link'

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

export default function ContactMessaging() {
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
    checkUser()
  }, [])

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
        setIsLoading(false)
        return
      }
      
      setShowSignInPrompt(false)
      
      // Find existing general conversation for this user (car_id is NULL)
      // Only 1 conversation per user for general contact
      const { data: existingConv, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .is('car_id', null)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && existingConv) {
        setConversationId(existingConv.id)
      }
      
      setIsLoading(false)
    } catch (err) {
      console.error('Error checking user:', err)
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
      setError('Failed to load messages')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    if (!userId) {
      router.push('/auth/login')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Encrypt the message before sending
      const encryptedMessage = await encryptMessage(messageText)
      
      let currentConversationId = conversationId
      
      // Create new conversation if none exists for this user (general contact, car_id = null)
      if (!currentConversationId) {
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            car_id: null, // General contact conversation
            subject: 'General Inquiry',
          })
          .select()
          .single()

        if (convError) throw convError
        currentConversationId = convData.id
        setConversationId(convData.id)
      }

      // Create message in the current conversation (encrypted)
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversationId,
          sender_id: userId,
          sender_name: 'You',
          sender_email: null,
          message_text: encryptedMessage, // Store encrypted message
          is_admin: false,
        })
        .select()
        .single()

      if (msgError) throw msgError
      
      // Use original unencrypted text for immediate display
      const decryptedMsg = {
        ...msgData,
        message_text: messageText 
      }
      setMessages(prev => [...prev, decryptedMsg])
      setMessageText('')
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (showSignInPrompt) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded">
        <div className="flex items-start gap-4">
          <MessageCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">Sign in to start messaging</h3>
            <p className="text-gray-300 text-sm mb-4">
              Please sign in or create an account to chat with us directly on the platform.
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-white text-white hover:bg-white/10 transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0f1419] border border-[#1a1f35] rounded-lg overflow-hidden">
      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-[#0a0e1a]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 font-light">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.is_admin
                    ? 'bg-[#1a1f35] text-white'
                    : 'bg-[#d4af37] text-black'
                }`}
              >
                <div className="text-xs font-medium mb-1 opacity-70">
                  {message.is_admin ? 'Admin' : message.sender_name}
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                <div className="text-xs opacity-50 mt-2">
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {error && (
        <div className="px-6 pt-4">
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded text-sm">
            {error}
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-[#1a1f35]">
        <div className="flex gap-3">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 bg-[#0a0e1a] border border-[#1a1f35] text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting || !messageText.trim()}
            className="px-6 py-3 bg-[#d4af37] text-black hover:bg-[#c9a030] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}



