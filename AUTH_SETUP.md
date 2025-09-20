# Authentication Setup Guide

This guide will help you set up secure authentication for both the mobile app and web dashboard.

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
   - Name: `lifeline-emergency-system`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users

### 2. Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure the following:

#### Site URL
- Add your production domain: `https://yourdomain.com`
- Add your development URL: `http://localhost:3000`

#### Redirect URLs
Add these URLs for authentication flows:
- `http://localhost:3000/auth/login`
- `https://yourdomain.com/auth/login`
- `http://localhost:3000/auth/reset-password`
- `https://yourdomain.com/auth/reset-password`

#### Email Templates (Optional)
Customize the email templates for:
- Confirm signup
- Reset password
- Magic link

### 3. Get API Keys

1. Go to **Settings > API**
2. Copy the following values:
   - Project URL
   - Anon (public) key

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Update Environment Variables

Edit `.env.local` with your Supabase credentials:

```env
# Web Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mobile App
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (@$!%*?&)

### Rate Limiting
- **Login**: 5 attempts per 15 minutes
- **Signup**: 3 attempts per hour
- **Password Reset**: 3 attempts per hour

### Additional Security
- Email verification required for new accounts
- Secure session management
- Automatic token refresh
- Protected routes with middleware

## Running the Applications

### Web Dashboard

```bash
cd web-dashboard
npm install
npm run dev
```

Visit `http://localhost:3000` and you'll be redirected to the login page.

### Mobile App

```bash
cd mobile-app
npm install
npm start
```

Use Expo Go app to scan the QR code and test on your device.

## Testing Authentication

### 1. Create a Test Account

1. Go to the signup page
2. Enter valid details:
   - Full name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
3. Check your email for verification link
4. Click the verification link

### 2. Test Login

1. Go to the login page
2. Enter your credentials
3. You should be redirected to the dashboard

### 3. Test Security Features

#### Rate Limiting
1. Try logging in with wrong password 5 times
2. You should see a rate limiting message
3. Wait 15 minutes or clear browser data to reset

#### Password Validation
1. Try signing up with weak passwords
2. You should see validation errors
3. Password requirements are shown in real-time

## Troubleshooting

### Common Issues

#### "Supabase env not found"
- Make sure your `.env.local` file exists
- Check that environment variable names are correct
- Restart your development server after changes

#### "Invalid login credentials"
- Verify your Supabase URL and anon key
- Check that the user account exists and is verified
- Ensure email/password are correct

#### Rate limiting not working
- Rate limiting is client-side for demo purposes
- In production, implement server-side rate limiting
- Clear browser storage to reset rate limits

### Getting Help

1. Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Review the authentication code in `/shared/authService.ts`
3. Check browser console for error messages
4. Verify Supabase project settings

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Configuration

1. Update Site URL to your production domain
2. Add production redirect URLs
3. Configure email templates for your domain
4. Set up proper CORS policies

### Security Checklist

- [ ] Strong database password
- [ ] Row Level Security (RLS) enabled
- [ ] Email verification required
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Regular security updates

## Next Steps

1. **User Profiles**: Extend user data with additional fields
2. **Role-Based Access**: Implement different user roles
3. **Two-Factor Authentication**: Add 2FA for enhanced security
4. **Audit Logging**: Track authentication events
5. **Social Login**: Add Google/GitHub authentication
6. **Password Policies**: Implement organization-specific policies