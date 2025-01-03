import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function FormHeader({ onLoadTestData }: { onLoadTestData: () => void }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold">SQA Data Collection Form</h1>
        <p className="text-gray-600">Please fill in all the required information</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onLoadTestData}>
          Load Test Data
        </Button>
        <Link to="/admin">
          <Button variant="secondary">Admin Panel</Button>
        </Link>
      </div>
    </div>
  );
}