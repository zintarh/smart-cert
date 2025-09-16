"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Modal, Select } from "../ui";
import { TemplatePicker } from "../templates/TemplatePicker";

const issueCertificateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  matricNo: z.string().min(1, "Matriculation number is required"),
  course: z.string().min(1, "Course is required"),
  yearOfGraduation: z.string().min(1, "Year of graduation is required"),
});

type IssueCertificateFormData = z.infer<typeof issueCertificateSchema>;

interface IssueCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (
    certificateId: string,
    recipientName: string,
    email: string,
    template: unknown,
    hash?: string,
    signatoryLeft?: string,
    signatoryRight?: string
  ) => void;
}

export function IssueCertificateModal({
  open,
  onOpenChange,
  onSuccess,
}: IssueCertificateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IssueCertificateFormData | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueCertificateFormData>({
    resolver: zodResolver(issueCertificateSchema),
  });

  const onSubmit = async (data: IssueCertificateFormData) => {
    if (currentStep === 1) {
      setFormData(data);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData || !selectedTemplate) return;

      setIsSubmitting(true);
      try {
        const apiData = {
          recipientName: formData.fullName,
          email: `${formData.matricNo.toLowerCase()}@unijos.edu`,
          course: formData.course,
          matricNo: formData.matricNo,
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(new Date().getFullYear() + 5, 11, 31)
            .toISOString()
            .split("T")[0],
          template: selectedTemplate,
        };

        // Call the API to create certificate
        const response = await fetch("/api/certificates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (result.success && result.data) {
          onSuccess(
            result.data.certificateId,
            formData.fullName,
            apiData.email,
            selectedTemplate,
            result.data.hash,
            "",
            ""
          );
          reset();
          handleClose();
        } else {
          throw new Error(result.message || "Failed to create certificate");
        }
      } catch (error) {
        console.error("Error issuing certificate:", error);
        alert("Failed to create certificate. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData(null);
    setSelectedTemplate(null);
    reset();
    onOpenChange(false);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedTemplate && formData) {
      onSubmit(formData);
    }
  };

  const courseOptions = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Engineering", label: "Engineering" },
    { value: "Business Administration", label: "Business Administration" },
    { value: "Medicine", label: "Medicine" },
    { value: "Law", label: "Law" },
  ];

  const yearOptions = [
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  return (
    <Modal open={open} onOpenChange={handleClose} className={currentStep === 2 ? "max-w-7xl" : "max-w-xl"}>
      {currentStep === 1 ? (
        // Step 1: User Details Form
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Issue New Certificate
            </h2>
            <p className="text-sm text-gray-600">Fill in user details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                {...register("fullName")}
                label="Full name"
                placeholder="Aisha Bello"
                error={errors.fullName?.message}
                className="w-full"
              />

              <Input
                {...register("matricNo")}
                label="Matric No"
                placeholder="CSC/2017/045"
                error={errors.matricNo?.message}
                className="w-full"
              />

              <Select
                {...register("course")}
                label="Course"
                options={courseOptions}
                placeholder="Computer Science"
                error={errors.course?.message}
                className="w-full"
              />

              <Select
                {...register("yearOfGraduation")}
                label="Year of Graduation"
                options={yearOptions}
                placeholder="2025"
                error={errors.yearOfGraduation?.message}
                className="w-full"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-blue-400 mb-1 ">
                    Blockchain Security
                  </h3>
                  <p className="text-base  text-blue-400 ">
                    This certificate will be stored on the blockchain with IPFS
                    for tamper-proof verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className=" pt-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText="Processing... "
                className="px-6 py-3 w-full"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      ) : (
        // Step 2: Template Selection
            <TemplatePicker
              onSelectTemplate={handleSelectTemplate}
              onBack={handleBack}
              onContinue={handleContinue}
              formData={formData!}
              selectedTemplate={selectedTemplate}
            />
      )}
    </Modal>
  );
}
