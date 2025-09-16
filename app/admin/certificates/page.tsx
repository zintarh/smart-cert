'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Download, Eye, ArrowLeft, FileText } from 'lucide-react'
import { Button, Input, Select } from '@/components/ui'
import { TemplatePicker } from '@/components/templates/TemplatePicker'
import { ClassicCertificate, ModernCertificate, CorporateCertificate, HarvardStyleCertificate } from '@/components/templates'
import { exportCertificateAsPDF, generateQRCode } from '@/lib/pdfExport'

const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  course: z.string().min(1, 'Course is required'),
  date: z.string().min(1, 'Date is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  signatoryLeft: z.string().min(1, 'Left signatory is required'),
  signatoryRight: z.string().min(1, 'Right signatory is required'),
})

type CertificateFormData = z.infer<typeof certificateSchema>

type TemplateType = 'classic' | 'modern' | 'corporate' | 'harvard'

export default function AdminCertificatesPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'template' | 'preview'>('form')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
  const [formData, setFormData] = useState<CertificateFormData | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  })

  // const watchedData = watch() // Removed unused variable

  const courseOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Law', label: 'Law' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Science', label: 'Science' },
  ]

  const handleFormSubmit = async (data: CertificateFormData) => {
    setFormData(data)
    
    // Generate QR code
    try {
      const qrCode = await generateQRCode()
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
    
    setCurrentStep('template')
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template as TemplateType)
    setCurrentStep('preview')
  }

  const handleBack = () => {
    if (currentStep === 'template') {
      setCurrentStep('form')
    } else if (currentStep === 'preview') {
      setCurrentStep('template')
    }
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      setCurrentStep('preview')
    }
  }

  const handleExportPDF = async () => {
    if (!selectedTemplate || !formData) return

    setIsExporting(true)
    try {
      await exportCertificateAsPDF(
        'certificate-preview',
        `${formData.name.replace(/\s+/g, '_')}_Certificate.pdf`
      )
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const renderCertificate = () => {
    if (!selectedTemplate || !formData) return null

    const certificateProps = {
      name: formData.name,
      course: formData.course,
      date: formData.date,
      issuer: formData.issuer,
      qrCodeUrl: qrCodeUrl,
    }

    switch (selectedTemplate) {
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
            signatoryLeft={formData.signatoryLeft}
            signatoryRight={formData.signatoryRight}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
                <p className="text-sm text-gray-600">Create and manage certificates</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'form' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Details</h2>
                <p className="text-gray-600">Enter the details for the certificate</p>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    {...register('name')}
                    label="Recipient Name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                  />
                  
                  <Select
                    {...register('course')}
                    label="Course/Program"
                    options={courseOptions}
                    placeholder="Select course"
                    error={errors.course?.message}
                  />
                  
                  <Input
                    {...register('date')}
                    label="Issue Date"
                    type="date"
                    error={errors.date?.message}
                  />
                  
                  <Input
                    {...register('issuer')}
                    label="Issuing Institution"
                    placeholder="Unijos of Technology"
                    error={errors.issuer?.message}
                  />
                  
                  <Input
                    {...register('signatoryLeft')}
                    label="Left Signatory"
                    placeholder="Dr. Sarah Johnson"
                    error={errors.signatoryLeft?.message}
                  />
                  
                  <Input
                    {...register('signatoryRight')}
                    label="Right Signatory"
                    placeholder="Prof. Michael Chen"
                    error={errors.signatoryRight?.message}
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="submit" className="px-8 py-3">
                    <Eye className="w-4 h-4 mr-2" />
                    Choose Template
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 'template' && formData && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border">
              <TemplatePicker
                onSelectTemplate={handleTemplateSelect}
                onBack={handleBack}
                onContinue={handleContinue}
                selectedTemplate={selectedTemplate}
                formData={{
                  fullName: formData.name,
                  matricNo: 'N/A',
                  course: formData.course,
                  yearOfGraduation: formData.date,
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 'preview' && selectedTemplate && formData && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Preview</h2>
                  <p className="text-gray-600">Review your certificate before exporting</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Change Template</span>
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    isLoading={isExporting}
                    loadingText="Exporting..."
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </Button>
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="flex justify-center">
                <div id="certificate-preview" className="max-w-4xl">
                  {renderCertificate()}
                </div>
              </div>

              {/* Certificate Details */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Course:</span>
                    <p className="font-medium text-gray-900">{formData.course}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium text-gray-900">{formData.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Issuer:</span>
                    <p className="font-medium text-gray-900">{formData.issuer}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Left Signatory:</span>
                    <p className="font-medium text-gray-900">{formData.signatoryLeft}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Right Signatory:</span>
                    <p className="font-medium text-gray-900">{formData.signatoryRight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
