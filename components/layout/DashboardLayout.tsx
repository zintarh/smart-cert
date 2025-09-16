'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  onIssueCertificate?: () => void
  onUploadCertificate?: () => void
}

export function DashboardLayout({ 
  children, 
  title, 
  onIssueCertificate, 
  onUploadCertificate 
}: DashboardLayoutProps) {
  const { data: session, status } = useSession()

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 h-screen bg-gray-800 animate-pulse"></div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-gray-200 animate-pulse"></div>
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          title={title}
          user={session?.user || { name: '', email: '', image: '' }}
          onIssueCertificate={onIssueCertificate}
          onUploadCertificate={onUploadCertificate}
        />
        <main className="flex-1 p-20">
          {children}
        </main>
      </div>
    </div>
  )
}
