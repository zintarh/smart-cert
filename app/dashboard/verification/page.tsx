'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Lock } from 'lucide-react';
import { VerificationErrorModal, VerificationSuccessModal, VerificationWarningModal } from '@/components/ui';
import { CertificatePreviewModal } from '@/components/ui/CertificatePreviewModal';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const verificationSchema = z.object({
  certificateId: z.string().min(1, 'Please enter a certificate ID, blockchain hash, or student name'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function VerificationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    certificateData?: {
      id?: string;
      certificateId?: string;
      recipientName?: string;
      studentName?: string;
      course?: string;
      graduationYear?: string;
      unijos?: string;
      issuedAt?: string;
      issuer?: string;
      blockchainHash?: string;
      digitalSignature?: string;
      email?: string;
      matricNo?: string;
      template?: string;
      hash?: string;
    };
  } | null>(null);

  const {
    register,
    handleSubmit,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsVerifying(true);
    
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificateId: data.certificateId
        })
      });

      const result = await response.json();
      
      if (result.success && result.isValid) {
        setVerificationResult({
          isValid: true,
          message: result.message,
          certificateData: result.certificateData
        });
        setIsSuccessModalOpen(true);
      } else {
        setVerificationResult({
          isValid: false,
          message: result.message,
          certificateData: undefined
        });
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        message: 'An error occurred during verification. Please try again.',
        certificateData: undefined
      });
      setIsErrorModalOpen(true);
    }
    
    setIsVerifying(false);
  };

  const handleViewCertificate = () => {
    if (verificationResult?.certificateData) {
      setIsSuccessModalOpen(false);
      setIsPreviewModalOpen(true);
    }
  };

  const handleDownload = () => {
    console.log('Download certificate:', verificationResult?.certificateData);
  };

  // Transform verification data to preview modal format
  const getPreviewData = () => {
    if (!verificationResult?.certificateData) return null;
    
    const data = verificationResult.certificateData;
    return {
      certificateId: data.certificateId || 'N/A',
      recipientName: data.recipientName || data.studentName || 'N/A',
      email: data.email || 'N/A',
      course: data.course || 'N/A',
      matricNo: data.matricNo || 'N/A',
      yearOfGraduation: data.graduationYear || 'N/A',
      template: data.template || 'harvard', // Default to harvard if not specified
      hash: data.hash || data.blockchainHash,
      signatoryLeft: 'Dr. Sarah Johnson', // Default signatories
      signatoryRight: 'Prof. Michael Chen'
    };
  };


  return (
    <DashboardLayout title="Verify certificate">
      <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-16">
        <div className="w-full max-w-2xl">
          {/* Verify Certificate Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Card Header */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify Certificate</h1>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Certificate ID, Blockchain Hash, or Student Name
                </label>
                <div className="flex space-x-3">
                  <input
                    {...register('certificateId')}
                    placeholder="Cert001 or 0x1a2b"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-6 py-3 bg-[#0F96E3] hover:bg-[#0C7BBF] text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            </form>

            {/* How Verification Works Section */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-[#0F96E3] flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-[#0F96E3] mb-3">How Verification Works</h2>
                  <ul className="space-y-2 text-sm text-[#0F96E3]">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#0F96E3] rounded-full mr-3 flex-shrink-0"></span>
                      <span>Certificates are stored immutably on the blockchain</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#0F96E3] rounded-full mr-3 flex-shrink-0"></span>
                      <span>IPFS ensures document integrity and availability</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#0F96E3] rounded-full mr-3 flex-shrink-0"></span>
                      <span>Cryptographic hashes prevent tampering</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-[#0F96E3] rounded-full mr-3 flex-shrink-0"></span>
                      <span>Real-time verification in seconds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Success Modal */}
      <VerificationSuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        certificateData={verificationResult?.certificateData}
        onViewCertificate={handleViewCertificate}
      />

      {/* Verification Warning Modal */}
      <VerificationWarningModal
        open={isWarningModalOpen}
        onOpenChange={setIsWarningModalOpen}
        certificateData={verificationResult?.certificateData}
      />

      {/* Verification Error Modal */}
      <VerificationErrorModal
        open={isErrorModalOpen}
        onOpenChange={setIsErrorModalOpen}
        message={verificationResult?.message || 'Certificate not found or invalid.'}
      />

      {/* Certificate Preview Modal */}
      {getPreviewData() && (
        <CertificatePreviewModal
          open={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          certificateData={getPreviewData()!}
          onDownload={handleDownload}
        />
      )}
    </DashboardLayout>
  );
}