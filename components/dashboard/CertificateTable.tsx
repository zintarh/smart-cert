'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface Certificate {
  id: string
  certificateId: string
  recipientName: string
  email: string
  course: string
  matricNo: string
  issueDate: string
  expiryDate?: string
  status: 'PENDING' | 'ISSUED' | 'VERIFIED' | 'REVOKED' | 'SUCCESS' | 'FAILED'
  template?: string
  signatoryLeft?: string
  signatoryRight?: string
  hash?: string
  createdAt: string
}

interface CertificateTableProps {
  data: Certificate[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function CertificateTable({ 
  data, 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading = false 
}: CertificateTableProps) {
  const [copiedHashes, setCopiedHashes] = useState<Set<string>>(new Set())

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ISSUED':
      case 'SUCCESS':
        return { color: 'bg-green-500', text: 'Success', textColor: 'text-green-800' }
      case 'VERIFIED':
        return { color: 'bg-blue-500', text: 'Verified', textColor: 'text-blue-800' }
      case 'PENDING':
        return { color: 'bg-orange-500', text: 'Pending', textColor: 'text-orange-800' }
      case 'REVOKED':
      case 'FAILED':
        return { color: 'bg-red-500', text: 'Failed', textColor: 'text-red-800' }
      default:
        return { color: 'bg-gray-500', text: 'Unknown', textColor: 'text-gray-800' }
    }
  }

  const handleCopyHash = async (hash: string, certificateId: string) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHashes(prev => new Set(prev).add(certificateId))
      toast.success('Hash copied to clipboard!')
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedHashes(prev => {
          const newSet = new Set(prev)
          newSet.delete(certificateId)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Failed to copy hash:', error)
      toast.error('Failed to copy hash')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const displayData = data

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Certificate ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Subject name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Matric No
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Hash
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((certificate) => {
              const statusInfo = getStatusInfo(certificate.status)
              const isCopied = copiedHashes.has(certificate.certificateId)
              const hash = certificate.hash || 'No hash available'
              
              return (
                <tr key={certificate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(certificate.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {certificate.certificateId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.recipientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {certificate.matricNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 font-mono max-w-32 truncate">
                        {hash}
                      </span>
                      <button
                        onClick={() => handleCopyHash(hash, certificate.certificateId)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy hash"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                      <span className={`text-sm font-medium ${statusInfo.textColor}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded text-sm font-medium ${
                currentPage === page
                  ? 'bg-smart-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}