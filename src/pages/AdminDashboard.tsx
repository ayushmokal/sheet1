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
import { Download } from "lucide-react";

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
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const { data: submissions, isLoading } = useQuery({
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

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      setIsDownloading(filePath);
      const { data, error } = await supabase.storage
        .from("sqa_files")
        .download(filePath);

      if (error) throw error;

      // Create a download link
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

  if (isLoading) {
    return <div className="p-8">Loading submissions...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">SQA Submissions</h1>
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