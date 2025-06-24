import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";
import bgImage from "assets/images/playa1.jpg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import DataTrazas from "layouts/trazas/DataTrazas";

// Loading
const LoadingIndicator = () => (
  <MDBox display="flex" justifyContent="center" alignItems="center" height="300px" flexDirection="column">
    <CircularProgress size={60} thickness={4} color="info" />
    <MDTypography mt={2} variant="button" color="text">
      Iniciando...
    </MDTypography>
  </MDBox>
);

// Error Component
const ErrorMessage = ({ error, onRetry }) => (
  <MDBox p={3} textAlign="center" color="error">
    <MDTypography color="error" variant="h6">
      Ocurrió un error
    </MDTypography>
    <MDTypography color="text" variant="body2">
      {error}
    </MDTypography>
    <MDButton
      variant="gradient"
      color="info"
      onClick={onRetry}
      sx={{ mt: 2 }}
    >
      Reintentar
    </MDButton>
  </MDBox>
);

function Login() {
  const authContext = useContext(AuthContext);

  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [fatalError, setFatalError] = useState(null);
  const [credentialsError, setCredentialsError] = useState(null);

  const [inputs, setInputs] = useState({
    user_name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userError: false,
    passwordError: false,
  });

  const timeoutRef = useRef(null);

  const addUserHandler = (newUser) => setUser(newUser);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const clearTimeoutIfExists = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const submitHandler = async (e) => {
    if (e) e.preventDefault();

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = {
      user_name: inputs.user_name,
      password: inputs.password,
    };

    addUserHandler(newUser);

    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };

    setLoading(true);
    setFatalError(null);
    setCredentialsError(null);

    // Inicia el timeout de 1 minuto (60,000 ms)
    timeoutRef.current = setTimeout(() => {
      setFatalError("El servidor está tardando demasiado en responder. Intenta nuevamente.");
      setLoading(false);
    }, 60000);

    try {
      const response = await AuthService.login(myData);

      clearTimeoutIfExists();

      if (!response || !response.access_token || !response.refresh_token) {
        throw new Error("Respuesta inválida del servidor");
      }

      authContext.login(response.access_token, response.refresh_token, response.role);
      DataTrazas.crear({ accion: "Se ha autenticado" });
    } catch (error) {
      clearTimeoutIfExists();

      console.error("Error durante el login:", error);

      if (
        error.message === "Failed to fetch" ||
        error.message === "Network Error" ||
        error.name === "TypeError"
      ) {
        setFatalError("El servidor no respondió. Intenta nuevamente.");
      } else if (error?.errors?.[0]?.detail) {
        setCredentialsError(error.errors[0].detail);
      } else if (error?.message) {
        setCredentialsError(error.message);
      } else {
        setCredentialsError("Ocurrió un error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => clearTimeoutIfExists(); // Limpieza del timeout al desmontar
  }, []);

  if (loading) return <LoadingIndicator />;
  if (fatalError)
    return (
      <BasicLayoutLanding image={bgImage}>
        <Card>
          <ErrorMessage error={fatalError} onRetry={submitHandler} />
        </Card>
      </BasicLayoutLanding>
    );

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
                value={inputs.user_name}
                name="user_name"
                onChange={changeHandler}
                error={errors.userError}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
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
           
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Login;
