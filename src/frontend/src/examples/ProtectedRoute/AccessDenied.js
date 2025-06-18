import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <MDTypography variant="h1" color="error" fontWeight="bold">
        403
      </MDTypography>
      <MDTypography variant="h4" mt={2} mb={3}>
        Acceso Denegado
      </MDTypography>
      <MDTypography variant="body1" textAlign="center" mb={3}>
        No tienes los permisos necesarios para acceder a esta página
      </MDTypography>
      <MDButton 
        variant="gradient" 
        color="info" 
        onClick={() => navigate(-1)}
      >
        Volver Atrás
      </MDButton>
      <MDButton 
        variant="outlined" 
        color="info" 
        onClick={() => navigate("/dashboard")}
        sx={{ mt: 2 }}
      >
        Ir al Inicio
      </MDButton>
    </MDBox>
  );
}

export default AccessDenied;