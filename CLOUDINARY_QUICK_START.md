# Cloudinary Quick Start Guide

## ✅ Setup Complete!

Your Cloudinary integration is ready. Follow these steps:

## 1. Get Your Cloudinary Credentials

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up and verify your email
3. Go to [Dashboard](https://console.cloudinary.com/)
4. Copy these values:
   - **Cloud Name** (e.g., `ddnlbizum`)
   - **API Key** (starts with numbers)
   - **API Secret** (keep this secret!)

## 2. Add to Environment Variables

Add to your `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=sarkin-mota-autos
```

## 3. Create Upload Preset (Recommended)

1. In Cloudinary Dashboard → **Settings** → **Upload**
2. Scroll to **Upload presets** → Click **Add upload preset**
3. Configure:
   - **Preset name**: `sarkin-mota-autos`
   - **Signing mode**: **Unsigned** (for client uploads)
   - **Folder**: `cars/`
   - **Max file size**: 10MB (images), 100MB (videos)
4. Save

## 4. Usage Examples

### Server-Side Upload (Admin/API Routes)

```typescript
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

// Upload image
const imageUrl = await uploadImage(fileBuffer, {
  folder: 'sarkin-mota-autos/cars/exterior'
})

// Upload video
const videoUrl = await uploadVideo(fileBuffer, {
  folder: 'sarkin-mota-autos/cars/videos'
})
```

### Client-Side Upload (User Submissions)

```typescript
import { uploadToCloudinary } from '@/lib/cloudinary-client'

const url = await uploadToCloudinary(file, 'sarkin-mota-autos/cars/user-uploads')
```

### Using the Upload Component

```tsx
import ImageUpload from '@/components/ImageUpload'

<ImageUpload
  onUploadComplete={(urls) => {
    console.log('Uploaded URLs:', urls)
    // Save to database
  }}
  onUploadError={(error) => {
    console.error('Upload error:', error)
  }}
  maxFiles={5}
  folder="sarkin-mota-autos/cars"
/>
```

### API Route Upload

```typescript
// POST /api/upload
const formData = new FormData()
formData.append('file', file)
formData.append('type', 'image') // or 'video'
formData.append('folder', 'sarkin-mota-autos/cars')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const { url } = await response.json()
```

## 5. File Organization

Recommended folder structure:
```
sarkin-mota-autos/
  ├── cars/
  │   ├── exterior/     (exterior car images)
  │   ├── interior/      (interior car images)
  │   ├── videos/       (car videos)
  │   └── user-uploads/ (user-submitted images)
  ├── dealers/
  │   └── logos/        (dealer logos)
  └── brands/
      └── logos/        (brand logos)
```

## 6. Security Notes

✅ **DO:**
- Use server-side uploads for admin operations
- Use unsigned uploads with presets for user uploads
- Set file size limits in upload presets
- Validate file types before uploading

❌ **DON'T:**
- Expose API Secret in client-side code
- Allow unlimited file sizes
- Skip file type validation

## 7. Testing

Test your setup:

```bash
# Start your dev server
npm run dev

# Test upload component
# Navigate to a page with ImageUpload component
# Try uploading an image/video
```

## 8. Production Deployment

For Vercel:
1. Go to Project Settings → Environment Variables
2. Add all Cloudinary variables
3. Redeploy

## Need Help?

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js + Cloudinary Guide](https://cloudinary.com/documentation/nextjs_integration)
- Check `CLOUDINARY_SETUP.md` for detailed setup





