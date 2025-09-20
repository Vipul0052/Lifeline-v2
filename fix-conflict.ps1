# PowerShell script to resolve merge conflict
# Run this from your project root directory

Write-Host "Resolving merge conflict in layout.tsx..." -ForegroundColor Green

# Create the correct layout.tsx content
$layoutContent = @"
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
"@

# Write the content to the file
$layoutContent | Out-File -FilePath "web-dashboard/app/layout.tsx" -Encoding UTF8

Write-Host "Layout.tsx file updated successfully!" -ForegroundColor Green

# Add and commit the changes
Write-Host "Adding and committing changes..." -ForegroundColor Yellow
git add web-dashboard/app/layout.tsx
git commit -m "Resolve merge conflict in layout.tsx - add AuthWrapper"

Write-Host "Pushing changes to main..." -ForegroundColor Yellow
git push origin main

Write-Host "Merge conflict resolved and pushed successfully!" -ForegroundColor Green
Write-Host "You can now run: cd web-dashboard && npm run dev" -ForegroundColor Cyan