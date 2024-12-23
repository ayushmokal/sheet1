import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";
import { LowerLimitDetection } from "./LowerLimitDetection";
import { PrecisionSection } from "./PrecisionSection";
import { FormActions } from "./FormActions";
import { FormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData, getTestData } from "@/utils/formUtils";

// Update this URL with your specific deployment URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzBgoGos14bdYcKhyIm-TgeIKyqMqZSQFAdlXNkKMwsK2kH7i1-v4iz0gJ7FUS911BYnQ/exec';

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

  const loadTestData = () => {
    setFormData(getTestData());
    toast({
      title: "Test Data Loaded",
      description: "You can now submit the form to test the Google Sheets integration.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    let script: HTMLScriptElement | null = null;
    const cleanup = () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsSubmitting(false);
    };

    try {
      const callbackName = `callback_${Date.now()}`;
      console.log("Using callback name:", callbackName);

      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          console.log("Received response:", response);
          resolve(response);
          delete (window as any)[callbackName];
        };

        script = document.createElement('script');
        const encodedData = encodeURIComponent(JSON.stringify(formData));
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=submit&data=${encodedData}`;
        console.log("Request URL:", script.src);
        
        script.onerror = () => {
          console.error("Script loading failed");
          reject(new Error('Failed to load the script'));
          delete (window as any)[callbackName];
        };

        document.body.appendChild(script);
      });

      const response = await responsePromise;
      console.log("Processing response:", response);

      if (response.status === 'success') {
        toast({
          title: "Success!",
          description: "Data has been submitted to Google Sheets successfully.",
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
      cleanup();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SQA Precision / Accuracy / Lower Limit Detection Study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormActions 
            onLoadTestData={loadTestData}
            isSubmitting={isSubmitting}
          />
          <FormHeader formData={formData} handleInputChange={handleInputChange} />
          <LowerLimitDetection 
            data={formData.lowerLimitDetection}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection 
            level={1}
            data={formData.precisionLevel1}
            handleInputChange={handleInputChange}
          />
          <PrecisionSection 
            level={2}
            data={formData.precisionLevel2}
            handleInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
    </form>
  );
}
