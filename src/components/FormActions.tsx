import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onSubmit: () => void;
  onLoadTestData: () => void;
  isSubmitting: boolean;
}

export function FormActions({ 
  onSubmit,
  onLoadTestData,
  isSubmitting
}: FormActionsProps) {
  return (
    <div className="flex justify-end items-center gap-4 flex-wrap">
      <Button 
        type="button" 
        variant="outline"
        onClick={onLoadTestData}
      >
        Load Test Data
      </Button>
      <Button 
        type="submit" 
        className="bg-primary text-white"
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Submitting..." : "Submit Data"}
      </Button>
    </div>
  );
}