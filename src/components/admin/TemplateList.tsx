import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import type { MasterTemplate } from "@/types/templates";

interface TemplateListProps {
  templates: MasterTemplate[];
}

export function TemplateList({ templates }: TemplateListProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsDownloading(filePath);
      const { data, error } = await supabase.storage
        .from("sqa_files")
        .download(filePath);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="space-y-2">
      {templates.map((template) => (
        <div
          key={template.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <span className="truncate">{template.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownload(template.file_path, template.name)}
            disabled={isDownloading === template.file_path}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}