import React from 'react'
import { ClassicCertificate } from './ClassicCertificate'
import { ModernCertificate } from './ModernCertificate'
import { CorporateCertificate } from './CorporateCertificate'
import { HarvardStyleCertificate } from './HarvardStyleCertificate'

interface TemplatePickerProps {
  onSelectTemplate: (template: string) => void
  onBack: () => void
  onContinue: () => void
  selectedTemplate: string | null
  formData: {
    fullName: string
    matricNo: string
    course: string
    yearOfGraduation: string
    signatoryLeft?: string
    signatoryRight?: string
  }
}

export function TemplatePicker({ onSelectTemplate, onBack, onContinue, selectedTemplate, formData }: TemplatePickerProps) {

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      component: ClassicCertificate
    },
    {
      id: 'modern',
      name: 'Modern',
      component: ModernCertificate
    },
    {
      id: 'corporate',
      name: 'Corporate',
      component: CorporateCertificate
    },
    {
      id: 'harvard',
      name: 'Harvard Style',
      component: HarvardStyleCertificate
    }
  ]

  const sampleData = {
    name: formData.fullName || 'John Doe',
    course: formData.course || 'Computer Science',
    date: formData.yearOfGraduation || '2024',
    issuer: 'Unijos of Technology',
    signatoryLeft: formData.signatoryLeft || 'Dr. Sarah Johnson',
    signatoryRight: formData.signatoryRight || 'Prof. Michael Chen'
  }

  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose Certificate Template</h2>
        <p className="text-sm text-gray-600">Select a template for the certificate</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {templates.map((template) => {
          const TemplateComponent = template.component
          const isSelected = selectedTemplate === template.id
          
          return (
            <div
              key={template.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {/* Template Name */}
              <div className="mb-3 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              </div>
              
              {/* Certificate Preview */}
              <div className="bg-white rounded border border-gray-100 overflow-hidden h-64 flex items-center justify-center">
                <div className="transform scale-[0.35] origin-center">
                  <TemplateComponent {...sampleData} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          Back
        </button>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {selectedTemplate ? 'Template selected' : 'Click on a template to select it'}
          </div>
          <button
            onClick={onContinue}
            disabled={!selectedTemplate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
