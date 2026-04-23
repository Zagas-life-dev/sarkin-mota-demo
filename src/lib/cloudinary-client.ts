/**
 * Client-side Cloudinary upload utility
 * Uses unsigned upload with preset (for user submissions)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'sarkin-mota-autos'

/**
 * Upload file to Cloudinary from client-side (unsigned upload)
 * @param file - File object from input
 * @param folder - Optional folder path
 * @param onProgress - Optional progress callback
 * @returns Cloudinary URL
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = 'sarkin-mota-autos/cars/user-uploads',
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is not configured')
  }

  // Validate file type
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    throw new Error('File must be an image or video')
  }

  // Validate file size (10MB for images, 100MB for videos)
  const maxImageSize = 10 * 1024 * 1024 // 10MB
  const maxVideoSize = 100 * 1024 * 1024 // 100MB

  if (isImage && file.size > maxImageSize) {
    throw new Error('Image size must be less than 10MB')
  }

  if (isVideo && file.size > maxVideoSize) {
    throw new Error('Video size must be less than 100MB')
  }

  // Create form data
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)
  formData.append('cloud_name', CLOUD_NAME)

  // Determine resource type
  const resourceType = isVideo ? 'video' : 'image'
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`

  try {
    // For progress tracking (if needed in future)
    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.secure_url)
        } else {
          reject(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', uploadUrl)
      xhr.send(formData)
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of File objects
 * @param folder - Optional folder path
 * @param onProgress - Optional progress callback for each file
 * @returns Array of Cloudinary URLs
 */
export async function uploadMultipleFiles(
  files: File[],
  folder: string = 'sarkin-mota-autos/cars/user-uploads',
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map(async (file, index) => {
    const progressCallback = onProgress
      ? (progress: number) => onProgress(index, progress)
      : undefined

    return uploadToCloudinary(file, folder, progressCallback)
  })

  return Promise.all(uploadPromises)
}

/**
 * Validate file before upload
 * @param file - File object
 * @returns Validation result
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: 'File must be an image (jpg, png, webp) or video (mp4, mov)',
    }
  }

  // Check file size
  const maxImageSize = 10 * 1024 * 1024 // 10MB
  const maxVideoSize = 100 * 1024 * 1024 // 100MB

  if (isImage && file.size > maxImageSize) {
    return {
      valid: false,
      error: 'Image size must be less than 10MB',
    }
  }

  if (isVideo && file.size > maxVideoSize) {
    return {
      valid: false,
      error: 'Video size must be less than 100MB',
    }
  }

  return { valid: true }
}





