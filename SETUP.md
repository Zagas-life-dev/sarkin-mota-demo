# 🚀 Sarkin Mota Autos - Quick Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- A Supabase account (free)
- A Resend account (free tier available)

## ⚡ Quick Start (5 minutes)

### 1. Navigate to Project Directory
```bash
cd sarkin-mota-autos
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp env.example .env.local

# Edit the file with your actual values
# (See detailed setup below)
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to `http://localhost:3000`

---

## 🔧 Detailed Setup

### Step 1: Supabase Setup

1. **Create Supabase Project**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `sarkin-mota-autos`
   - Set database password (save this!)
   - Choose region (closest to Nigeria)
   - Click "Create new project"

2. **Get API Keys**
   - In your project dashboard, go to **Settings > API**
   - Copy the following values:
     - **Project URL** (looks like: `https://abc123.supabase.co`)
     - **anon public** key (starts with `eyJ...`)
     - **service_role** key (starts with `eyJ...`)

3. **Set Up Database**
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the entire content of `supabase-schema.sql`
   - Paste and run the SQL script
   - This creates all tables, indexes, and initial data

### Step 2: Resend Setup

1. **Create Resend Account**
   - Go to [https://resend.com](https://resend.com)
   - Sign up with your email
   - Verify your email address

2. **Get API Key**
   - In Resend dashboard, go to **API Keys**
   - Click "Create API Key"
   - Name it: `sarkin-mota-autos`
   - Copy the API key (starts with `re_`)

### Step 3: Environment Configuration

1. **Create Environment File**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`**
   Replace the placeholder values with your actual keys:

   ```env
   # Supabase (from Step 1)
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

   # Resend (from Step 2)
   RESEND_API_KEY=your-actual-resend-api-key

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 4: Test the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Verify Setup**
   - Open `http://localhost:3000`
   - You should see the Sarkin Mota Autos homepage
   - Check browser console for any errors

3. **Test Database Connection**
   - Try to register a new user
   - Check Supabase dashboard > Authentication > Users
   - You should see the new user created

---

## 🧪 Testing Checklist

- [ ] Homepage loads without errors
- [ ] Navigation works on mobile and desktop
- [ ] User registration works
- [ ] User login works
- [ ] Database tables are created
- [ ] Email service is configured

---

## 🚨 Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
npm install
```

**Supabase connection errors**
- Check your API keys in `.env.local`
- Verify your Supabase project is active
- Check if you ran the SQL schema

**Email not working**
- Verify your Resend API key
- Check Resend dashboard for any errors
- Make sure you're not in development mode

**Port already in use**
```bash
# Kill the process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

---

## 📱 Next Steps

Once the basic setup is working:

1. **Create Admin User**
   - Register a normal user
   - Go to Supabase dashboard > Authentication > Users
   - Change the user's role to `super_admin`

2. **Add Sample Data**
   - Use the admin dashboard to add some car brands
   - Upload sample car listings

3. **Test Full Flow**
   - Submit a car request as a user
   - Approve it as an admin
   - Test the affiliate system

---

## 🆘 Need Help?

- Check the browser console for errors
- Look at the terminal output for server errors
- Verify all environment variables are set correctly
- Make sure your Supabase project is in the same region as your users

---

**🎉 You're all set! The Sarkin Mota Autos platform is ready for development.**
