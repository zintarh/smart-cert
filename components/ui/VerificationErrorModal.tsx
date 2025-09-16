'use client'

import React from 'react'
import { XCircle, AlertCircle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface VerificationErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: string
}

export function VerificationErrorModal({ 
  open, 
  onOpenChange, 
  message 
}: VerificationErrorModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verification Failed
        </h2>
        
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">
              {message}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Please check the certificate ID or contact support if you believe this is an error.
        </p>

        {/* Action Button */}
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </Modal>
  )
}
