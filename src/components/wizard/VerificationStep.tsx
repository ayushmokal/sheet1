import { Button } from "@/components/ui/button";
import { FormData } from "@/types/form";

interface VerificationStepProps {
  formData: FormData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function VerificationStep({
  formData,
  onSubmit,
  isSubmitting,
}: VerificationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Verify and Submit</h3>
        <p className="text-sm text-gray-500">
          Please review your data before submitting
        </p>
      </div>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Data"}
      </Button>
    </div>
  );
}