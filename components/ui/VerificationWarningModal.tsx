'use client'

import React from 'react'
import { AlertTriangle, Shield } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

interface VerificationWarningModalProps {
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

export function VerificationWarningModal({ 
  open, 
  onOpenChange, 
  certificateData 
}: VerificationWarningModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-8 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Warning Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Certificate Verified by Unijos
        </h2>
        
        <p className="text-gray-600 mb-6">
          This certificate has been verified by the unijos&apos;s digital signature, 
          but it was not issued through SmartCert.
        </p>

        {/* Certificate Details */}
        {certificateData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Certificate Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Verification Status:</span>
                  <p className="font-medium text-yellow-600">Unijos Verified</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Issuer:</span>
                  <p className="font-medium text-gray-900">
                    {certificateData.issuer || 'Unijos'}
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
