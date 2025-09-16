'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CertificateStatsChart } from '@/components/dashboard/CertificateStatsChart';
import { CertificateApprovalChart } from '@/components/dashboard/CertificateApprovalChart';
import { IssueCertificateModal } from '@/components/dashboard/IssueCertificateModal';
import { 
  FileText, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SuccessModal, UploadCertificateModal } from '@/components/ui';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    certificateId: string;
    recipientName: string;
    email: string;
    hash?: string;
  } | null>(null);


  const [dashboardData, setDashboardData] = useState<{
    stats: {
      totalCertificates: number;
      verifiedCertificates: number;
      pendingCertificates: number;
      todayIssued: number;
      growthRate?: number;
      growthChange?: number;
      activeUsers?: number;
      usersChange?: number;
    };
    chartData?: Array<{
      date: string;
      issued: number;
      verified: number;
      pending: number;
      revoked: number;
      total: number;
    }>;
    approvalData?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await api.getDashboardStats();
        if (response.success && response.data) {
          setDashboardData(response.data as typeof dashboardData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);


  // };

  const handleSuccess = (certificateId: string, recipientName: string, email: string, template: unknown, hash?: string, signatoryLeft?: string, signatoryRight?: string) => {
    setSuccessData({ certificateId, recipientName, email, hash });
    setIsSuccessModalOpen(true);
    console.log('Selected template:', template);
    console.log('Signatories:', { signatoryLeft, signatoryRight });
  };

  const handlePreview = () => {
    console.log('Preview certificate:', successData?.certificateId);
  };

  const handleDownload = () => {
    console.log('Download certificate:', successData?.certificateId);
  };



  return (
    <DashboardLayout 
      title="Overview" 
      onIssueCertificate={() => setIsModalOpen(true)}
      onUploadCertificate={() => setIsUploadModalOpen(true)}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          ) : dashboardData && dashboardData.stats && (
            <>
              <StatsCard
                title="Total Certificates"
                value={dashboardData.stats.totalCertificates.toString()}
                icon={FileText}
                iconColor="bg-smart-blue"
                change="+12%"
                changeType="positive"
              />
              <StatsCard
                title="Verified"
                value={dashboardData.stats.verifiedCertificates.toString()}
                icon={CheckCircle}
                iconColor="bg-green-500"
                change="+8%"
                changeType="positive"
              />
             
              <StatsCard
                title="Issued Today"
                value={dashboardData.stats.todayIssued.toString()}
                icon={TrendingUp}
                iconColor="bg-purple-500"
                change="+15%"
                changeType="positive"
              />
            </>
          ) }
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CertificateStatsChart />
          <CertificateApprovalChart />
        </div>

        

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

            {/* Success Modal */}
            {successData && (
              <SuccessModal
                open={isSuccessModalOpen}
                onOpenChange={setIsSuccessModalOpen}
                certificateId={successData.certificateId}
                recipientName={successData.recipientName}
                email={successData.email}
                hash={successData.hash}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            )}
      </div>
    </DashboardLayout>
  );
}