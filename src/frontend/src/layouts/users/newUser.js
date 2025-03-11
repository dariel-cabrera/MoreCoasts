import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { actualizarDatos, crearDatos } from "./UserFunction";

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
          {editar ? "Editar Usuario" : "Nuevo Usuario"}
        </MDTypography>

        <Grid container spacing={2}>
          {[
            { label: "Nombre de Usuario", name: "user_name" },
            { label: "Correo", name: "email" },
            { label: "Nombre", name: "name" },
            { label: "Apellido", name: "lastname" },
            ...(!editar
              ? [
                  { label: "Contraseña", name: "password" },
                  { label: "Carnet de Identidad", name: "ci" },
                ]
              : []),
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
                  <MDButton
                    variant="gradient"
                    color="warning"
                    size="medium"
                    onClick={() => actualizarDatos({ user, getDatos, limpiarDatos })}
                  >
                    Actualizar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={() => crearDatos({ user, getDatos, limpiarDatos })}
                  >
                    Nuevo
                  </MDButton>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={() => crearDatos({ user, getDatos, limpiarDatos })}
                  >
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
