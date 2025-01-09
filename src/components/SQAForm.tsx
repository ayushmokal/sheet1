import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WizardForm } from "./wizard/WizardForm";
import { SQAFormData } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { initialFormData, getTestData } from "@/utils/formUtils";

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
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get the latest master template
      const { data: templates, error: templateError } = await supabase
        .from('master_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (templateError) throw templateError;
      if (!templates || templates.length === 0) {
        throw new Error('No active master template found');
      }

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

      if (submissionError) throw submissionError;

      // Process submission with template
      const formDataBody = new FormData();
      formDataBody.append('submissionId', submissionData.id);
      formDataBody.append('templateId', templates[0].id);
      formDataBody.append('formData', JSON.stringify(formData));

      const response = await supabase.functions.invoke('process-submission', {
        body: formDataBody
      });

      if (response.error) throw response.error;

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