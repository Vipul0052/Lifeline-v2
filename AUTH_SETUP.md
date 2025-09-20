# Authentication System Setup Guide

This guide explains how to set up and use the secure authentication system for the Lifeline IoT Emergency System.

## 🔐 Authentication Features

### Security Features
- **Strong Password Requirements**: 8+ characters with uppercase, lowercase, and numbers
- **Input Validation & Sanitization**: Prevents XSS and injection attacks
- **Email Verification**: Required for account activation
- **Session Management**: Automatic token refresh and secure session handling
- **Protected Routes**: Automatic redirection based on authentication state
- **Error Handling**: Comprehensive error messages and user feedback

### Platforms Supported
- **Mobile App**: React Native with Expo
- **Web Dashboard**: Next.js with Tailwind CSS
- **Shared Service**: Common authentication logic across platforms

## 🚀 Setup Instructions

### 1. Environment Variables

Create the following environment files:

#### Mobile App (`.env`)
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Web Dashboard (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Configure email authentication in the Supabase dashboard:
   - Go to Authentication > Settings
   - Enable email confirmation
   - Configure email templates (optional)

### 3. Install Dependencies

#### Mobile App
```bash
cd mobile-app
npm install
```

#### Web Dashboard
```bash
cd web-dashboard
npm install
```

#### Shared Services
```bash
cd shared
npm install
```

## 📱 Mobile App Authentication

### Login Screen Features
- Email and password validation
- Loading states and error handling
- Secure input handling
- Navigation to signup

### Signup Screen Features
- Full name, email, password, and confirm password fields
- Strong password validation with real-time feedback
- Account creation with email verification
- Automatic redirect to login after successful signup

### Authentication Context
- Global user state management
- Automatic session persistence
- Real-time auth state changes
- Secure sign out functionality

### Usage Example
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, signOut } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginScreen />;
  
  return (
    <View>
      <Text>Welcome, {user.user_metadata.name}</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}
```

## 🖥️ Web Dashboard Authentication

### Login Page Features
- Modern dark theme UI
- Form validation with real-time feedback
- Loading states and error handling
- Responsive design

### Signup Page Features
- Multi-step form with validation
- Password strength indicator
- Success confirmation page
- Email verification flow

### Protected Routes
- Automatic redirection for unauthenticated users
- Route-based access control
- Loading states during auth checks

### Usage Example
```tsx
'use client'
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.user_metadata?.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## 🔒 Security Best Practices

### Input Validation
- Email format validation
- Password strength requirements
- Input sanitization to prevent XSS
- Server-side validation through Supabase

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- No common passwords (enforced by Supabase)

### Session Security
- Automatic token refresh
- Secure session storage
- Session timeout handling
- Cross-platform session synchronization

## 🎯 User Flow

### Registration Flow
1. User fills out signup form
2. Client validates input (email, password strength, etc.)
3. Request sent to Supabase with sanitized data
4. Supabase sends confirmation email
5. User clicks confirmation link
6. Account activated and ready for login

### Login Flow
1. User enters email and password
2. Client validates input format
3. Authentication request sent to Supabase
4. On success, user session created
5. Automatic redirect to dashboard/main app
6. Session persisted across app restarts

### Logout Flow
1. User clicks sign out button
2. Confirmation dialog (mobile) or direct action (web)
3. Supabase session terminated
4. Local session data cleared
5. Redirect to login screen

## 🔧 Customization

### Styling
- **Mobile**: Modify `authStyles.ts` for custom themes
- **Web**: Update Tailwind classes in login/signup components
- **Colors**: Both platforms use consistent color schemes

### Validation Rules
- Modify validation functions in `shared/authService.ts`
- Update password requirements as needed
- Add custom validation rules

### Error Messages
- Customize error messages in `authService.ts`
- Add internationalization support
- Implement custom error handling

## 📋 API Reference

### Authentication Service Methods

```typescript
// Sign up new user
signUp(email: string, password: string, name?: string): Promise<AuthResponse>

// Sign in existing user
signIn(email: string, password: string): Promise<AuthResponse>

// Sign out current user
signOut(): Promise<AuthResponse>

// Get current user
getUser(): Promise<User | null>

// Reset password
resetPassword(email: string): Promise<AuthResponse>
```

### Auth Context Hook

```typescript
const { user, loading, signOut } = useAuth();

// user: Current user object or null
// loading: Boolean indicating auth state check
// signOut: Function to sign out current user
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` files are in correct locations
   - Restart development servers after adding env vars
   - Check variable naming (EXPO_PUBLIC_ vs NEXT_PUBLIC_)

2. **Email Confirmation Not Working**
   - Check Supabase email settings
   - Verify email templates are configured
   - Check spam folder for confirmation emails

3. **Authentication State Not Persisting**
   - Ensure Supabase client is properly configured
   - Check session storage settings
   - Verify auth context is wrapping entire app

4. **CORS Issues (Web)**
   - Configure allowed origins in Supabase dashboard
   - Check authentication settings in Supabase

### Debug Mode
Enable debug logging by adding to your environment:
```bash
SUPABASE_DEBUG=true
```

## 🚀 Deployment Considerations

### Environment Variables
- Use secure environment variable management
- Never commit sensitive keys to version control
- Use different Supabase projects for development/production

### Security Headers
- Implement proper CORS policies
- Use HTTPS in production
- Configure proper CSP headers

### Monitoring
- Monitor authentication failures
- Track user registration/login metrics
- Set up error reporting for auth issues

## 📞 Support

For issues related to:
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **React Native**: Check [Expo documentation](https://docs.expo.dev)
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)

---

## ✅ Completed Features

- ✅ Secure login and signup screens for mobile app
- ✅ Secure login and signup pages for web dashboard  
- ✅ Authentication context and protected routes (both platforms)
- ✅ Input validation and password strength requirements
- ✅ Comprehensive error handling and user feedback
- ✅ Session persistence and automatic refresh
- ✅ Email verification flow
- ✅ Sign out functionality with confirmation
- ✅ Responsive design and loading states
- ✅ Cross-platform shared authentication service

The authentication system is now fully implemented and ready for use! 🎉