import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "context";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default AdminRoute;