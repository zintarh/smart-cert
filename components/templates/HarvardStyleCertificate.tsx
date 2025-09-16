import React from 'react'

interface HarvardStyleCertificateProps {
  name: string
  course: string
  date: string
  issuer: string
  signatoryLeft: string
  signatoryRight: string
  qrCodeUrl?: string
}

export function HarvardStyleCertificate({ 
  name, 
  course, 
  date, 
  issuer, 
  signatoryLeft,
  signatoryRight,
  qrCodeUrl 
}: HarvardStyleCertificateProps) {
  return (
    <div 
      className="w-full bg-white relative overflow-hidden shadow-2xl"
      style={{ 
        aspectRatio: '11/8.5',
        width: '11in',
        height: '8.5in',
        maxWidth: '100%'
      }}
    >
      {/* Watermark Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-serif text-gray-400 select-none">
          {issuer}
        </div>
      </div>

      {/* Outer Border */}
      <div className="absolute inset-8 border-4 border-gray-800"></div>
      
      {/* Inner Border */}
      <div className="absolute inset-12 border-2 border-gray-600"></div>
      
      {/* Ornamental Corner Decorations */}
      <div className="absolute top-12 left-12 w-16 h-16">
        <div className="w-full h-full border-l-4 border-t-4 border-gray-800"></div>
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-gray-600"></div>
      </div>
      <div className="absolute top-12 right-12 w-16 h-16">
        <div className="w-full h-full border-r-4 border-t-4 border-gray-800"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-gray-600"></div>
      </div>
      <div className="absolute bottom-12 left-12 w-16 h-16">
        <div className="w-full h-full border-l-4 border-b-4 border-gray-800"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-gray-600"></div>
      </div>
      <div className="absolute bottom-12 right-12 w-16 h-16">
        <div className="w-full h-full border-r-4 border-b-4 border-gray-800"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-gray-600"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-20 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-6xl font-serif text-gray-900 mb-4 tracking-widest font-bold">
            CERTIFICATE
          </div>
          <div className="text-3xl font-serif text-gray-700 mb-6 tracking-wide">
            OF COMPLETION
          </div>
          <div className="w-32 h-1 bg-gray-800 mx-auto"></div>
        </div>

        {/* Main Text */}
        <div className="text-center mb-16 max-w-4xl">
          <div className="text-2xl text-gray-700 mb-8 font-light leading-relaxed">
            This is to certify that
          </div>
          
          <div className="text-7xl font-serif text-gray-900 mb-12 font-bold tracking-wide">
            {name}
          </div>
          
          <div className="text-2xl text-gray-700 mb-8 font-light leading-relaxed">
            has successfully completed the course of study in
          </div>
          
          <div className="text-4xl font-serif text-gray-800 mb-12 italic font-medium">
            {course}
          </div>
          
          <div className="text-2xl text-gray-700 mb-8 font-light leading-relaxed">
            and is hereby awarded this certificate on
          </div>
          
          <div className="text-3xl font-serif text-gray-900 mb-16 font-semibold">
            {date}
          </div>
        </div>

        {/* Institution Name */}
        <div className="text-center mb-12">
          <div className="text-3xl font-serif text-gray-900 font-bold tracking-wide">
            {issuer}
          </div>
        </div>

        {/* Signatures Section */}
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-end">
            {/* Left Signature */}
            <div className="text-center flex-1">
              <div className="w-48 h-16 border-b-2 border-gray-400 mx-auto mb-2"></div>
              <div className="text-lg font-serif text-gray-700 font-medium">
                {signatoryLeft}
              </div>
              <div className="text-sm text-gray-600 font-light">
                Dean of Academic Affairs
              </div>
            </div>

            {/* Center Spacing */}
            <div className="flex-1"></div>

            {/* Right Signature */}
            <div className="text-center flex-1">
              <div className="w-48 h-16 border-b-2 border-gray-400 mx-auto mb-2"></div>
              <div className="text-lg font-serif text-gray-700 font-medium">
                {signatoryRight}
              </div>
              <div className="text-sm text-gray-600 font-light">
                President
              </div>
            </div>
          </div>
        </div>

        {/* QR Code (if provided) */}
        {qrCodeUrl && (
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-white border-2 border-gray-300 rounded flex items-center justify-center shadow-sm">
            <div className="text-xs text-gray-500 font-mono">QR</div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-8 w-1 h-32 bg-gray-300"></div>
      <div className="absolute top-1/2 right-8 w-1 h-32 bg-gray-300"></div>
      
      {/* Bottom Border Accent */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800"></div>
    </div>
  )
}
