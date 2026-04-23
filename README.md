# Sarkin Mota Autos 🚗

A scalable, serverless car resale platform built for long-term growth, affiliate marketing, admin insights, and seamless customer interaction.

**Tagline**: "Come and buy before you hear sold."

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database + Auth + Storage)
- **Email**: Resend API
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sarkin-mota-autos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Resend Configuration
   RESEND_API_KEY=your_resend_api_key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Copy your project URL and keys to the environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts and profiles
- **cars**: Car listings (admin-uploaded only)
- **car_requests**: User-submitted car listing requests
- **brands**: Car brands for dropdown selection
- **car_tags**: Tags for categorizing cars
- **analytics**: User interaction tracking

## 🔐 User Roles

- **Public Users**: Browse cars, search, view details
- **Registered Users**: Submit car requests, become affiliates, contact sellers
- **Content Admins**: Manage cars, requests, users, analytics
- **Super Admin**: All admin powers + can add/remove other admins

## 🎯 Core Features

### Public Website
- ✅ Car listings with search and filters
- ✅ Car detail pages
- ✅ User registration and authentication
- ✅ Affiliate program information

### User Dashboard
- ✅ Profile management
- ✅ Car request submission (with 4 image uploads)
- ✅ Request status tracking
- ✅ Affiliate application and tracking

### Admin Dashboard
- ✅ Car management (upload, edit, delete)
- ✅ Request management (approve/reject)
- ✅ User management
- ✅ Analytics and insights

## 📧 Email Notifications

The platform sends automated emails for:
- Welcome emails
- Car request status updates
- Affiliate application status updates

## 📊 Analytics

Track user interactions including:
- Page views
- Car clicks
- Contact button clicks
- Search queries
- Popular cars

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production

Make sure to update these in your Vercel dashboard:
- `NEXT_PUBLIC_APP_URL`: Your production domain
- All Supabase and Resend keys

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
│   ├── supabase.ts     # Supabase client configuration
│   ├── email.ts        # Email service (Resend)
│   └── analytics.ts    # Analytics tracking
└── types/              # TypeScript type definitions
    └── database.ts     # Database schema types
```

### Key Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email info@sarkinmotaautos.com or create an issue in this repository.

---

**Sarkin Mota Autos** - Come and buy before you hear sold. 🚗
# sarkin-mota-demo
