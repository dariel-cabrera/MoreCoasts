import { useContext, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";

// Images
import bgImage from "assets/images/playa1.jpg";

import AuthService from "services/auth-service";
import { AuthContext } from "context";
import DataTrazas from "layouts/trazas/DataTrazas";


function Login() {
  const authContext = useContext(AuthContext);
  const [credentialsErros, setCredentialsError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [user,setUser]=useState({});
  const [inputs, setInputs] = useState({
    user_name: "Admin",
    password: "secret",
  });

  const [errors, setErrors] = useState({
    userError: false,
    passwordError: false,
  });

  const addUserHandler = (newUser) => setUser(newUser);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    // check rememeber me?
    e.preventDefault();

    

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = { user_name: inputs.user, password: inputs.password };
    addUserHandler(newUser);

    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };
    console.log(myData);
    // Hubo Cambios Aki 

    try {
      const response = await AuthService.login(myData);
      authContext.login(response.access_token, response.refresh_token);
      DataTrazas.crear({accion: 'Se ha autenticado'});
    } catch (res) {
      console.error("Error en el login:", res);
    
      if (res?.message) {
        setCredentialsError(res.message);
      } else if (res?.errors && Array.isArray(res.errors) && res.errors.length > 0) {
        setCredentialsError(res.errors[0].detail || "Error desconocido.");
      } else {
        setCredentialsError("Error inesperado. Inténtalo de nuevo.");
      }
    }

    return () => {
      setInputs({
        user: "",
        password: "",
      });

      setErrors({
        userError: false,
        passwordError: false,
      });
    };
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
                value={inputs.email}
                name="user"
                onChange={changeHandler}
                error={errors.emailError}
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
            {credentialsErros && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {credentialsErros}
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