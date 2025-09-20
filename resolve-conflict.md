# Resolve Merge Conflict - Quick Fix

## The Problem
You have a merge conflict in `web-dashboard/app/layout.tsx` because your local version doesn't have the authentication wrapper.

## Quick Solution

### Step 1: Replace the layout.tsx file content
Open `web-dashboard/app/layout.tsx` and replace ALL content with this:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import AuthWrapper from '@/components/AuthWrapper'

export const metadata: Metadata = {
  title: 'Lifeline IoT Emergency System',
  description: 'Emergency response dashboard for IoT devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
```

### Step 2: Complete the merge
Run these commands in your terminal:

```bash
# Add the resolved file
git add web-dashboard/app/layout.tsx

# Complete the merge
git commit -m "Resolve merge conflict in layout.tsx - add AuthWrapper"

# Push the changes
git push origin main
```

### Step 3: Verify everything works
```bash
cd web-dashboard
npm install
npm run dev
```

## What this does:
- Adds the AuthWrapper component that handles authentication
- Ensures users are redirected to login when not authenticated
- Maintains the existing metadata and styling

## If you still have issues:
1. Make sure you have all the authentication files
2. Check that your `.env` file has the Supabase credentials
3. Run `npm install` in both `web-dashboard` and `mobile-app` directories