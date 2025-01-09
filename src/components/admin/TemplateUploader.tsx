import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

export function TemplateUploader() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Sanitize filename: remove spaces and special characters
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = new Date().getTime();
      const uniqueFileName = `${timestamp}_${sanitizedName}`;
      const filePath = `templates/${uniqueFileName}`;

      // Upload file to storage with upsert option
      const { error: uploadError } = await supabase.storage
        .from("sqa_files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Create template record
      const { error: dbError } = await supabase
        .from("master_templates")
        .insert({
          name: file.name, // Keep original name for display
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Template uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading template:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload template",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleTemplateUpload}
        disabled={isUploading}
        className="w-full"
      />
      {isUploading && (
        <div className="text-sm text-muted-foreground">Uploading template...</div>
      )}
    </div>
  );
}