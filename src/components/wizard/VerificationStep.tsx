import { FormData } from "@/types/form";
import { FormActions } from "../FormActions";

export interface VerificationStepProps {
  formData: FormData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function VerificationStep({
  formData,
  onSubmit,
  isSubmitting
}: VerificationStepProps) {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h3>Verification</h3>
        <p>Please verify all the data before submitting.</p>
      </div>
      
      <FormActions
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}