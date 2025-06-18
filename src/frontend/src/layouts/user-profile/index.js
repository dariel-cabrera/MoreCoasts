import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/user-profile/Header";
import AuthService from "services/auth-service";

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassError: false,
    confirmPassError: false,
  });

  const [notification, setNotification] = useState("");

  const getUserData = async () => {
    try {
      const response = await AuthService.getProfile(); // debe hacer GET /auth/me
      const { name, lastName, user_name } = response.data;
      setUser((prev) => ({
        ...prev,
        firstName: name,
        lastName,
        user_name: user_name,
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification("");

    if (user.newPassword.length < 8) {
      setErrors({ newPassError: true, confirmPassError: false });
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      setErrors({ newPassError: false, confirmPassError: true });
      return;
    }

    try {
      await AuthService.changePassword({
        newPassword: user.newPassword,
        password_confirmation: user.confirmPassword,
      });

      setErrors({ newPassError: false, confirmPassError: false });
      setNotification("Contraseña actualizada correctamente");
      setUser({ ...user, newPassword: "", confirmPassword: "" });
    } catch (err) {
      setNotification("Error al actualizar la contraseña");
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={`${user.firstName} ${user.lastName}`}>
        {notification && (
          <MDAlert color="info" mt="20px">
            <MDTypography variant="body2" color="white">
              {notification}
            </MDTypography>
          </MDAlert>
        )}

        <MDBox component="form" onSubmit={handleSubmit} role="form" mt={3}>
          <MDBox mb={2}>
            <MDTypography variant="body2" color="text" fontWeight="regular" ml={1}>
              Nombre
            </MDTypography>
           
          </MDBox>

          <MDBox mb={2}>
            <MDTypography variant="body2" color="text" fontWeight="regular" ml={1}>
              Apellido
            </MDTypography>
            
          </MDBox>

          <MDBox mb={2}>
            <MDTypography variant="body2" color="text" fontWeight="regular" ml={1}>
              Nombre de usuario
            </MDTypography>
            
          </MDBox>

          <MDBox mb={2}>
            <MDTypography variant="body2" color="text" fontWeight="regular" ml={1}>
              Nueva contraseña
            </MDTypography>
            <MDInput
              type="password"
              name="newPassword"
              value={user.newPassword}
              onChange={handleChange}
              fullWidth
              error={errors.newPassError}
              placeholder="Nueva contraseña"
            />
            {errors.newPassError && (
              <MDTypography variant="caption" color="error">
                La contraseña debe tener al menos 8 caracteres.
              </MDTypography>
            )}
          </MDBox>

          <MDBox mb={3}>
            <MDTypography variant="body2" color="text" fontWeight="regular" ml={1}>
              Confirmar contraseña
            </MDTypography>
            <MDInput
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              fullWidth
              error={errors.confirmPassError}
              placeholder="Confirmar contraseña"
            />
            {errors.confirmPassError && (
              <MDTypography variant="caption" color="error">
                Las contraseñas no coinciden.
              </MDTypography>
            )}
          </MDBox>

          <MDBox mt={4} display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="info" type="submit">
              Guardar cambios
            </MDButton>
          </MDBox>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
};

export default UserProfile;
