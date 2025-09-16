"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { CertificateStatsChart } from "@/components/dashboard/CertificateStatsChart";
import { CertificateApprovalChart } from "@/components/dashboard/CertificateApprovalChart";
import { FileText, Hourglass, GraduationCap } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {

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
      {
        date: "2024-01-01",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-02",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-03",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-04",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-05",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-06",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
      {
        date: "2024-01-07",
        issued: 0,
        verified: 0,
        pending: 0,
        revoked: 0,
        total: 0,
      },
    ],
    approvalData: [
      { name: "Approved", value: 0, color: "#10B981" },
      { name: "Pending", value: 0, color: "#F59E0B" },
      { name: "Rejected", value: 0, color: "#EF4444" },
    ],
  };


  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Certificates Issued"
            value={dashboardData.stats.totalCertificates.toString()}
            icon={FileText}
            iconColor="bg-[#0F96E3]"
            change="+0%"
            changeType="neutral"
          />
          <StatsCard
            title="Students Covered"
            value={dashboardData.stats.verifiedCertificates.toString()}
            icon={GraduationCap}
            iconColor="bg-[#0F96E3]"
            change="+0%"
            changeType="neutral"
          />

          <StatsCard
            title="Pending Verification"
            value={dashboardData.stats.todayIssued.toString()}
            icon={Hourglass}
            iconColor="bg-[#0F96E3]"
            change="+0%"
            changeType="negative"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CertificateStatsChart />
          <CertificateApprovalChart />
        </div>

      </div>
    </DashboardLayout>
  );
}
