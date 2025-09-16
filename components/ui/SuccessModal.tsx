'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificateId: string
  recipientName: string
  email: string
  hash?: string
  onPreview: () => void
  onDownload: () => void
}

export function SuccessModal({ 
  open, 
  onOpenChange, 
  certificateId, 
  recipientName, 
  email, 
  hash,
  onPreview, 
  onDownload 
}: SuccessModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-smart-blue rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Certificate Issued Successfully!
        </h2>
        
        <div className="space-y-3 mb-8 text-left">
          <div>
            <span className="text-sm text-gray-500">Certificate ID:</span>
            <p className="font-medium text-gray-900">{certificateId}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Recipient:</span>
            <p className="font-medium text-gray-900">{recipientName}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email:</span>
            <p className="font-medium text-gray-900">{email}</p>
          </div>
          {hash && (
            <div>
              <span className="text-sm text-gray-500">Verification Hash:</span>
              <p className="font-mono text-xs text-gray-700 bg-gray-100 p-2 rounded break-all">
                {hash}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Use this hash to verify the certificate
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onPreview}
            className="flex-1"
          >
            Preview
          </Button>
          <Button
            onClick={onDownload}
            className="flex-1"
          >
            Download
          </Button>
        </div>
      </div>
    </Modal>
  )
}
