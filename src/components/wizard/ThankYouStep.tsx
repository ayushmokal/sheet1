import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileSpreadsheet } from "lucide-react";

interface ThankYouStepProps {
  spreadsheetUrl: string;
  onSendEmail: () => void;
  isSendingEmail: boolean;
}

export function ThankYouStep({
  spreadsheetUrl,
  onSendEmail,
  isSendingEmail
}: ThankYouStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-600">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">
            Your data has been successfully submitted to the spreadsheet.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              onClick={() => window.open(spreadsheetUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              View Spreadsheet
            </Button>
            
            <Button
              onClick={onSendEmail}
              disabled={isSendingEmail}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSendingEmail ? "Sending..." : "Send Results via Email"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}