'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react'
import { uploadToCloudinary, validateFile } from '@/lib/cloudinary-client'

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  accept?: string
  folder?: string
  label?: string
  multiple?: boolean
}

export default function ImageUpload({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  accept = 'image/*,video/*',
  folder = 'sarkin-mota-autos/cars',
  label = 'Upload Images/Video',
  multiple = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({})
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length === 0) return

    // Validate file count
    const totalFiles = files.length + selectedFiles.length
    if (totalFiles > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate each file
    for (const file of selectedFiles) {
      const validation = validateFile(file)
      if (!validation.valid) {
        onUploadError?.(validation.error || 'Invalid file')
        return
      }
    }

    // Create previews
    const newPreviews: string[] = []
    selectedFiles.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          newPreviews.push(result)
          setPreviews((prev) => [...prev, ...newPreviews])
        }
        reader.readAsDataURL(file)
      } else {
        newPreviews.push('video-preview')
      }
    })

    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress({})

    try {
      const urls = await Promise.all(
        files.map(async (file, index) => {
          const url = await uploadToCloudinary(
            file,
            folder,
            (progress) => {
              setUploadProgress((prev) => ({ ...prev, [index]: progress }))
            }
          )
          return url
        })
      )

      onUploadComplete(urls)
      setFiles([])
      setPreviews([])
      setUploadProgress({})
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.((error as Error).message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[index]
      return newProgress
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || files.length >= maxFiles}
            className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0a0e1a] hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>Select Files</span>
          </button>
          {files.length > 0 && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-white text-[#0a0e1a] hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Max {maxFiles} files. Images: 10MB max, Videos: 100MB max
        </p>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video bg-[#1a1f35] rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={previews[index] || URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {uploadProgress[index] !== undefined && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-sm">
                      {uploadProgress[index]}%
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={uploading}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}





