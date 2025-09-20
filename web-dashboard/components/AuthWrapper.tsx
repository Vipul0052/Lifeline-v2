'use client'

import React from 'react'
import { AuthProvider, useAuth } from 'shared/authContext'
import { Shield, Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

function AuthContent({ children }: AuthWrapperProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return null
  }

  return <>{children}</>
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  )
}