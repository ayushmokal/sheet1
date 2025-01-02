import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormData } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationStepProps {
  formData: FormData;
  handleInputChange: (section: string, field: string, value: string) => void;
  onSubmit: () => void;
  onSendEmail: () => void;
  isSubmitting: boolean;
  isSendingEmail: boolean;
  hasSpreadsheet: boolean;
  hasSubmittedData: boolean;
  emailTo?: string;
}

export function VerificationStep({
  formData,
  handleInputChange,
  onSubmit,
  onSendEmail,
  isSubmitting,
  isSendingEmail,
  hasSpreadsheet,
  hasSubmittedData,
  emailTo,
}: VerificationStepProps) {
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

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!hasSpreadsheet || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Data"}
          </Button>
          {hasSubmittedData && formData.emailTo && (
            <Button
              type="button"
              variant="outline"
              onClick={onSendEmail}
              disabled={isSendingEmail}
              className="flex-1"
            >
              {isSendingEmail ? "Sending..." : "Send Email"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}