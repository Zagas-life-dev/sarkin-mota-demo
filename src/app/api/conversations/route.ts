import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient } from '@/lib/supabase-client'
import { encryptMessage } from '@/lib/encryption-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, carId, subject, senderName, senderEmail, messageText } = body

    if (!subject || !senderName || !messageText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClientComponentClient()
    
    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId || null,
        car_id: carId || null,
        subject,
      })
      .select()
      .single()

    if (convError) {
      console.error('Error creating conversation:', convError)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    // Encrypt the message before storing
    const encryptedMessage = encryptMessage(messageText)
    
    // Create first message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: userId || null,
        sender_name: senderName,
        sender_email: senderEmail || null,
        message_text: encryptedMessage,
        is_admin: false,
      })
      .select()
      .single()

    if (msgError) {
      console.error('Error creating message:', msgError)
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      conversation,
      message 
    })
  } catch (error: any) {
    console.error('Conversation creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      conversations: data || [] 
    })
  } catch (error: any) {
    console.error('Conversation fetch error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

