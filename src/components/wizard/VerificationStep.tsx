import { FormData } from "@/types/form";
import { FormActions } from "../FormActions";

export interface VerificationStepProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string, index?: number) => void;
  onSubmit: () => void;
  onSendEmail: () => void;
  onCreateSpreadsheet: () => void;
  onLoadTestData: () => void;
  isCreatingSpreadsheet: boolean;
  isSendingEmail: boolean;
  isSubmitting: boolean;
  hasSpreadsheet: boolean;
  hasSubmittedData: boolean;
}

export function VerificationStep({
  formData,
  onSubmit,
  onSendEmail,
  onCreateSpreadsheet,
  onLoadTestData,
  isCreatingSpreadsheet,
  isSendingEmail,
  isSubmitting,
  hasSpreadsheet,
  hasSubmittedData
}: VerificationStepProps) {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h3>Verification</h3>
        <p>Please verify all the data before submitting.</p>
      </div>
      
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
    </div>
  );
}