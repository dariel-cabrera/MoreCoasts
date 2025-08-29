import { useState, useEffect } from "react";
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
  const [isFormValid, setIsFormValid] = useState(false);

  const isAdmin = editar && user.rol === "admin";

  useEffect(() => {
    validateForm();
  }, [user, confirmPassword]);

  // Validar confirmación cuando cambia la contraseña principal
  useEffect(() => {
    if (user.password) {
      const error = validateConfirmPassword(confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  }, [user.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isAdmin && (name === "user_name" || name === "rol")) {
      return;
    }

    setUser((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const val = value !== undefined && value !== null ? String(value) : "";
    let error = "";

    switch (name) {
      case "user_name":
        if (!val.trim()) error = "Campo requerido";
        else if (val.length < 3) error = "Mínimo 3 caracteres";
        else if (!/^[a-zA-Z0-9_]+$/.test(val)) error = "Solo letras, números y guiones bajos";
        break;
      case "email":
        if (!val.trim()) error = "Campo requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = "Correo inválido";
        break;
      case "name":
      case "lastname":
        if (!val.trim()) error = "Campo requerido";
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) error = "Solo letras y espacios";
        break;
      case "password":
        // En edición, la contraseña es opcional
        if (!editar) {
          // En creación es obligatoria
          if (!val) error = "Campo requerido";
          else if (val.length < 6) error = "Mínimo 6 caracteres";
          else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(val)) error = "Debe contener mayúscula y número";
        } else {
          // En edición, si se completa, debe cumplir requisitos
          if (val && val.length > 0) {
            if (val.length < 6) error = "Mínimo 6 caracteres";
            else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(val)) error = "Debe contener mayúscula y número";
          }
        }
        break;
      case "ci":
        // CI solo obligatorio en creación
        if (!editar) {
          if (!val) error = "Campo requerido";
          else if (!/^\d{11}$/.test(val)) error = "El CI debe tener exactamente 11 dígitos";
        }
        break;
      case "rol":
        if (!val) error = "Selecciona un rol";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateConfirmPassword = (value) => {
    let error = "";
    
    if (!editar) {
      // En creación es obligatorio
      if (!value.trim()) {
        error = "Campo requerido";
      } else if (value !== user.password) {
        error = "Las contraseñas no coinciden";
      }
    } else {
      // En edición, solo validar si se completó contraseña
      if (user.password && user.password.length > 0) {
        if (!value.trim()) {
          error = "Campo requerido para confirmar";
        } else if (value !== user.password) {
          error = "Las contraseñas no coinciden";
        }
      }
    }
    return error;
  };

  const validateForm = () => {
    const requiredFields = [
      "user_name",
      "email",
      "name",
      "lastname",
      "rol",
      ...(editar ? [] : ["ci"]) // CI solo en creación
    ];

    let isValid = true;
    const newErrors = {};

    // Validar campos obligatorios
    requiredFields.forEach((field) => {
      const value = user[field];
      const fieldValid = validateField(field, value);
      if (!fieldValid) isValid = false;
    });

    // Validación especial para contraseña en creación
    if (!editar) {
      const passwordValid = validateField("password", user.password);
      if (!passwordValid) isValid = false;
    }

    // Validar confirmación de contraseña
    const confirmPwdError = validateConfirmPassword(confirmPassword);
    if (confirmPwdError) {
      newErrors.confirmPassword = confirmPwdError;
      isValid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setIsFormValid(isValid);
    return isValid;
  };

  const handleSubmit = (action) => {
    if (validateForm()) {
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
            { label: "Nombre de Usuario", name: "user_name", type: "text", disabled: isAdmin },
            { label: "Correo", name: "email", type: "email" },
            { label: "Nombre", name: "name", type: "text" },
            { label: "Apellido", name: "lastname", type: "text" },
          ].map((item) => (
            <Grid item xs={6} key={item.name}>
              <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                <MDInput
                  type={item.type}
                  label={item.label}
                  name={item.name}
                  value={user[item.name] || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField(item.name, e.target.value)}
                  error={!!errors[item.name]}
                  helperText={errors[item.name]}
                  fullWidth
                  disabled={item.disabled || false}
                />
              </MDBox>
            </Grid>
          ))}

          {/* Campos de contraseña para ambos modos */}
          <Grid item xs={6}>
            <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
              <MDInput
                type="password"
                label={editar ? "Nueva Contraseña (opcional)" : "Contraseña"}
                name="password"
                value={user.password || ""}
                onChange={handleChange}
                onBlur={(e) => validateField("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password || (editar ? "Dejar vacío para mantener actual" : "")}
                fullWidth
              />
            </MDBox>
          </Grid>
          
          <Grid item xs={6}>
            <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
              <MDInput
                type="password"
                label={editar ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => {
                  const error = validateConfirmPassword(confirmPassword);
                  setErrors(prev => ({ ...prev, confirmPassword: error }));
                }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
              />
            </MDBox>
          </Grid>

          {/* CI solo en creación */}
          {!editar && (
            <Grid item xs={6}>
              <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                <MDInput
                  type="text"
                  label="Carnet de Identidad"
                  name="ci"
                  value={user.ci || ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    if (numericValue.length <= 11) {
                      handleChange({ target: { name: "ci", value: numericValue } });
                    }
                  }}
                  onBlur={(e) => validateField("ci", e.target.value)}
                  error={!!errors.ci}
                  helperText={errors.ci}
                  inputProps={{ maxLength: 11 }}
                  fullWidth
                />
              </MDBox>
            </Grid>
          )}

          {/* Rol */}
          <Grid item xs={6}>
            <MDBox mt={4} sx={{ width: "100%", maxWidth: 300 }}>
              <FormControl fullWidth error={!!errors.rol}>
                <InputLabel id="rol-label" shrink={!!user.rol}>Rol</InputLabel>
                <Select
                  name="rol"
                  labelId="rol-label"
                  value={user.rol || ""}
                  onChange={handleChange}
                  onBlur={(e) => validateField("rol", e.target.value)}
                  displayEmpty
                  label="Rol"
                  disabled={isAdmin}
                >
                  <MenuItem value="" disabled>
                    <em>Seleccione un rol</em>
                  </MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="worker">Trabajador</MenuItem>
                </Select>
                {errors.rol && <FormHelperText>{errors.rol}</FormHelperText>}
              </FormControl>
            </MDBox>
          </Grid>
        </Grid>

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
                    disabled={!isFormValid}
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
                    disabled={!isFormValid}
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