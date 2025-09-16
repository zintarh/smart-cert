'use client'

import React from 'react'
import { Check, FileText, Download } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificateId: string
  recipientName: string
  email: string
  course?: string
  matricNo?: string
  yearOfGraduation?: string
  template?: string
  hash?: string
  signatoryLeft?: string
  signatoryRight?: string
  onPreview: () => void
  onDownload: () => void
}

export function SuccessModal({ 
  open, 
  onOpenChange, 
  certificateId, 
  recipientName, 
  email, 
  course,
  matricNo,
  yearOfGraduation,
  template,
  hash,
  signatoryLeft,
  signatoryRight,
  onPreview, 
  onDownload 
}: SuccessModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0F96E3] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Certificate Information */}
        <div className="mb-4">
          <p className="text-lg font-bold underline text-gray-900">
            Certificate #{certificateId}
          </p>
          <p className="text-lg font-bold underline text-gray-900">
            successfully generated for {recipientName}
          </p>
        </div>

        {/* Invitation Message */}
        <p className="text-sm text-gray-500 mb-8">
          An invitation email has been sent to {email} to activate their account.
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-4 justify-center">
          <Button
            onClick={onPreview}
            className="bg-[#0F96E3] text-white hover:bg-[#0C7BBF] px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Preview</span>
          </Button>
          <Button
            onClick={onDownload}
            className="bg-[#0F96E3] text-white hover:bg-[#0C7BBF] px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
