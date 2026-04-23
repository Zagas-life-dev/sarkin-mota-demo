import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient } from '@/lib/supabase-client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const carId = params.id

    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClientComponentClient()

    // Increment views count using database function (works for both authenticated and anonymous users)
    const { error } = await supabase.rpc('increment_car_views', {
      car_id: carId
    })

    if (error) {
      console.error('Error incrementing views:', error)
      return NextResponse.json(
        { error: 'Failed to increment views', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('View tracking error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

