import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.survey_completed) {
    return <Navigate to="/survey" />;
  }

  return children;
}

export default PrivateRoute;
