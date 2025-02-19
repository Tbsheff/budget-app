import { ClipboardList } from "lucide-react";

export const SurveyHeader = () => (
  <div className="text-center mb-8">
    <ClipboardList className="w-12 h-12 text-blue-500 mx-auto mb-4" />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      Financial Planning Survey
    </h1>
    <p className="text-gray-600">
      Help us understand your financial situation better
    </p>
  </div>
);
