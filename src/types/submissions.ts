export interface Submission {
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