import React, { useState } from "react";
import axios from "axios";
import { ProgressBar } from "../components/Survey/ProgressBar";
import NavigationButtons from "../components/Survey/NavigationButtons";
import { SurveyForm } from "../components/Survey/SurveyForm";
import { SurveyHeader } from "../components/Survey/SurveyHeader";
import { generateBudget } from "../utils/generateBudget";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { SurveyData, initialSurveyData } from "../types";

const TOTAL_PAGES = 10;

const Survey: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<SurveyData>(initialSurveyData);
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const updateField = (
    field: keyof SurveyData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && value.trim() === "" ? 0 : value,
    }));
  };

  const handleSubmitSurvey = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("/api/survey", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prevUser) =>
        prevUser ? { ...prevUser, survey_completed: true } : null
      );

      toast({
        title: "Success",
        description: "Survey submitted successfully.",
      });

      const budgetData = await generateBudget(
        formData,
        setIsLoading,
        setError,
        setBudget
      );
      setBudget(budgetData);
      navigate("/budget");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({ title: "Error", description: "Failed to submit the survey." });
    }
  };

  const handleNextPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === TOTAL_PAGES) {
      await handleSubmitSurvey();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <SurveyHeader />
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ProgressBar currentPage={currentPage} totalPages={TOTAL_PAGES} />

          <SurveyForm
            currentPage={currentPage}
            formData={formData}
            updateField={updateField}
            setCurrentPage={setCurrentPage}
            handleSubmitSurvey={handleSubmitSurvey}
          />
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {budget && (
            <div>
              <h2 className="text-xl font-bold mt-6">Generated Budget</h2>
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(budget, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;
