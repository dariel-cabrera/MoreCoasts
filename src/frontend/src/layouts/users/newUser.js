import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

export const NewUser = ({ user, setUser, limpiarDatos, editar }) => {
  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <MDBox sx={{ pl: 2 }}>
      <Grid container direction="column">
        <MDTypography variant="h5" fontWeight="medium" color="black" mt={1} mb={2}>
          Nuevo Usuario
        </MDTypography>

        <Grid container spacing={2}>
          {[
            { label: "Nombre de Usuario", name: "user" },
            { label: "Correo", name: "email" },
            { label: "Nombre", name: "name" },
            { label: "Apellido", name: "lastname" },
            { label: "Contraseña", name: "password" },
            { label: "Carnet de Identidad", name: "ci" },
          ].map((item, index) => (
            <Grid item xs={6} key={item.name}>
              <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                <MDInput
                  type={item.name === "ci" ? "number" : "text"}
                  label={item.label}
                  sx={{ width: "100%" }}
                  value={user[item.name] || ""}
                  name={item.name}
                  onChange={handleChange}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {/* Botones centrados */}
        <MDBox sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2} justifyContent="center">
            {editar ? (
              <>
                <Grid item>
                  <MDButton variant="gradient" color="warning" size="medium">
                    Actualizar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="info" size="medium">
                    Nuevo
                  </MDButton>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <MDButton variant="gradient" color="info" size="medium">
                    Aceptar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
                  </MDButton>
                </Grid>
              </>
            )}
          </Grid>
        </MDBox>
      </Grid>
    </MDBox>
  );
};
