import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface FormHeaderProps {
  formData: {
    facility: string;
    date: string;
    technician: string;
    serialNumber: string;
    emailTo?: string;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
  hasSubmittedData?: boolean;
}

export function FormHeader({ formData, handleInputChange, hasSubmittedData }: FormHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Facility Name</label>
            <Input
              type="text"
              value={formData.facility}
              onChange={(e) => handleInputChange("facility", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Technician Name</label>
            <Input
              type="text"
              value={formData.technician}
              onChange={(e) => handleInputChange("technician", "", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Serial Number</label>
            <Input
              type="text"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange("serialNumber", "", e.target.value)}
              required
            />
          </div>
          {hasSubmittedData && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Email Results To</label>
              <Input
                type="email"
                value={formData.emailTo || ''}
                onChange={(e) => handleInputChange("emailTo", "", e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}