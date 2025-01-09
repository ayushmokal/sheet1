import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WizardForm } from "./wizard/WizardForm";
import { SQAFormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData, getTestData } from "@/utils/formUtils";
import { generateExcelFile } from "@/utils/excelUtils";
import { supabase } from "@/integrations/supabase/client";

export function SQAForm() {
  const [formData, setFormData] = useState<SQAFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    section: string,
    field: string,
    value: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [parentField]: {
              ...prev[section][parentField],
              [childField]: value
            }
          }
        };
      }
      
      if (typeof index === "number" && typeof prev[section] === "object") {
        const sectionData = { ...prev[section] };
        if (Array.isArray(sectionData[field])) {
          sectionData[field] = [...sectionData[field]];
          sectionData[field][index] = value;
        }
        return { ...prev, [section]: sectionData };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleLoadTestData = () => {
    setFormData(getTestData());
    toast({
      title: "Test Data Loaded",
      description: "Sample data has been loaded into the form.",
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Generate Excel file
      const excelBlob = generateExcelFile(formData);
      const excelFile = new File([excelBlob], `${formData.facility}-${formData.date}.xlsx`, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Create submission record
      const { data: submissionData, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          facility: formData.facility,
          date: formData.date,
          technician: formData.technician,
          serial_number: formData.serialNumber,
          email: formData.emailTo,
          phone: formData.phone
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      // Upload Excel file
      const formDataExcel = new FormData();
      formDataExcel.append('file', excelFile);
      formDataExcel.append('submissionId', submissionData.id);
      formDataExcel.append('fileType', 'excel');

      const response = await supabase.functions.invoke('upload-file', {
        body: formDataExcel
      });

      if (response.error) {
        throw new Error(`Failed to upload file: ${response.error.message}`);
      }

      toast({
        title: "Success!",
        description: "Your data has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8 max-w-4xl mx-auto p-4">
      <WizardForm
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onLoadTestData={handleLoadTestData}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}