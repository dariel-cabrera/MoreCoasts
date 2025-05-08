import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { actualizarDatos, calcularDatos } from "./CalculationFunction";
import { useState, useEffect } from "react";
import UbicacionService from 'services/ubicacion-service';

export const NuevoCalculo = ({ calculo, setCalculo, editar, limpiarDatos, getDatos }) => {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [ubicaciones, setUbicaciones] = useState([]);

  // Cargar ubicaciones desde la base de datos
  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const datos = await UbicacionService.getUbicaciones();
  
        // Transformar las ubicaciones a un array de objetos { id, nombre }
        const ubicacionesFormateadas = Array.isArray(datos)
          ? datos.map(area => ({
              id:area._id,
              nombre: area.nombre || 'Sin nombre',
            }))
          : [];
  
        setUbicaciones(ubicacionesFormateadas);
      } catch (error) {
        console.error("Error al obtener las ubicaciones:", error);
      }
    };
  
    obtenerUbicaciones();
  }, []);
  

  const validateNumber = (name, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Debe ingresar un número válido";

    switch (name) {
      case "densidad_a":
      case "densidad_m":
        if (numValue <= 0) return "La densidad debe ser mayor a 0";
        if (numValue > 3000) return "Valor de densidad demasiado alto";
        break;
      case "coeficiente":
        if (numValue < 0) return "No puede ser negativo";
        if (numValue > 1) return "El coeficiente debe ser ≤ 1";
        break;
      case "indice":
        if (numValue < 0) return "No puede ser negativo";
        break;
      case "altura":
        if (numValue <= 0) return "La altura debe ser positiva";
        break;
      case "angulo":
        if (numValue < 0 || numValue > 90) return "Ángulo debe estar entre 0° y 90°";
        break;
      case "aceleracion":
        if (numValue <= 0) return "Debe ser mayor a 0";
        if (numValue > 20) return "Valor demasiado alto";
        break;
      case "P":
        if (numValue < 0) return "No puede ser negativo";
        break;
      default:
        return "";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const fields = [
      "densidad_a", "densidad_m", "coeficiente",
      "indice", "altura", "angulo", "aceleracion", "P"
    ];

    fields.forEach(field => {
      const error = validateNumber(field, calculo[field] || "");
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [calculo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setCalculo({ ...calculo, [name]: "" });
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setCalculo({ ...calculo, [name]: numValue });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateNumber(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (action) => {
    if (!validateForm()) return;

    const datosEnviar = Object.fromEntries(
      Object.entries(calculo).filter(([_, v]) => v !== "")
    );

    if (action === "calcular") {
      calcularDatos({ calculo: datosEnviar, getDatos, limpiarDatos });
    } else if (action === "actualizar") {
      actualizarDatos({ id: calculo.id, calculo: datosEnviar, getDatos, limpiarDatos });
    }
  };

  return (
    <MDBox sx={{ pl: 2 }}>
      <Grid container direction="column">
        <MDTypography variant="h5" fontWeight="medium" color="black" mt={1} mb={2}>
          Nuevo Cálculo
        </MDTypography>

        <Grid container spacing={2}>
          {[
            { label: "Densidad de Arena (kg/m³)", name: "densidad_a", min: 0.1, max: 3000 },
            { label: "Densidad del Mar (kg/m³)", name: "densidad_m", min: 0.1, max: 3000 },
            { label: "Coeficiente de Porosidad", name: "coeficiente", min: 0, max: 1, step: 0.01 },
            { label: "Índice", name: "indice", min: 0 },
            { label: "Altura (m)", name: "altura", min: 0.01 },
            { label: "Ángulo (°)", name: "angulo", min: 0, max: 90 },
            { label: "Aceleración de la Gravedad (m/s²)", name: "aceleracion", min: 0.1, max: 20 },
            { label: "Medición Práctica (P)", name: "P", min: 0 },
          ].map((item, index) => (
            <Grid item xs={6} key={item.name}>
              <MDBox mt={2} sx={{ width: "100%", maxWidth: 300, mb: index === 7 ? 6 : 0 }}>
                <MDInput
                  type="number"
                  label={item.label}
                  sx={{ width: "100%" }}
                  value={calculo[item.name] ?? ""}
                  name={item.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors[item.name]}
                  helperText={errors[item.name]}
                  inputProps={{
                    min: item.min,
                    max: item.max,
                    step: item.step || "any"
                  }}
                />
              </MDBox>
            </Grid>
          ))}

          {/* Campo de ubicación */}
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mt: 4, maxWidth: 300 }}>
              <InputLabel id="ubicacion-label">Ubicación</InputLabel>
              <Select
                labelId="ubicacion-label"
                id="ubicacion"
                value={calculo.ubicacion || ""}
                label="Ubicación"
                onChange={(e) =>
                  setCalculo({ ...calculo, ubicacion: e.target.value })
                }
              >
                {ubicaciones.map((ubi) => (
                  <MenuItem key={ubi.id} value={ubi.nombre}>
                    {ubi.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2} sx={{ display: "flex", alignItems: "center", mt: 4 }}>
            <MDButton
              variant="outlined"
              color="info"
              onClick={() => window.open("/mapa", "_blank")}
            >
              Ir al mapa
            </MDButton>
          </Grid>
        </Grid>

        {/* Botones de acción */}
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
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={() => handleSubmit("calcular")}
                    disabled={!isFormValid}
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
                    onClick={() => handleSubmit("calcular")}
                    disabled={!isFormValid}
                  >
                    Calcular
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
