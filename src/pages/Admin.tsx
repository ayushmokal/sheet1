import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "@/components/admin/columns";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Admin() {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const callbackName = `callback_${Date.now()}`;
      return new Promise((resolve, reject) => {
        (window as any)[callbackName] = (response: any) => {
          if (response.status === 'success') {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
          delete (window as any)[callbackName];
        };

        const script = document.createElement('script');
        script.src = `${import.meta.env.VITE_APPS_SCRIPT_URL}?callback=${callbackName}&action=getSubmissions`;
        script.onerror = () => {
          reject(new Error('Failed to load submissions'));
          delete (window as any)[callbackName];
        };
        document.body.appendChild(script);
        script.remove();
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load submissions: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">SQA Submissions Admin Panel</h1>
      <DataTable columns={columns} data={submissions || []} />
    </div>
  );
}