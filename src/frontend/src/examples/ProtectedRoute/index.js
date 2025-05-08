import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context";

const ProtectedRoute = ({
  children,
  redirectPath = "/auth/login",
  unauthorizedPath = "/unauthorized",
  requiredRoles = [], // Ej: ['admin', 'worker']
}) => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  // 🔒 Usuario no autenticado → redirige al login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // 🛑 Usuario autenticado, pero sin los roles requeridos
  if (
    requiredRoles.length > 0 &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  // ✅ Autenticado y con rol autorizado
  return children;
};

export default ProtectedRoute;
