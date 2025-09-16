'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { IssueCertificateModal } from '@/components/dashboard/IssueCertificateModal'
import { UploadCertificateModal } from '@/components/ui/UploadCertificateModal'
import { VerificationModal } from '@/components/ui/VerificationModal'
import { SuccessModal } from '@/components/ui/SuccessModal'
import { CertificatePreviewModal } from '@/components/ui/CertificatePreviewModal'

interface ModalContextType {
  openIssueCertificateModal: () => void
  openUploadCertificateModal: () => void
  openVerificationModal: () => void
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [successData, setSuccessData] = useState<{
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
  } | null>(null)

  const openIssueCertificateModal = () => {
    setIsIssueModalOpen(true)
  }

  const openUploadCertificateModal = () => {
    setIsUploadModalOpen(true)
  }

  const openVerificationModal = () => {
    setIsVerificationModalOpen(true)
  }

  const closeAllModals = () => {
    setIsIssueModalOpen(false)
    setIsUploadModalOpen(false)
    setIsVerificationModalOpen(false)
    setIsSuccessModalOpen(false)
    setIsPreviewModalOpen(false)
  }

  const handleIssueSuccess = (
    certificateId: string,
    recipientName: string,
    email: string,
    template: unknown,
    hash?: string,
    signatoryLeft?: string,
    signatoryRight?: string,
    course?: string,
    matricNo?: string,
    yearOfGraduation?: string
  ) => {
    setSuccessData({
      certificateId,
      recipientName,
      email,
      course: course || 'Computer Science',
      matricNo: matricNo || email.split('@')[0],
      yearOfGraduation: yearOfGraduation || '2024',
      template: template as string,
      hash,
      signatoryLeft,
      signatoryRight
    })
    setIsIssueModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleUploadSuccess = (
    certificateId: string,
    recipientName: string,
    email: string,
    template: unknown,
    hash?: string,
    signatoryLeft?: string,
    signatoryRight?: string
  ) => {
    setSuccessData({
      certificateId,
      recipientName,
      email,
      course: 'Computer Science',
      matricNo: email.split('@')[0],
      yearOfGraduation: '2024',
      template: template as string,
      hash,
      signatoryLeft,
      signatoryRight
    })
    setIsUploadModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handlePreview = () => {
    if (successData) {
      setIsSuccessModalOpen(false)
      setIsPreviewModalOpen(true)
    }
  }

  const handleDownload = () => {
    console.log('Download certificate:', successData?.certificateId)
  }

  const value: ModalContextType = {
    openIssueCertificateModal,
    openUploadCertificateModal,
    openVerificationModal,
    closeAllModals
  }

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Global Modals */}
      <IssueCertificateModal
        open={isIssueModalOpen}
        onOpenChange={setIsIssueModalOpen}
        onSuccess={handleIssueSuccess}
      />

      <UploadCertificateModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onSuccess={handleUploadSuccess}
      />

      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      />

      {successData && (
        <SuccessModal
          open={isSuccessModalOpen}
          onOpenChange={setIsSuccessModalOpen}
          certificateId={successData.certificateId}
          recipientName={successData.recipientName}
          email={successData.email}
          course={successData.course}
          matricNo={successData.matricNo}
          yearOfGraduation={successData.yearOfGraduation}
          template={successData.template}
          hash={successData.hash}
          signatoryLeft={successData.signatoryLeft}
          signatoryRight={successData.signatoryRight}
          onPreview={handlePreview}
          onDownload={handleDownload}
        />
      )}

      {successData && (
        <CertificatePreviewModal
          open={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          certificateData={successData}
          onDownload={handleDownload}
        />
      )}
    </ModalContext.Provider>
  )
}
