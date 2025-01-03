import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Submission = {
  date: string;
  facility: string;
  technician: string;
  serialNumber: string;
  spreadsheetUrl: string;
  pdfUrl: string;
  status: string;
}

export const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "facility",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Facility
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "technician",
    header: "Technician",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(submission.spreadsheetUrl, '_blank')}
          >
            View Sheet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(submission.pdfUrl, '_blank')}
          >
            View PDF
          </Button>
        </div>
      );
    },
  },
];