'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, FileText } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input, Select } from './index'
import { api } from '@/lib/api'

const uploadCertificateSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  email: z.string().email('Valid email is required'),
  course: z.string().min(1, 'Course is required'),
  matricNo: z.string().min(1, 'Matriculation number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  template: z.string().min(1, 'Template is required'),
  signatoryLeft: z.string().min(1, 'Left signatory is required'),
  signatoryRight: z.string().min(1, 'Right signatory is required'),
})

type UploadCertificateFormData = z.infer<typeof uploadCertificateSchema>

interface UploadCertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (certificateId: string, recipientName: string, email: string, template: string, hash?: string, signatoryLeft?: string, signatoryRight?: string) => void
}

export function UploadCertificateModal({ open, onOpenChange, onSuccess }: UploadCertificateModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadCertificateFormData>({
    resolver: zodResolver(uploadCertificateSchema),
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const onSubmit = async (data: UploadCertificateFormData) => {
    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    setIsSubmitting(true)
    try {
      // Transform data to match API expectations
      const apiData = {
        recipientName: data.recipientName,
        email: data.email,
        course: data.course,
        matricNo: data.matricNo,
        issueDate: data.issueDate,
        expiryDate: data.expiryDate || new Date(new Date().getFullYear() + 5, 11, 31).toISOString().split('T')[0],
        template: data.template,
        signatoryLeft: data.signatoryLeft,
        signatoryRight: data.signatoryRight
      }

      // Call the API to create certificate
      const response = await api.createCertificate(apiData)
      
      if (response.success && response.data) {
        const responseData = response.data as {
          certificateId: string;
          hash: string;
        }
        onSuccess(
          responseData.certificateId, 
          data.recipientName, 
          data.email, 
          data.template,
          responseData.hash,
          data.signatoryLeft,
          data.signatoryRight
        )
        reset()
        setSelectedFile(null)
        onOpenChange(false)
      } else {
        throw new Error(response.message || 'Failed to create certificate')
      }
    } catch (error) {
      console.error('Error uploading certificate:', error)
      alert('Failed to upload certificate. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const courseOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Law', label: 'Law' },
  ]

  const templateOptions = [
    { value: 'classic', label: 'Classic' },
    { value: 'modern', label: 'Modern' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'harvard', label: 'Harvard Style' },
  ]

  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-smart-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Certificate
          </h2>
          <p className="text-gray-600">
            Upload an existing certificate and provide the details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-smart-blue transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileText className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, PNG, JPG up to 10MB
              </span>
            </label>
          </div>

          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-smart-blue" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('recipientName')}
              label="Recipient Name"
              placeholder="John Doe"
              error={errors.recipientName?.message}
            />
            
            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="john@unijos.edu"
              error={errors.email?.message}
            />
            
            <Select
              {...register('course')}
              label="Course"
              options={courseOptions}
              placeholder="Select course"
              error={errors.course?.message}
            />
            
            <Input
              {...register('matricNo')}
              label="Matriculation Number"
              placeholder="CSC/2017/045"
              error={errors.matricNo?.message}
            />
            
            <Input
              {...register('issueDate')}
              label="Issue Date"
              type="date"
              error={errors.issueDate?.message}
            />
            
            <Input
              {...register('expiryDate')}
              label="Expiry Date (Optional)"
              type="date"
              error={errors.expiryDate?.message}
            />
            
            <Select
              {...register('template')}
              label="Template"
              options={templateOptions}
              placeholder="Select template"
              error={errors.template?.message}
            />
            
            <div></div>
            
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

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              isLoading={isSubmitting}
              loadingText="Uploading..."
              className="flex-1"
            >
              Upload Certificate
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
