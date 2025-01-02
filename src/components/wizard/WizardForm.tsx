import { Card } from "@/components/ui/card";
import { FormData } from "@/types/form";
import { FormHeader } from "../FormHeader";
import { FormActions } from "../FormActions";
import { LowerLimitDetection } from "../LowerLimitDetection";
import { PrecisionSection } from "../PrecisionSection";
import { AccuracySection } from "../AccuracySection";
import { QCSection } from "../QCSection";
import { VerificationStep } from "./VerificationStep";
import { ThankYouStep } from "./ThankYouStep";
import { useState } from "react";

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
  spreadsheetUrl?: string;
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
  spreadsheetUrl
}: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmitSuccess = () => {
    setCurrentStep(6); // Move to thank you step
  };

  const handleSubmitWrapper = async () => {
    await onSubmit();
    handleSubmitSuccess();
  };

  return (
    <Card className="p-6">
      <FormHeader />
      
      {currentStep < 6 && (
        <FormActions
          onLoadTestData={onLoadTestData}
          onCreateSpreadsheet={onCreateSpreadsheet}
          onSendEmail={onSendEmail}
          isCreatingSpreadsheet={isCreatingSpreadsheet}
          isSendingEmail={isSendingEmail}
          isSubmitting={isSubmitting}
          hasSpreadsheet={hasSpreadsheet}
          hasSubmittedData={hasSubmittedData}
          emailTo={formData.emailTo}
        />
      )}

      {currentStep === 1 && (
        <LowerLimitDetection
          data={formData.lowerLimitDetection}
          handleInputChange={handleInputChange}
        />
      )}

      {currentStep === 2 && (
        <PrecisionSection
          data={{ level1: formData.precisionLevel1, level2: formData.precisionLevel2 }}
          handleInputChange={handleInputChange}
        />
      )}

      {currentStep === 3 && (
        <AccuracySection
          data={formData.accuracy}
          handleInputChange={handleInputChange}
        />
      )}

      {currentStep === 4 && (
        <QCSection
          data={formData.qc}
          handleInputChange={handleInputChange}
        />
      )}

      {currentStep === 5 && (
        <VerificationStep
          formData={formData}
          handleInputChange={handleInputChange}
          onSubmit={handleSubmitWrapper}
          onCreateSpreadsheet={onCreateSpreadsheet}
          isSubmitting={isSubmitting}
          isCreatingSpreadsheet={isCreatingSpreadsheet}
          hasSpreadsheet={hasSpreadsheet}
        />
      )}

      {currentStep === 6 && spreadsheetUrl && (
        <ThankYouStep
          spreadsheetUrl={spreadsheetUrl}
          onSendEmail={onSendEmail}
          isSendingEmail={isSendingEmail}
        />
      )}

      {currentStep < 6 && (
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
            disabled={currentStep === 5}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}