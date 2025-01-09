import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TemplateDownloadButton } from "./TemplateDownloadButton";
import { Submission } from "@/types/submissions";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  return (
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
                    <TemplateDownloadButton
                      key={file.id}
                      filePath={file.file_path}
                      fileName={file.file_name}
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}