import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "../FormHeader";
import { LowerLimitDetection } from "../LowerLimitDetection";
import { PrecisionSection } from "../PrecisionSection";
import { AccuracySection } from "../AccuracySection";
import { QCSection } from "../QCSection";
import { VerificationStep } from "./VerificationStep";
import { FormData } from "@/types/form";

interface WizardFormProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string, index?: number) => void;
  onCreateSpreadsheet: () => void;
  onSubmit: () => void;
  onSendEmail: () => void;
  onLoadTestData: () => void;
  isCreatingSpreadsheet: boolean;
  isSendingEmail: boolean;
  isSubmitting: boolean;
  hasSpreadsheet: boolean;
  hasSubmittedData: boolean;
}

export function WizardForm({
  formData,
  handleInputChange,
  onCreateSpreadsheet,
  onSubmit,
  onSendEmail,
  onLoadTestData,
  isCreatingSpreadsheet,
  isSendingEmail,
  isSubmitting,
  hasSpreadsheet,
  hasSubmittedData,
}: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Basic Information",
      component: (
        <>
          <FormHeader
            formData={formData}
            handleInputChange={handleInputChange}
            hasSubmittedData={hasSubmittedData}
          />
          <div className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onLoadTestData}
            >
              Load Test Data
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCreateSpreadsheet}
              disabled={isCreatingSpreadsheet}
            >
              {isCreatingSpreadsheet ? "Creating..." : hasSpreadsheet ? "Open Spreadsheet" : "Create Spreadsheet"}
            </Button>
          </div>
        </>
      ),
    },
    {
      title: "Lower Limit Detection",
      component: (
        <LowerLimitDetection
          data={formData.lowerLimitDetection}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Precision & Sensitivity - Level 1",
      component: (
        <PrecisionSection
          level={1}
          data={formData.precisionLevel1}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Precision & Sensitivity - Level 2",
      component: (
        <PrecisionSection
          level={2}
          data={formData.precisionLevel2}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Accuracy",
      component: (
        <AccuracySection
          data={formData.accuracy}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Precision & Sensitivity - QC",
      component: (
        <QCSection
          data={formData.qc}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Verification",
      component: (
        <VerificationStep
          formData={formData}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          onSendEmail={onSendEmail}
          isSubmitting={isSubmitting}
          isSendingEmail={isSendingEmail}
          hasSpreadsheet={hasSpreadsheet}
          hasSubmittedData={hasSubmittedData}
          emailTo={formData.emailTo}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps[currentStep].component}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}