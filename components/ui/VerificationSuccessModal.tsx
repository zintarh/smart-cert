'use client'

import React from 'react'
import { Check, Calendar, User, Award } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface VerificationSuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificateData?: {
    recipientName?: string;
    studentName?: string;
    course?: string;
    graduationYear?: string;
    unijos?: string;
    issuedAt?: string;
    issuer?: string;
  }
}

export function VerificationSuccessModal({ 
  open, 
  onOpenChange, 
  certificateData 
}: VerificationSuccessModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-smart-blue rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Certificate Verified Successfully!
        </h2>
        
        <p className="text-gray-600 mb-6">
          This certificate has been verified and is authentic.
        </p>

        {/* Certificate Details */}
        {certificateData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Certificate Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Recipient:</span>
                  <p className="font-medium text-gray-900">
                    {certificateData.recipientName || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Course:</span>
                  <p className="font-medium text-gray-900">
                    {certificateData.course || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Issued Date:</span>
                  <p className="font-medium text-gray-900">
                    {certificateData.issuedAt ? new Date(certificateData.issuedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => onOpenChange(false)}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </Modal>
  )
}
