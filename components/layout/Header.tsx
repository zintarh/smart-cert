'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Eye, Plus, User, ChevronDown, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useModal } from '@/contexts/ModalContext'

interface HeaderProps {
  title: string
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Header({ title, user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCertificateDropdownOpen, setIsCertificateDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const certificateDropdownRef = useRef<HTMLDivElement>(null)
  const { openIssueCertificateModal, openUploadCertificateModal, openVerificationModal } = useModal()

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (certificateDropdownRef.current && !certificateDropdownRef.current.contains(event.target as Node)) {
        setIsCertificateDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={openVerificationModal}
            >
              <Eye className="w-4 h-4" />
              <span>Verify Certificate</span>
            </Button>
            
            {/* Certificate Dropdown */}
            <div className="relative" ref={certificateDropdownRef}>
              <Button 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => setIsCertificateDropdownOpen(!isCertificateDropdownOpen)}
              >
                <Plus className="w-4 h-4" />
                <span>Issue Certificate</span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {isCertificateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => {
                      openIssueCertificateModal()
                      setIsCertificateDropdownOpen(false)
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Issue Certificate</span>
                  </button>
                  {/* <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => {
                      openUploadCertificateModal()
                      setIsCertificateDropdownOpen(false)
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Certificate</span>
                  </button> */}
                </div>
              )}
            </div>
          </div>

        

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-smart-blue rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-black " />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || 'Admin User'}
                </p>
             
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </button>
            
                <hr className="my-1" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}