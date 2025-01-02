import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";
import { LowerLimitDetection } from "./LowerLimitDetection";
import { PrecisionSection } from "./PrecisionSection";
import { AccuracySection } from "./AccuracySection";
import { QCSection } from "./QCSection";
import { FormActions } from "./FormActions";
import { FormData, GoogleScriptResponse } from "@/types/form";
import { initialFormData, getTestData } from "@/utils/formUtils";
import { APPS_SCRIPT_URL } from "@/config/constants";

export function SQAForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isCreatingSpreadsheet, setIsCreatingSpreadsheet] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedData, setHasSubmittedData] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
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

  const loadTestData = () => {
    setFormData(getTestData());
    toast({
      title: "Test Data Loaded",
      description: "You can now submit the form to test the Google Sheets integration.",
    });
  };

  const createSpreadsheetCopy = async () => {
    if (spreadsheetId) {
      window.open(spreadsheetUrl, '_blank');
      return;
    }

    setIsCreatingSpreadsheet(true);
    let script: HTMLScriptElement | null = null;
    const cleanup = () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsCreatingSpreadsheet(false);
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
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=createCopy`;
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

      if (response.status === 'success' && response.spreadsheetId && response.spreadsheetUrl) {
        setSpreadsheetId(response.spreadsheetId);
        setSpreadsheetUrl(response.spreadsheetUrl);
        window.open(response.spreadsheetUrl, '_blank');
        toast({
          title: "Success!",
          description: "A new spreadsheet has been created. You can now enter and submit your data.",
        });
      } else {
        throw new Error(response.message || 'Failed to create spreadsheet');
      }
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create spreadsheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      cleanup();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Please create a new spreadsheet first before submitting data.",
        variant: "destructive",
      });
      return;
    }
    
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
        const encodedData = encodeURIComponent(JSON.stringify({
          ...formData,
          spreadsheetId,
          sheetName: "Template"
        }));
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
        setHasSubmittedData(true);
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

  const handleSendEmail = async () => {
    if (!spreadsheetId || !formData.emailTo) {
      toast({
        title: "Error",
        description: "Please provide an email address to send the spreadsheet.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    let script: HTMLScriptElement | null = null;
    const cleanup = () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      setIsSendingEmail(false);
    };

    try {
      const callbackName = `callback_${Date.now()}`;
      const responsePromise = new Promise<GoogleScriptResponse>((resolve, reject) => {
        (window as any)[callbackName] = (response: GoogleScriptResponse) => {
          resolve(response);
          delete (window as any)[callbackName];
        };

        script = document.createElement('script');
        const encodedData = encodeURIComponent(JSON.stringify({
          spreadsheetId,
          emailTo: formData.emailTo
        }));
        script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&action=sendEmail&data=${encodedData}`;
        
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
          description: "Email sent successfully with spreadsheet and PDF attachments.",
        });
      } else {
        throw new Error(response.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
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
            onCreateSpreadsheet={createSpreadsheetCopy}
            onSendEmail={handleSendEmail}
            isCreatingSpreadsheet={isCreatingSpreadsheet}
            isSendingEmail={isSendingEmail}
            isSubmitting={isSubmitting}
            hasSpreadsheet={!!spreadsheetId}
            hasSubmittedData={hasSubmittedData}
            emailTo={formData.emailTo}
          />
          <FormHeader 
            formData={formData} 
            handleInputChange={handleInputChange} 
            hasSubmittedData={hasSubmittedData}
          />
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
          <AccuracySection
            data={formData.accuracy}
            handleInputChange={handleInputChange}
          />
          <QCSection
            data={formData.qc}
            handleInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
    </form>
  );
}
