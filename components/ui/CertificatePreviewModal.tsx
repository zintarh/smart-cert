'use client'

import React from 'react'
import { X, Download } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { ClassicCertificate } from '../templates/ClassicCertificate'
import { ModernCertificate } from '../templates/ModernCertificate'
import { CorporateCertificate } from '../templates/CorporateCertificate'
import { HarvardStyleCertificate } from '../templates/HarvardStyleCertificate'

interface CertificatePreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  certificateData: {
    certificateId: string
    recipientName: string
    email: string
    course: string
    matricNo: string
    yearOfGraduation: string
    template: string
    hash?: string
    signatoryLeft?: string
    signatoryRight?: string
  }
  onDownload: () => void
}

export function CertificatePreviewModal({ 
  open, 
  onOpenChange, 
  certificateData,
  onDownload 
}: CertificatePreviewModalProps) {
  
  const renderCertificate = () => {
    const certificateProps = {
      name: certificateData.recipientName,
      course: certificateData.course,
      date: certificateData.yearOfGraduation,
      issuer: 'University of Jos',
      signatoryLeft: certificateData.signatoryLeft || 'Dr. Sarah Johnson',
      signatoryRight: certificateData.signatoryRight || 'Prof. Michael Chen'
    }

    switch (certificateData.template) {
      case 'classic':
        return <ClassicCertificate {...certificateProps} />
      case 'modern':
        return <ModernCertificate {...certificateProps} />
      case 'corporate':
        return <CorporateCertificate {...certificateProps} />
      case 'harvard':
        return <HarvardStyleCertificate {...certificateProps} />
      default:
        return <HarvardStyleCertificate {...certificateProps} />
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-7xl max-h-[90vh] w-[95vw] h-[90vh]">
      <div className="flex flex-col h-full w-full overflow-hidden">
        {/* Header - Fixed Height */}
        <div className="flex items-center justify-between mb-4 p-4 pb-2 flex-shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">Certificate Preview</h2>
            <p className="text-sm text-gray-600 truncate">Review your certificate before downloading</p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              onClick={onDownload}
              className="bg-[#0F96E3] text-white hover:bg-[#0C7BBF] px-3 py-2 rounded-lg flex items-center space-x-1 text-xs whitespace-nowrap"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-3 py-2 rounded-lg flex items-center space-x-1 text-xs whitespace-nowrap"
            >
              <X className="w-3 h-3" />
              <span>Close</span>
            </Button>
          </div>
        </div>

        {/* Main Content - Flexible Height with Strict Overflow Control */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full p-4 pt-0">
            {/* Certificate Preview - Left Side */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <div className="flex-1 bg-gray-50 rounded-lg p-3 overflow-hidden">
                <div className="h-full w-full flex justify-center items-center">
                  <div 
                    className="transform scale-[0.3] sm:scale-[0.4] lg:scale-[0.5] xl:scale-[0.6] origin-center"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      width: 'fit-content',
                      height: 'fit-content'
                    }}
                  >
                    <div className="w-full h-full overflow-hidden">
                      {renderCertificate()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Details - Right Side */}
            <div className="lg:col-span-1 flex flex-col min-h-0">
              <div className="bg-gray-50 rounded-lg p-3 h-full overflow-hidden flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex-shrink-0">Certificate Details</h3>
                <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Certificate ID</span>
                    <p className="font-medium text-gray-900 text-xs truncate">{certificateData.certificateId}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Recipient</span>
                    <p className="font-medium text-gray-900 text-xs truncate">{certificateData.recipientName}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Course</span>
                    <p className="font-medium text-gray-900 text-xs truncate">{certificateData.course}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Matric No</span>
                    <p className="font-medium text-gray-900 text-xs truncate">{certificateData.matricNo}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Year of Graduation</span>
                    <p className="font-medium text-gray-900 text-xs truncate">{certificateData.yearOfGraduation}</p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Template</span>
                    <p className="font-medium text-gray-900 text-xs truncate capitalize">{certificateData.template}</p>
                  </div>
                  {certificateData.hash && (
                    <div className="min-w-0">
                      <span className="text-gray-500 block text-xs uppercase tracking-wide mb-1">Verification Hash</span>
                      <div className="bg-white p-2 rounded border overflow-hidden">
                        <p className="font-mono text-xs text-gray-700 break-all leading-tight">
                          {certificateData.hash}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
