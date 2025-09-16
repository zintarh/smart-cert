import React from 'react'

interface ClassicCertificateProps {
  name: string
  course: string
  date: string
  issuer: string
  qrCodeUrl?: string
}

export function ClassicCertificate({ 
  name, 
  course, 
  date, 
  issuer, 
  qrCodeUrl 
}: ClassicCertificateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white relative overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
      {/* Decorative Border */}
      <div className="absolute inset-4 border-4 border-amber-600"></div>
      <div className="absolute inset-6 border-2 border-amber-400"></div>
      <div className="absolute inset-8 border border-amber-300"></div>
      
      {/* Corner Decorations */}
      <div className="absolute top-6 left-6 w-12 h-12">
        <div className="w-full h-full border-l-4 border-t-4 border-amber-700"></div>
      </div>
      <div className="absolute top-6 right-6 w-12 h-12">
        <div className="w-full h-full border-r-4 border-t-4 border-amber-700"></div>
      </div>
      <div className="absolute bottom-6 left-6 w-12 h-12">
        <div className="w-full h-full border-l-4 border-b-4 border-amber-700"></div>
      </div>
      <div className="absolute bottom-6 right-6 w-12 h-12">
        <div className="w-full h-full border-r-4 border-b-4 border-amber-700"></div>
      </div>

      {/* Header */}
      <div className="text-center py-12 relative z-10">
        <div className="text-5xl font-serif text-amber-800 mb-3 tracking-wider font-bold">CERTIFICATE</div>
        <div className="text-2xl font-serif text-amber-700 mb-4 tracking-wide">OF ACHIEVEMENT</div>
        <div className="w-40 h-1 bg-amber-500 mx-auto"></div>
      </div>

      {/* Main Content */}
      <div className="px-16 py-8 text-center relative z-10">
        <div className="text-xl text-gray-700 mb-8 font-light leading-relaxed">
          This is to certify that
        </div>
        
        <div className="text-5xl font-serif text-gray-900 mb-10 border-b-4 border-amber-500 pb-6 tracking-wide font-bold">
          {name}
        </div>
        
        <div className="text-xl text-gray-700 mb-8 font-light leading-relaxed">
          has successfully completed the course of study in
        </div>
        
        <div className="text-3xl font-serif text-gray-900 mb-10 tracking-wide font-semibold">
          {course}
        </div>
        
        <div className="text-xl text-gray-700 mb-8 font-light leading-relaxed">
          and is hereby awarded this certificate on
        </div>
        
        <div className="text-2xl font-serif text-gray-900 mb-12 tracking-wide font-semibold">
          {date}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-16 py-8 border-t-4 border-amber-300">
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="text-2xl font-serif text-gray-900 mb-2 tracking-wide font-semibold">
              {issuer}
            </div>
            <div className="text-sm text-gray-600 font-light">Educational Institution</div>
          </div>
          
          {qrCodeUrl && (
            <div className="w-20 h-20 bg-gray-100 border-2 border-gray-300 flex items-center justify-center rounded">
              <div className="text-xs text-gray-500 font-mono">QR</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
