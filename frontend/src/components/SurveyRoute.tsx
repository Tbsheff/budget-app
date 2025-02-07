import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

interface SurveyRouteProps {
  children: JSX.Element;
}

function SurveyRoute({ children }: SurveyRouteProps) {
  const { user } = useUser();

  // Redirect to dashboard if survey is already completed
  if (user && user.survey_completed) {
    return <Navigate to="/dashboard" />;
  }

  return children; // Render the survey if not completed
}

export default SurveyRoute;
