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
