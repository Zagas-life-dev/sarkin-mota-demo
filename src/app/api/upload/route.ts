import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

/**
 * Server-side upload API route
 * Use this for admin uploads (more secure)
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'image' or 'video'
    const folder = (formData.get('folder') as string) || 'sarkin-mota-autos/cars'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let url: string

    if (type === 'video') {
      url = await uploadVideo(buffer, { folder })
    } else {
      url = await uploadImage(buffer, { folder })
    }

    return NextResponse.json({
      success: true,
      url,
      publicId: extractPublicIdFromUrl(url),
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

/**
 * Extract public ID from Cloudinary URL
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)
    return match ? match[1] : null
  } catch {
    return null
  }
}





