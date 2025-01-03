import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormHeaderProps {
  formData: {
    facility: string;
    date: string;
    technician: string;
    serialNumber: string;
    emailTo: string;
    phone: string;
  };
  handleInputChange: (section: string, field: string, value: string) => void;
}

export function FormHeader({ formData, handleInputChange }: FormHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="facility">Facility Name</Label>
        <Input
          id="facility"
          value={formData.facility}
          onChange={(e) => handleInputChange("facility", "", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange("date", "", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="technician">Technician Name</Label>
        <Input
          id="technician"
          value={formData.technician}
          onChange={(e) => handleInputChange("technician", "", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="serialNumber">Serial Number</Label>
        <Input
          id="serialNumber"
          value={formData.serialNumber}
          onChange={(e) => handleInputChange("serialNumber", "", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="emailTo">Contact Email (for records only)</Label>
        <Input
          id="emailTo"
          type="email"
          value={formData.emailTo}
          onChange={(e) => handleInputChange("emailTo", "", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Contact Phone (for records only)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", "", e.target.value)}
        />
      </div>
    </div>
  );
}