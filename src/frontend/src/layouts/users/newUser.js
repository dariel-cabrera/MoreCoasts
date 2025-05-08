import { useState } from "react";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import { actualizarDatos, crearDatos } from "./UserFunction";

export const NewUser = ({ user, setUser, limpiarDatos, editar, getDatos }) => {
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!user.user_name) newErrors.user_name = "Campo requerido";
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Correo inválido";
    if (!user.name) newErrors.name = "Campo requerido";
    if (!user.lastname) newErrors.lastname = "Campo requerido";
    if (!editar && (!user.password || user.password.length < 6))
      newErrors.password = "Mínimo 6 caracteres";
    if (!editar && confirmPassword !== user.password)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!editar && !user.ci) newErrors.ci = "Campo requerido";
    if (!user.role) newErrors.role = "Selecciona un rol";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (action) => {
    if (validate()) {
      if (action === "crear") {
        crearDatos({ user, getDatos, limpiarDatos });
      } else {
        actualizarDatos({ user, getDatos, limpiarDatos });
      }
    }
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
          ].map((item) => (
            <Grid item xs={6} key={item.name}>
              <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                <MDInput
                  type="text"
                  label={item.label}
                  name={item.name}
                  value={user[item.name] || ""}
                  onChange={handleChange}
                  error={!!errors[item.name]}
                  helperText={errors[item.name]}
                  fullWidth
                />
              </MDBox>
            </Grid>
          ))}

          {!editar && (
            <>
              <Grid item xs={6}>
                <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                  <MDInput
                    type="password"
                    label="Contraseña"
                    name="password"
                    value={user.password || ""}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                  />
                </MDBox>
              </Grid>

              <Grid item xs={6}>
                <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                  <MDInput
                    type="password"
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    fullWidth
                  />
                </MDBox>
              </Grid>

              <Grid item xs={6}>
                <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                  <MDInput
                    type="number"
                    label="Carnet de Identidad"
                    name="ci"
                    value={user.ci || ""}
                    onChange={handleChange}
                    error={!!errors.ci}
                    helperText={errors.ci}
                    fullWidth
                  />
                </MDBox>
              </Grid>
            </>
          )}

          {/* Rol */}
          <Grid item xs={6}>
            <MDBox mt={4} sx={{ width: "100%", maxWidth: 300 }}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={user.role || ""}
                  onChange={handleChange}
                  label="Rol"
                >
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="worker">Trabajador</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </MDBox>
          </Grid>
        </Grid>

        {/* Botones */}
        <MDBox sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2} justifyContent="center">
            {editar ? (
              <>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="warning"
                    size="medium"
                    onClick={() => handleSubmit("actualizar")}
                  >
                    Actualizar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
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
                    onClick={() => handleSubmit("crear")}
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

