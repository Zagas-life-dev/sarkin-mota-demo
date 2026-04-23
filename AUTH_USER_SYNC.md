# Auth Users and Public Users Synchronization

This document explains how `auth.users` and `public.users` are automatically synchronized.

## How It Works

When a user signs up through Supabase Auth, a database trigger automatically creates a corresponding record in the `public.users` table.

### Database Trigger

A PostgreSQL trigger function `handle_new_user()` is set up to:
1. Listen for new user insertions in `auth.users`
2. Automatically create a record in `public.users` with:
   - Same `id` (UUID from auth.users)
   - Same `email`
   - `name` from user metadata (or email if not provided)
   - Default `role` of `'user'`

### Trigger Function

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Setup Instructions

1. **Run the SQL in Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the trigger function and trigger creation SQL from `supabase-schema.sql`

2. **Verify It Works:**
   - Sign up a new user through the website
   - Check the `public.users` table in Supabase
   - You should see a new record with the same `id` as the user in `auth.users`

### Manual Sync (If Needed)

If for some reason a user exists in `auth.users` but not in `public.users`, you can manually sync them:

```sql
-- Insert missing users from auth.users into public.users
INSERT INTO public.users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', email) as name,
  'user' as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
```

### Updating User Roles

To make a user an admin, update their role in the `public.users` table:

```sql
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@example.com';
```

### Troubleshooting

**Issue: User created in auth but not in public.users**
- Check if the trigger is enabled: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check trigger logs in Supabase dashboard
- Manually sync using the SQL above

**Issue: Duplicate key error**
- The trigger uses `ON CONFLICT DO NOTHING` to prevent duplicates
- If you see this error, the user record likely already exists

## Security

- The trigger runs with `SECURITY DEFINER`, meaning it has elevated privileges to bypass RLS
- RLS policies still apply for regular user operations
- Users can only view/update their own profile
- Admins can view all users




