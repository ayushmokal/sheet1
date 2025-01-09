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
import { Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TemplateUploader } from "@/components/admin/TemplateUploader";
import { TemplateList } from "@/components/admin/TemplateList";
import type { MasterTemplate } from "@/types/templates";

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

export function AdminDashboard() {
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
              <TemplateUploader />
            </div>
            {templates && templates.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Current Templates</h3>
                <TemplateList templates={templates} />
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