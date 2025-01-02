import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface VerificationStepProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string) => void;
  onSubmit: () => void;
  onCreateSpreadsheet: () => void;
  isSubmitting: boolean;
  isCreatingSpreadsheet: boolean;
  hasSpreadsheet: boolean;
}

export function VerificationStep({
  formData,
  handleInputChange,
  onSubmit,
  onCreateSpreadsheet,
  isSubmitting,
  isCreatingSpreadsheet,
  hasSpreadsheet,
}: VerificationStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmitClick = async () => {
    try {
      setIsProcessing(true);
      if (!hasSpreadsheet) {
        await onCreateSpreadsheet();
        await delay(30000); // Wait for spreadsheet creation
      }
      await onSubmit();
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) {
      if (isCreatingSpreadsheet) {
        return "Creating Spreadsheet (30s)...";
      }
      if (isSubmitting) {
        return "Submitting Data...";
      }
      return "Processing...";
    }
    return "Submit Data";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="font-medium">Facility Name:</dt>
              <dd>{formData.facility}</dd>
              <dt className="font-medium">Date:</dt>
              <dd>{formData.date}</dd>
              <dt className="font-medium">Technician Name:</dt>
              <dd>{formData.technician}</dd>
              <dt className="font-medium">Serial Number:</dt>
              <dd>{formData.serialNumber}</dd>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              value={formData.emailTo || ''}
              onChange={(e) => handleInputChange("emailTo", "", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange("phoneNumber", "", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmitClick}
          disabled={isProcessing}
          className="w-full"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}