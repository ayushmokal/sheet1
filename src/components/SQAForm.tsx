import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { WizardForm } from "./wizard/WizardForm";
import { FormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData } from "@/utils/formUtils";
import { APPS_SCRIPT_URL } from "@/config/constants";

export function SQAForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let script: HTMLScriptElement | null = null;

    try {
      const callbackName = `callback_${Date.now()}`;
      
      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          resolve(response);
          delete (window as any)[callbackName];
        };

        script = document.createElement('script');
        const encodedData = encodeURIComponent(JSON.stringify(formData));
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=submit&data=${encodedData}`;
        
        script.onerror = () => {
          reject(new Error('Failed to load the script'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;

      if (response.status === 'success') {
        toast({
          title: "Success!",
          description: "Your data has been submitted successfully.",
        });
      } else {
        throw new Error(response.message || 'Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit data. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8 max-w-4xl mx-auto p-4">
      <WizardForm
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}