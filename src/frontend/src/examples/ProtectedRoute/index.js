import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context";

const ProtectedRoute = ({
  children,
  redirectPath = "/auth/login",
  unauthorizedPath = "/unauthorized",
  requiredRoles = [],
}) => {
  const { isAuthenticated, userRole, isLoading } = useContext(AuthContext);

  // Mostrar nada mientras se carga el estado de autenticación
  if (isLoading) {
    return null;
  }

  // 🔒 Usuario no autenticado → redirige al login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // 🛑 Usuario autenticado, pero sin los roles requeridos
  if (
    requiredRoles.length > 0 &&
    (!userRole || !requiredRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase()))
  ) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  // ✅ Autenticado y con rol autorizado
  return <>{children}</>;
};

export default ProtectedRoute;