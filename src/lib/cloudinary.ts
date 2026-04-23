import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

export interface UploadOptions {
  folder?: string
  public_id?: string
  resource_type?: 'image' | 'video' | 'raw' | 'auto'
  transformation?: any[]
  format?: string
  quality?: string | number
  width?: number
  height?: number
  crop?: string
}

function getUploadSource(file: Buffer | string): string {
  if (typeof file === 'string') {
    return file
  }

  // Cloudinary `upload` expects a string source, so convert buffers to data URIs.
  return `data:application/octet-stream;base64,${file.toString('base64')}`
}

/**
 * Upload image to Cloudinary (Server-side only)
 * @param file - File buffer, base64 string, or file path
 * @param options - Upload options
 * @returns Cloudinary upload result with secure URL
 */
export async function uploadImage(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(getUploadSource(file), {
      resource_type: 'image',
      folder: options.folder || 'sarkin-mota-autos/cars',
      public_id: options.public_id,
      transformation: options.transformation || [
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ],
      format: options.format,
      quality: options.quality || 'auto:best',
      width: options.width,
      height: options.height,
      crop: options.crop || 'limit',
    })

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary image upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Upload video to Cloudinary (Server-side only)
 * @param file - File buffer, base64 string, or file path
 * @param options - Upload options
 * @returns Cloudinary upload result with secure URL
 */
export async function uploadVideo(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(getUploadSource(file), {
      resource_type: 'video',
      folder: options.folder || 'sarkin-mota-autos/cars/videos',
      public_id: options.public_id,
      transformation: options.transformation,
      format: options.format,
    })

    return result.secure_url
  } catch (error) {
    console.error('Cloudinary video upload error:', error)
    throw new Error('Failed to upload video to Cloudinary')
  }
}

/**
 * Upload multiple images
 * @param files - Array of file buffers or base64 strings
 * @param folder - Cloudinary folder path
 * @returns Array of Cloudinary URLs
 */
export async function uploadMultipleImages(
  files: (Buffer | string)[],
  folder: string = 'sarkin-mota-autos/cars'
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadImage(file, {
        folder,
        public_id: `${folder}/${Date.now()}-${index}`,
      })
    )

    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('Cloudinary multiple images upload error:', error)
    throw new Error('Failed to upload images to Cloudinary')
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID (extracted from URL)
 * @returns Deletion result
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    })
  } catch (error) {
    console.error('Cloudinary delete image error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Delete video from Cloudinary
 * @param publicId - Cloudinary public ID (extracted from URL)
 * @returns Deletion result
 */
export async function deleteVideo(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    })
  } catch (error) {
    console.error('Cloudinary delete video error:', error)
    throw new Error('Failed to delete video from Cloudinary')
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)
    if (match) {
      return match[1]
    }
    return null
  } catch {
    return null
  }
}

/**
 * Generate optimized image URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Image quality
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: string | number = 'auto:best'
): string {
  if (!url.includes('cloudinary.com')) {
    return url // Return original if not Cloudinary URL
  }

  const publicId = extractPublicId(url)
  if (!publicId) {
    return url
  }

  const transformations: string[] = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (quality) transformations.push(`q_${quality}`)
  transformations.push('c_limit', 'f_auto')

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || url.split('/')[2]?.split('.')[0]
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${publicId}`
}

/**
 * Generate video thumbnail
 * @param url - Cloudinary video URL
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export function getVideoThumbnail(
  url: string,
  width: number = 800,
  height: number = 450
): string {
  if (!url.includes('cloudinary.com')) {
    return url
  }

  const publicId = extractPublicId(url)
  if (!publicId) {
    return url
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || url.split('/')[2]?.split('.')[0]
  return `https://res.cloudinary.com/${cloudName}/video/upload/w_${width},h_${height},c_fill/${publicId}.jpg`
}

export default cloudinary





