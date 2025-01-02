import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Mail } from "lucide-react";
import { useState } from "react";

interface VerificationStepProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string) => void;
  onSubmit: () => void;
  onSendEmail: () => void;
  onCreateSpreadsheet: () => void;
  isSubmitting: boolean;
  isSendingEmail: boolean;
  isCreatingSpreadsheet: boolean;
  hasSpreadsheet: boolean;
  hasSubmittedData: boolean;
}

export function VerificationStep({
  formData,
  handleInputChange,
  onSubmit,
  onSendEmail,
  onCreateSpreadsheet,
  isSubmitting,
  isSendingEmail,
  isCreatingSpreadsheet,
  hasSpreadsheet,
  hasSubmittedData,
}: VerificationStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmitClick = async () => {
    try {
      setIsProcessing(true);
      if (!hasSpreadsheet) {
        await onCreateSpreadsheet();
        // Increase delay to 30 seconds after creating the spreadsheet
        await delay(30000);
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

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={handleSubmitClick}
            disabled={isProcessing}
            className="flex-1"
          >
            {getButtonText()}
          </Button>

          {hasSubmittedData && formData.emailTo && (
            <Button
              type="button"
              variant="outline"
              onClick={onSendEmail}
              disabled={isSendingEmail}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSendingEmail ? "Sending..." : "Send Email"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}