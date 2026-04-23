import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient } from '@/lib/supabase-client'
import { encryptMessage, decryptMessage } from '@/lib/encryption-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, senderId, senderName, senderEmail, messageText, isAdmin } = body

    if (!conversationId || !senderName || !messageText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClientComponentClient()
    
    // Encrypt the message before storing
    const encryptedMessage = encryptMessage(messageText)
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId || null,
        sender_name: senderName,
        sender_email: senderEmail || null,
        message_text: encryptedMessage,
        is_admin: isAdmin || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      )
    }

    // Decrypt the message before returning
    if (data) {
      data.message_text = decryptMessage(data.message_text)
    }

    return NextResponse.json({ 
      success: true, 
      message: data 
    })
  } catch (error: any) {
    console.error('Message creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    // Decrypt all messages
    const decryptedMessages = (data || []).map(msg => ({
      ...msg,
      message_text: decryptMessage(msg.message_text)
    }))

    return NextResponse.json({ 
      success: true, 
      messages: decryptedMessages 
    })
  } catch (error: any) {
    console.error('Message fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

