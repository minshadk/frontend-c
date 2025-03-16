import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // Redirect if not logged in
//   if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />; // Restrict access

  return element;
};

export default ProtectedRoute;
