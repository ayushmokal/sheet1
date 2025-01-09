import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TemplateUploader } from "@/components/admin/TemplateUploader";
import { TemplateList } from "@/components/admin/TemplateList";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import type { MasterTemplate } from "@/types/templates";
import type { Submission } from "@/types/submissions";

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

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }
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

      <SubmissionsTable submissions={submissions || []} />
    </div>
  );
}