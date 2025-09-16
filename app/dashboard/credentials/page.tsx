'use client'

import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { CertificateTable } from '@/components/dashboard/CertificateTable'
import { IssueCertificateModal } from '@/components/dashboard/IssueCertificateModal'
import { SuccessModal } from '@/components/ui/SuccessModal'
import { UploadCertificateModal } from '@/components/ui/UploadCertificateModal'
import { CertificateDetailsModal } from '@/components/ui/CertificateDetailsModal'
import { CertificatePreviewModal } from '@/components/ui/CertificatePreviewModal'
import { api } from '@/lib/api'

// Certificate interface matching the API response
interface Certificate {
  id: string
  certificateId: string
  recipientName: string
  email: string
  course: string
  matricNo: string
  issueDate: string
  expiryDate?: string
  status: 'PENDING' | 'ISSUED' | 'VERIFIED' | 'REVOKED'
  template?: string
  signatoryLeft?: string
  signatoryRight?: string
  hash?: string
  createdAt: string
}

export default function CredentialsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedCertificate] = useState<Certificate | null>(null)
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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [filters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  })

  // Load certificates
  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setIsLoading(true)
        const response = await api.getCertificates({
          page: currentPage,
          limit: 10,
          ...filters
        })
        
        if (response.success && response.data) {
          const data = response.data as {
            certificates: Certificate[];
            pagination: { pages: number };
          };
          setCertificates(data.certificates)
          setTotalPages(data.pagination.pages)
        }
      } catch (error) {
        console.error('Error loading certificates:', error)
        // Set empty array on error
        setCertificates([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCertificates()
  }, [currentPage, filters])


  const handleSuccess = (certificateId: string, recipientName: string, email: string, template: unknown, hash?: string, signatoryLeft?: string, signatoryRight?: string, course?: string, matricNo?: string, yearOfGraduation?: string) => {
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
    setIsSuccessModalOpen(true)
    console.log('Selected template:', template)
    console.log('Signatories:', { signatoryLeft, signatoryRight })
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



  return (
    <DashboardLayout title="Add Recipient">
      <div className="space-y-6">
        {/* Filter and Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
            
              
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent">
                  <option>Action type</option>
                  <option>All Actions</option>
                  <option>Issued</option>
                  <option>Verified</option>
                  <option>Revoked</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date range"
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Download Statement Button */}
            <Button className="bg-smart-blue text-white hover:bg-blue-600 flex items-center space-x-2 px-4 py-2">
              <Download className="w-4 h-4" />
              <span>Download statement</span>
            </Button>
          </div>
        </div>

        {/* Certificate Table */}
        <CertificateTable
          data={certificates}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />

        {/* Issue Certificate Modal */}
        <IssueCertificateModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleSuccess}
        />

        {/* Upload Certificate Modal */}
        <UploadCertificateModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onSuccess={handleSuccess}
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

        {/* Certificate Preview Modal */}
        {successData && (
          <CertificatePreviewModal
            open={isPreviewModalOpen}
            onOpenChange={setIsPreviewModalOpen}
            certificateData={successData}
            onDownload={handleDownload}
          />
        )}

        {/* Certificate Details Modal */}
        {selectedCertificate && (
          <CertificateDetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            certificate={selectedCertificate}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
