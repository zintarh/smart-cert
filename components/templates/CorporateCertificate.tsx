import React from 'react'

interface CorporateCertificateProps {
  name: string
  course: string
  date: string
  issuer: string
  qrCodeUrl?: string
}

export function CorporateCertificate({ 
  name, 
  course, 
  date, 
  issuer, 
  qrCodeUrl 
}: CorporateCertificateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white relative overflow-hidden shadow-2xl" style={{ aspectRatio: '8.5/11' }}>
      {/* Professional Border */}
      <div className="absolute inset-4 border-4 border-slate-800"></div>
      <div className="absolute inset-6 border-2 border-slate-600"></div>
      <div className="absolute inset-8 border border-slate-400"></div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 w-40 h-40 border-2 border-slate-400 rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-32 h-32 border-2 border-slate-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-slate-400 rounded-full"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-slate-800 via-slate-900 to-gray-900 text-white py-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative z-10">
          <div className="text-6xl font-bold mb-4 tracking-wide">CERTIFICATE</div>
          <div className="text-2xl text-gray-300 font-light mb-4">OF PROFESSIONAL ACHIEVEMENT</div>
          <div className="w-40 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-20 py-16 text-center relative z-10">
        <div className="text-2xl text-gray-700 mb-10 font-light leading-relaxed">
          This is to certify that
        </div>
        
        <div className="text-6xl font-bold text-gray-900 mb-12 border-b-4 border-slate-600 pb-6 tracking-wide">
          {name}
        </div>
        
        <div className="text-2xl text-gray-700 mb-10 font-light leading-relaxed">
          has successfully completed the professional program
        </div>
        
        <div className="text-4xl font-semibold text-gray-900 mb-12 tracking-wide">
          {course}
        </div>
        
        <div className="text-2xl text-gray-700 mb-16 font-light leading-relaxed">
          Completed on {date}
        </div>
        
        {/* Professional Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-1 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full"></div>
          <div className="mx-6 w-2 h-2 bg-slate-600 rounded-full"></div>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-20 py-12 bg-gradient-to-r from-slate-50/90 to-gray-50/90 backdrop-blur-sm border-t-2 border-slate-200">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2 tracking-wide">
              {issuer}
            </div>
            <div className="text-sm text-gray-600 font-light">Professional Development Division</div>
          </div>
          
          {qrCodeUrl && (
            <div className="w-24 h-24 bg-white border-2 border-slate-300 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-xs text-gray-500 font-mono">QR</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
