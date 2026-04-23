import { createClientComponentClient } from './supabase-client'
import { Conversation, Message } from '@/types/database'
import { encryptMessage, decryptMessage } from './encryption'

export async function createConversation(
  userId: string | null,
  carId: string | null,
  subject: string,
  senderName: string,
  senderEmail: string | null
): Promise<Conversation | null> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      car_id: carId,
      subject,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  // Create first message
  if (data) {
    await createMessage(data.id, userId, senderName, senderEmail, subject)
  }

  return data
}

export async function createMessage(
  conversationId: string,
  senderId: string | null,
  senderName: string,
  senderEmail: string | null,
  messageText: string,
  isAdmin: boolean = false
): Promise<Message | null> {
  const supabase = createClientComponentClient()
  
  // Encrypt the message before storing
  const encryptedMessage = await encryptMessage(messageText)
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: senderName,
      sender_email: senderEmail,
      message_text: encryptedMessage,
      is_admin: isAdmin,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    return null
  }

  // Decrypt the message before returning
  if (data) {
    data.message_text = await decryptMessage(data.message_text)
  }

  return data
}

export async function getConversations(userId: string | null): Promise<Conversation[]> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  // Decrypt all messages
  if (data && data.length > 0) {
    const decryptedMessages = await Promise.all(
      data.map(async (msg) => ({
        ...msg,
        message_text: await decryptMessage(msg.message_text)
      }))
    )
    return decryptedMessages
  }

  return []
}

export async function markMessagesAsRead(conversationId: string): Promise<boolean> {
  const supabase = createClientComponentClient()
  
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .eq('is_read', false)

  if (error) {
    console.error('Error marking messages as read:', error)
    return false
  }

  return true
}

// Get unread messages count for a user
export async function getUnreadMessageCount(userId: string): Promise<number> {
  const supabase = createClientComponentClient()
  
  // Get all conversations for the user
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId)

  if (!conversations || conversations.length === 0) {
    return 0
  }

  const conversationIds = conversations.map(c => c.id)

  // Count unread admin messages in user's conversations
  const { data, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .in('conversation_id', conversationIds)
    .eq('is_read', false)
    .eq('is_admin', true)

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return data?.length || 0
}

// Get recent unread messages for notifications
export async function getRecentUnreadMessages(userId: string, limit: number = 5): Promise<Array<Message & { conversation_id: string; conversation_subject: string }>> {
  const supabase = createClientComponentClient()
  
  // Get all conversations for the user
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, subject')
    .eq('user_id', userId)

  if (!conversations || conversations.length === 0) {
    return []
  }

  const conversationIds = conversations.map(c => c.id)
  const conversationMap = new Map(conversations.map(c => [c.id, c.subject]))

  // Get recent unread admin messages
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', conversationIds)
    .eq('is_read', false)
    .eq('is_admin', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error getting recent unread messages:', error)
    return []
  }

  // Decrypt messages and add conversation subject
  if (messages && messages.length > 0) {
    const decryptedMessages = await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        message_text: await decryptMessage(msg.message_text),
        conversation_subject: conversationMap.get(msg.conversation_id) || 'Conversation'
      }))
    )
    return decryptedMessages
  }

  return []
}

// Get unread message count for a specific conversation
export async function getUnreadCountForConversation(conversationId: string, userId: string | null): Promise<number> {
  const supabase = createClientComponentClient()
  
  // Count unread admin messages in this conversation
  const { data, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('is_read', false)
    .eq('is_admin', true)

  if (error) {
    console.error('Error getting unread count for conversation:', error)
    return 0
  }

  return data?.length || 0
}

