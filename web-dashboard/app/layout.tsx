import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../../shared'

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
