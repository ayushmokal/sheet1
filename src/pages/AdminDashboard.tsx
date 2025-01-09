import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Submission {
  id: string;
  facility: string;
  date: string;
  technician: string;
  serial_number: string;
  email: string;
  status: string;
  created_at: string;
  files: {
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
  }[];
}

interface MasterTemplate {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  is_active: boolean;
}

export function AdminDashboard() {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          files (
            id,
            file_name,
            file_type,
            file_path
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["master_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MasterTemplate[];
    },
  });

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

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to storage
      const filePath = `templates/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("sqa_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create template record
      const { error: dbError } = await supabase
        .from("master_templates")
        .insert({
          name: file.name,
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
        description: "Failed to upload template",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingSubmissions || isLoadingTemplates) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SQA Submissions</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Master Template
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Upload Master Template</SheetTitle>
              <SheetDescription>
                Upload an Excel file that will be used as a template for all submissions.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleTemplateUpload}
                disabled={isUploading}
                className="w-full"
              />
            </div>
            {templates && templates.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Current Templates</h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{template.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(template.file_path, template.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facility</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Files</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.facility}</TableCell>
                <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                <TableCell>{submission.technician}</TableCell>
                <TableCell>{submission.serial_number}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.status}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {submission.files?.map((file) => (
                      <Button
                        key={file.id}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleDownload(file.file_path, file.file_name)}
                        disabled={isDownloading === file.file_path}
                      >
                        <Download className="h-4 w-4" />
                        {isDownloading === file.file_path ? "Downloading..." : file.file_name}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}