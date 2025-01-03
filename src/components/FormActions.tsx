import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function FormActions({ 
  onSubmit,
  isSubmitting
}: FormActionsProps) {
  return (
    <div className="flex justify-end items-center gap-4 flex-wrap">
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