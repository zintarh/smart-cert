'use client'

import React, { useState } from 'react'
import { Download, X } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { CertificateViewer } from '@/components/certificates/CertificateViewer'
import { exportCertificateAsPDF } from '@/lib/pdfExport'

interface CertificateDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificate: {
    id: string
    certificateId: string
    recipientName: string
    email: string
    course: string
    matricNo: string
    issueDate: string
    expiryDate?: string
    template?: string
    signatoryLeft?: string
    signatoryRight?: string
    hash?: string
  }
}

export function CertificateDetailsModal({ 
  open, 
  onOpenChange, 
  certificate 
}: CertificateDetailsModalProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      await exportCertificateAsPDF(
        'certificate-details-view',
        `${certificate.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`
      )
    } catch (error) {
      console.error('Error exporting certificate:', error)
      alert('Failed to export certificate. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
            <p className="text-gray-600">Certificate ID: {certificate.certificateId}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleDownload}
              isLoading={isExporting}
              loadingText="Exporting..."
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </Button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="flex justify-center mb-6">
          <div id="certificate-details-view" className="max-w-xl">
            <CertificateViewer 
              certificate={certificate} 
              showQRCode={true}
            />
          </div>
        </div>

        {/* Certificate Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recipient:</span>
              <p className="font-medium text-gray-900">{certificate.recipientName}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium text-gray-900">{certificate.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Course:</span>
              <p className="font-medium text-gray-900">{certificate.course}</p>
            </div>
            <div>
              <span className="text-gray-600">Matric No:</span>
              <p className="font-medium text-gray-900">{certificate.matricNo}</p>
            </div>
            <div>
              <span className="text-gray-600">Issue Date:</span>
              <p className="font-medium text-gray-900">
                {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Template:</span>
              <p className="font-medium text-gray-900 capitalize">
                {certificate.template || 'Classic'}
              </p>
            </div>
            {certificate.signatoryLeft && (
              <div>
                <span className="text-gray-600">Left Signatory:</span>
                <p className="font-medium text-gray-900">{certificate.signatoryLeft}</p>
              </div>
            )}
            {certificate.signatoryRight && (
              <div>
                <span className="text-gray-600">Right Signatory:</span>
                <p className="font-medium text-gray-900">{certificate.signatoryRight}</p>
              </div>
            )}
            {certificate.hash && (
              <div className="col-span-2">
                <span className="text-gray-600">Verification Hash:</span>
                <p className="font-mono text-xs text-gray-700 bg-white p-2 rounded break-all">
                  {certificate.hash}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
