'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  FileText, 
  Shield, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onLogout?: () => void
}

const navigationItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Credentials', href: '/dashboard/credentials', icon: FileText },
  { name: 'Verify Certificate', href: '/dashboard/verification', icon: Shield },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' })
      // Also call the passed onLogout if provided (for backward compatibility)
      onLogout?.()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="w-64 h-screen flex flex-col" style={{ backgroundColor: '#08001F' }}>
     
      <div className="flex items-center space-x-3 p-6">
        <div className="relative w-10 h-10">
          <Image src="/logo.svg" alt="SmartCert" width={40} height={40} />
        </div>
        <span className="text-xl font-bold text-white">SmartCert</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-r-lg transition-colors",
                isActive
                  ? "bg-smart-blue text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  )
}