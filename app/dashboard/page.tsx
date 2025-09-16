'use client';

import { useState } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CertificateStatsChart } from '@/components/dashboard/CertificateStatsChart';
import { CertificateApprovalChart } from '@/components/dashboard/CertificateApprovalChart';
import { IssueCertificateModal } from '@/components/dashboard/IssueCertificateModal';
import { 
  FileText, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';
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


  // Static dashboard data with zeros for now
  const dashboardData = {
    stats: {
      totalCertificates: 0,
      verifiedCertificates: 0,
      pendingCertificates: 0,
      todayIssued: 0,
      growthRate: 0,
      growthChange: 0,
      activeUsers: 0,
      usersChange: 0,
    },
    chartData: [
      { date: '2024-01-01', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-02', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-03', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-04', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-05', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-06', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
      { date: '2024-01-07', issued: 0, verified: 0, pending: 0, revoked: 0, total: 0 },
    ],
    approvalData: [
      { name: 'Approved', value: 0, color: '#10B981' },
      { name: 'Pending', value: 0, color: '#F59E0B' },
      { name: 'Rejected', value: 0, color: '#EF4444' },
    ],
  };



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
          <StatsCard
            title="Total Certificates"
            value={dashboardData.stats.totalCertificates.toString()}
            icon={FileText}
            iconColor="bg-smart-blue"
            change="+0%"
            changeType="neutral"
          />
          <StatsCard
            title="Verified"
            value={dashboardData.stats.verifiedCertificates.toString()}
            icon={CheckCircle}
            iconColor="bg-green-500"
            change="+0%"
            changeType="neutral"
          />
          <StatsCard
            title="Pending"
            value={dashboardData.stats.pendingCertificates.toString()}
            icon={FileText}
            iconColor="bg-yellow-500"
            change="+0%"
            changeType="neutral"
          />
          <StatsCard
            title="Issued Today"
            value={dashboardData.stats.todayIssued.toString()}
            icon={TrendingUp}
            iconColor="bg-purple-500"
            change="+0%"
            changeType="neutral"
          />
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