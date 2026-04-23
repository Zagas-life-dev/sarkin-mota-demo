# Cloudinary Setup Guide for Sarkin Mota Autos

## Step 1: Create Cloudinary Account

1. **Sign up for Cloudinary**
   - Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
   - Sign up with your email (free tier available)
   - Verify your email address

2. **Get Your Credentials**
   - After signing up, go to your [Dashboard](https://console.cloudinary.com/)
   - You'll see your **Cloud Name**, **API Key**, and **API Secret**
   - **Important**: Keep your API Secret secure - never expose it in client-side code!

## Step 2: Install Cloudinary SDK

```bash
npm install cloudinary next-cloudinary
```

## Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Set upload preset (for unsigned uploads)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**For Production (Vercel):**
- Add these same variables in your Vercel project settings
- Go to Project Settings → Environment Variables

## Step 4: Create Upload Preset (Optional but Recommended)

1. Go to Cloudinary Dashboard → Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Configure:
   - **Preset name**: `sarkin-mota-autos` (or your choice)
   - **Signing mode**: Unsigned (for client-side uploads)
   - **Folder**: `cars/` (to organize uploads)
   - **Allowed formats**: jpg, png, webp, mp4, mov, etc.
   - **Max file size**: Set appropriate limits (e.g., 10MB for images, 100MB for videos)
5. Save the preset
6. Copy the preset name to your `.env.local`

## Step 5: Create Utility Functions

We'll create utility functions for uploading images and videos.

## Usage Examples

### Server-Side Upload (Recommended for Admin)
```typescript
import { uploadImage, uploadVideo } from '@/lib/cloudinary'

// Upload image
const imageUrl = await uploadImage(file, 'cars/exterior')

// Upload video
const videoUrl = await uploadVideo(file, 'cars/videos')
```

### Client-Side Upload (For User Submissions)
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary-client'

const url = await uploadToCloudinary(file, 'cars/user-uploads')
```

## Security Best Practices

1. **Never expose API Secret** in client-side code
2. **Use signed uploads** for admin operations (server-side)
3. **Use unsigned uploads with presets** for user uploads (client-side)
4. **Set file size limits** in upload presets
5. **Validate file types** before uploading
6. **Use folder organization** to keep files organized

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Video storage**: 25 GB
- **Video bandwidth**: 25 GB/month

For production, consider upgrading to a paid plan.





