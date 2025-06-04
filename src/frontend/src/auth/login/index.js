import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";

import bgImage from "assets/images/playa1.jpg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import DataTrazas from "layouts/trazas/DataTrazas";
import jwtDecode from "jwt-decode";

function Login() {
  const { isAuthenticated, loading, login } = useContext(AuthContext);

  const [credentialsError, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [inputs, setInputs] = useState({
    user: "Admin",       // corregido nombre para que coincida con input name
    password: "secret",
  });

  const [errors, setErrors] = useState({
    userError: false,
    passwordError: false,
  });

  // Si está cargando el contexto, no mostrar nada (o spinner)
  if (loading) return null;

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!inputs.user.trim()) {
      setErrors({ userError: true, passwordError: false });
      setCredentialsError("El usuario es requerido");
      return;
    }
    if (inputs.password.trim().length < 6) {
      setErrors({ userError: false, passwordError: true });
      setCredentialsError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCredentialsError(null);
    setErrors({ userError: false, passwordError: false });

    // Preparar datos para el servicio de autenticación
    const newUser = { user_name: inputs.user, password: inputs.password };
    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };

    try {
      const response = await AuthService.login(myData);

      // Decodificar token para obtener datos y rol
      
 
      // Usar login del contexto para actualizar estado y navegar
      login(response.access_token, response.refresh_token);

      // Registrar acción (opcional)
      DataTrazas.crear({ accion: "Se ha autenticado" });
    } catch (error) {
      console.error("Error en el login:", error);

      if (error?.message) {
        setCredentialsError(error.message);
      } else if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        setCredentialsError(error.errors[0].detail || "Error desconocido.");
      } else {
        setCredentialsError("Error inesperado. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <BasicLayoutLanding image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Iniciar Sesión
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Usuario"
                fullWidth
                value={inputs.user}
                name="user"
                onChange={changeHandler}
                error={errors.userError}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Iniciar
              </MDButton>
            </MDBox>
            {credentialsError && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsError}
              </MDTypography>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Forgot your password? Reset it{" "}
                <MDTypography
                  component={Link}
                  to="/auth/forgot-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  here
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Login;
