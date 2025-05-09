import { useContext, useState } from "react";
import { Link } from "react-router-dom";
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

function Login() {
  const { login } = useContext(AuthContext);

  const [credentialsError, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [inputs, setInputs] = useState({
    user_name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userError: false,
    passwordError: false,
  });

  const handleSetRememberMe = () => setRememberMe((prev) => !prev);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [`${name}Error`]: false }));
    setCredentialsError(null);
  };

  const validateInputs = () => {
    let valid = true;
    let newErrors = { userError: false, passwordError: false };

    if (!inputs.user_name.trim()) {
      newErrors.userError = true;
      valid = false;
    }

    if (inputs.password.trim().length < 6) {
      newErrors.passwordError = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const loginData = {
      data: {
        type: "token",
        attributes: {
          user_name: inputs.user_name,
          password: inputs.password,
        },
      },
    };

    try {
      const response = await AuthService.login(loginData);
      console.log(response);

      const { access_token, role, user_name } = response;
      console.log(user_name,access_token,role);

      if (!access_token || !role) {
        throw new Error("Faltan datos en la respuesta del servidor.");
      }

      login(access_token, role.toLowerCase(), { user_name });

      DataTrazas.crear({ accion: "Se ha autenticado" });
    } catch (res) {
      console.error("Error en el login:", res);
      if (res?.message) {
        setCredentialsError(res.message);
      } else if (res?.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        setCredentialsError(res.errors[0].detail || "Credenciales inválidas.");
      } else {
        setCredentialsError("Error inesperado. Intenta nuevamente.");
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
                name="user_name"
                value={inputs.user_name}
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
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Recordarme
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
                ¿Olvidaste tu contraseña? Restablécela{" "}
                <MDTypography
                  component={Link}
                  to="/auth/forgot-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  aquí
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿No tienes una cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Regístrate
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
