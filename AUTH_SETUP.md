# Authentication Setup Guide

This guide will help you set up secure authentication for both the mobile app and web dashboard using Supabase.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Expo CLI**: For mobile app development

## Supabase Setup

### 1. Create a New Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `lifeline-emergency-system`
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest to your users
5. Click "Create new project"

### 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure the following:

#### Site URL
- **Development**: `http://localhost:3000` (for web dashboard)
- **Production**: Your production domain

#### Redirect URLs
Add these URLs for development:
- `http://localhost:3000/auth/callback`
- `exp://localhost:19000` (for Expo development)

#### Email Settings
1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your email provider (or use Supabase's default for development)

## Environment Configuration

### 1. Copy Environment Files

```bash
# Copy the example files
cp .env.example .env
cp web-dashboard/.env.example web-dashboard/.env
cp mobile-app/.env.example mobile-app/.env
```

### 2. Update Environment Variables

Edit each `.env` file with your Supabase credentials:

**Root `.env`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Web Dashboard `.env`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Mobile App `.env`:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install web dashboard dependencies
cd web-dashboard
npm install

# Install mobile app dependencies
cd ../mobile-app
npm install
```

### 2. Start Development Servers

#### Web Dashboard
```bash
cd web-dashboard
npm run dev
```
Access at: `http://localhost:3000`

#### Mobile App
```bash
cd mobile-app
npm start
```
Follow the Expo CLI instructions to open on your device or simulator.

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Authentication Flow
1. **Sign Up**: Users create accounts with email verification
2. **Sign In**: Secure login with email/password
3. **Session Management**: Automatic token refresh
4. **Route Protection**: Authenticated routes are protected
5. **Logout**: Secure session termination

### Security Best Practices
- ✅ Password strength validation
- ✅ Email verification required
- ✅ Secure session management
- ✅ CSRF protection via Supabase
- ✅ Input validation and sanitization
- ✅ Error handling without information leakage

## Testing Authentication

### 1. Test Sign Up
1. Navigate to `/auth/signup` (web) or use the signup screen (mobile)
2. Enter valid details
3. Check your email for verification link
4. Click the verification link

### 2. Test Sign In
1. Navigate to `/auth/login` (web) or use the login screen (mobile)
2. Enter your credentials
3. You should be redirected to the dashboard

### 3. Test Logout
1. Click the logout button in the dashboard
2. You should be redirected to the login screen

## Troubleshooting

### Common Issues

#### "Supabase env not found"
- Ensure your `.env` files are in the correct locations
- Check that environment variable names match exactly
- Restart your development servers after changing `.env` files

#### "Invalid login credentials"
- Verify your email is confirmed in Supabase
- Check that you're using the correct password
- Ensure your Supabase project is active

#### "Network error"
- Check your internet connection
- Verify your Supabase URL is correct
- Ensure your Supabase project is not paused

### Debug Mode

To enable debug logging, add this to your environment files:
```env
NEXT_PUBLIC_DEBUG=true
EXPO_PUBLIC_DEBUG=true
```

## Production Deployment

### 1. Update Supabase Settings
1. Go to **Authentication** → **Settings**
2. Update **Site URL** to your production domain
3. Add your production domain to **Redirect URLs**

### 2. Environment Variables
Update your production environment variables with the same Supabase credentials.

### 3. Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Supabase RLS policies configured
- [ ] Email verification enabled
- [ ] Strong password requirements enforced

## Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Expo**: Check [Expo Documentation](https://docs.expo.dev)

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords for Supabase
- Regularly rotate your Supabase API keys
- Monitor authentication logs in Supabase dashboard
- Implement rate limiting for production use