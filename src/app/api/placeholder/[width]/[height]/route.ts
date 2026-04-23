import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  const { width, height } = await params
  const numWidth = parseInt(width) || 800
  const numHeight = parseInt(height) || 600
  const url = `https://source.unsplash.com/random/${numWidth}x${numHeight}?car,luxury,dark`
  return NextResponse.redirect(url, 302)
} 