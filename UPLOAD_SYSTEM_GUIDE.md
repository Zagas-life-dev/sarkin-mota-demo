# Upload System Guide

## ✅ Upload System Complete!

The complete upload system for Sarkin Mota Autos is now built and ready to use.

## 🎯 What's Been Built

### 1. Admin Car Upload System
**Location**: `/admin/cars/new`

**Features**:
- ✅ Complete car listing form with all fields
- ✅ Image upload (up to 10 images)
- ✅ Video upload (up to 3 videos)
- ✅ Structured features (Interior, Comfort, Safety, Exterior)
- ✅ All car specifications (engine, dimensions, etc.)
- ✅ Financing options
- ✅ Direct save to Supabase database
- ✅ Cloudinary integration for media storage

**How to Use**:
1. Go to Admin Dashboard (`/admin`)
2. Click "Add New Car"
3. Fill out the form
4. Upload images/videos using the upload components
5. Click "Create Car Listing"

### 2. User Car Request System
**Location**: `/dashboard/car-request`

**Features**:
- ✅ User-friendly car submission form
- ✅ Exterior images (2 required)
- ✅ Interior images (2 required)
- ✅ Basic car information
- ✅ Automatic submission to `car_requests` table
- ✅ Status tracking (pending/approved/rejected)

**How to Use**:
1. User must be logged in
2. Navigate to `/dashboard/car-request`
3. Fill out seller and car information
4. Upload 2 exterior and 2 interior images
5. Submit request
6. Admin reviews and approves/rejects

### 3. ImageUpload Component
**Location**: `src/components/ImageUpload.tsx`

**Features**:
- ✅ Drag & drop file selection
- ✅ Multiple file support
- ✅ Progress tracking
- ✅ File validation
- ✅ Preview before upload
- ✅ Automatic Cloudinary upload
- ✅ Error handling

**Usage**:
```tsx
<ImageUpload
  onUploadComplete={(urls) => {
    // Handle uploaded URLs
    console.log('Uploaded:', urls)
  }}
  onUploadError={(error) => {
    // Handle errors
    console.error(error)
  }}
  maxFiles={5}
  accept="image/*"
  folder="sarkin-mota-autos/cars"
/>
```

### 4. API Routes
**Location**: `src/app/api/upload/route.ts`

**Features**:
- ✅ Server-side upload endpoint
- ✅ Secure uploads (uses API secret)
- ✅ Supports images and videos
- ✅ Returns Cloudinary URLs

**Usage**:
```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('type', 'image')
formData.append('folder', 'sarkin-mota-autos/cars')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const { url } = await response.json()
```

## 📁 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── cars/
│   │   │   └── new/
│   │   │       └── page.tsx          # Admin car upload form
│   │   └── page.tsx                  # Admin dashboard (updated)
│   ├── dashboard/
│   │   └── car-request/
│   │       └── page.tsx              # User car request form
│   └── api/
│       └── upload/
│           └── route.ts              # Upload API endpoint
├── components/
│   └── ImageUpload.tsx               # Reusable upload component
└── lib/
    ├── cloudinary.ts                 # Server-side Cloudinary utils
    └── cloudinary-client.ts          # Client-side Cloudinary utils
```

## 🔄 Upload Flow

### Admin Upload Flow:
1. Admin navigates to `/admin/cars/new`
2. Fills out car information
3. Selects images/videos using ImageUpload component
4. Images/videos upload to Cloudinary automatically
5. URLs are stored in component state
6. Form submission saves all data + URLs to Supabase

### User Request Flow:
1. User navigates to `/dashboard/car-request`
2. Fills out seller and car information
3. Uploads 2 exterior + 2 interior images
4. Images upload to Cloudinary
5. Form submission saves to `car_requests` table
6. Admin reviews and approves/rejects

## 🎨 Features Included

### Admin Form Includes:
- ✅ Basic info (title, stock number, prices)
- ✅ Car overview (brand, model, year, body, category, condition)
- ✅ Engine & performance specs
- ✅ Transmission & drivetrain
- ✅ Physical specifications
- ✅ Dimensions & capacity
- ✅ Location & contact info
- ✅ Structured features (4 categories)
- ✅ Description (short + full)
- ✅ Status & settings (featured, financing)
- ✅ Media upload (images + videos)

### User Form Includes:
- ✅ Seller information
- ✅ Car details
- ✅ Image uploads (exterior + interior)
- ✅ Description

## 🔐 Security

- ✅ Server-side uploads use API secret (secure)
- ✅ Client-side uploads use unsigned preset (safe for users)
- ✅ File validation (type, size)
- ✅ User authentication required
- ✅ Admin-only access for car creation

## 📝 Next Steps

1. **Test the upload system**:
   - Create a test car listing as admin
   - Submit a test car request as user
   - Verify images upload to Cloudinary
   - Check data saves to Supabase

2. **Add more features** (optional):
   - Edit car functionality
   - Delete car functionality
   - Bulk image upload
   - Image cropping/editing
   - Video preview

3. **Admin features** (optional):
   - Approve/reject car requests
   - Edit existing cars
   - Delete cars
   - View analytics

## 🐛 Troubleshooting

### Images not uploading?
- Check Cloudinary credentials in `.env.local`
- Verify upload preset is created and set to "Unsigned"
- Check browser console for errors
- Verify file sizes are within limits

### Form not submitting?
- Check Supabase connection
- Verify user is authenticated
- Check browser console for errors
- Ensure all required fields are filled

### URLs not saving?
- Check database schema matches TypeScript types
- Verify Supabase RLS policies allow inserts
- Check network tab for API errors

## 📚 Related Documentation

- `CLOUDINARY_SETUP.md` - Cloudinary setup guide
- `CLOUDINARY_QUICK_START.md` - Quick reference
- `DATABASE_SCHEMA.md` - Database structure
- `supabase-schema.sql` - SQL schema





