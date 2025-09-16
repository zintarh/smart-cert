import React from 'react'

interface ModernCertificateProps {
  name: string
  course: string
  date: string
  issuer: string
  qrCodeUrl?: string
}

export function ModernCertificate({ 
  name, 
  course, 
  date, 
  issuer, 
  qrCodeUrl 
}: ModernCertificateProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white relative overflow-hidden shadow-2xl" style={{ aspectRatio: '8.5/11' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-indigo-100/30 to-transparent rounded-full translate-y-30 -translate-x-30"></div>
      
      {/* Decorative Border */}
      <div className="absolute inset-6 border-2 border-blue-200 rounded-lg"></div>
      <div className="absolute inset-8 border border-blue-100 rounded-lg"></div>
      
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-16 text-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="text-6xl font-bold mb-4 tracking-tight">CERTIFICATE</div>
          <div className="text-2xl font-light opacity-95 mb-4">OF COMPLETION</div>
          <div className="w-32 h-1 bg-white/40 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-20 py-16 text-center relative z-10">
        <div className="text-2xl text-gray-600 mb-10 font-light leading-relaxed">
          This certifies that
        </div>
        
        <div className="text-6xl font-bold mb-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          {name}
        </div>
        
        <div className="text-2xl text-gray-600 mb-10 font-light leading-relaxed">
          has successfully completed the program
        </div>
        
        <div className="text-4xl font-semibold text-gray-800 mb-12 tracking-wide">
          {course}
        </div>
        
        <div className="text-2xl text-gray-600 mb-16 font-light leading-relaxed">
          Awarded on {date}
        </div>
        
        {/* Decorative Line */}
        <div className="w-40 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-20 py-12 bg-gradient-to-r from-gray-50/80 to-slate-50/80 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-800 mb-2 tracking-wide">
              {issuer}
            </div>
            <div className="text-sm text-gray-600 font-light">Educational Institution</div>
          </div>
          
          {qrCodeUrl && (
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
              <div className="text-xs text-gray-500 font-mono">QR</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
