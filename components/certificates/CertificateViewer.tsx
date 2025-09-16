'use client'

import React from 'react'
import { ClassicCertificate } from '@/components/templates/ClassicCertificate'
import { ModernCertificate } from '@/components/templates/ModernCertificate'
import { CorporateCertificate } from '@/components/templates/CorporateCertificate'
import { HarvardStyleCertificate } from '@/components/templates/HarvardStyleCertificate'

interface CertificateData {
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

interface CertificateViewerProps {
  certificate: CertificateData
  showQRCode?: boolean
  className?: string
}

export function CertificateViewer({ 
  certificate, 
  showQRCode = false, 
  className = '' 
}: CertificateViewerProps) {
  const certificateProps = {
    name: certificate.recipientName,
    course: certificate.course,
    date: new Date(certificate.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    issuer: 'Unijos',
    qrCodeUrl: showQRCode && certificate.hash ? 
      `data:image/svg+xml;base64,${btoa(`
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="white"/>
          <rect x="10" y="10" width="80" height="80" fill="black"/>
          <rect x="20" y="20" width="60" height="60" fill="white"/>
          <rect x="30" y="30" width="40" height="40" fill="black"/>
          <text x="50" y="70" text-anchor="middle" font-size="8" fill="white">QR</text>
        </svg>
      `)}` : undefined
  }

  const renderCertificate = () => {
    switch (certificate.template) {
      case 'classic':
        return <ClassicCertificate {...certificateProps} />
      case 'modern':
        return <ModernCertificate {...certificateProps} />
      case 'corporate':
        return <CorporateCertificate {...certificateProps} />
      case 'harvard':
        return (
          <HarvardStyleCertificate 
            {...certificateProps}
            signatoryLeft={certificate.signatoryLeft || 'Dr. John Doe'}
            signatoryRight={certificate.signatoryRight || 'Prof. Jane Smith'}
          />
        )
      default:
        return <ClassicCertificate {...certificateProps} />
    }
  }

  return (
    <div className={`certificate-viewer ${className}`}>
      {renderCertificate()}
    </div>
  )
}
