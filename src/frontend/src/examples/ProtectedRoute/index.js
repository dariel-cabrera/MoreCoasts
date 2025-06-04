import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from 'context';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, role, loading } = useContext(AuthContext);

  // Mostrar nada o un spinner mientras carga
  if (loading) {
    return null; // O reemplaza con un componente <LoadingSpinner />
  }

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si el rol no está permitido, redirige a "no autorizado"
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si pasa las validaciones, renderiza el contenido
  return children;
};

export default RoleProtectedRoute;

