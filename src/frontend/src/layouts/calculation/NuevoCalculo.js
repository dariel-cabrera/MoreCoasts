// Importaciones 
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
import ConfiguracionService from "services/configuracion-service";

// Compomente Principal
export const NuevoCalculo = ({ calculo, setCalculo, editar, limpiarDatos, getDatos }) => {
  
  // Estados del Componente
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [configuracion, setConfiguracion] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Cargar ubicaciones desde la base de datos
  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const datos = await UbicacionService.getUbicaciones();
  
        const ubicacionesFormateadas = Array.isArray(datos)
          ? datos.map(area => ({
              id: area._id,
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
  
  // Cargar configuración
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const response = await ConfiguracionService.getConfiguration();
        
        
        // Verificar si la respuesta es un array y tiene al menos un elemento
        if (Array.isArray(response) && response.length > 0) {
          const config = response[0]; // Acceder al primer elemento del array
          
          
          const formattedConfig = {};
          
          // Mapeo directo de las propiedades recibidas
          formattedConfig._id = config._id || "";
          formattedConfig.densidad_aMin = Number(config.densidad_aMin) || 0;
          formattedConfig.densidad_aMax = Number(config.densidad_aMax) || 3000;
          formattedConfig.densidad_mMin = Number(config.densidad_mMin) || 0;
          formattedConfig.densidad_mMax = Number(config.densidad_mMax) || 2000;
          formattedConfig.coeficienteMin = Number(config.coeficienteMin) || 0;
          formattedConfig.coeficienteMax = Number(config.coeficienteMax) || 1;
          formattedConfig.indiceMin = Number(config.indiceMin) || 0;
          formattedConfig.indiceMax = Number(config.indiceMax) || 2;
          formattedConfig.alturaMin = Number(config.alturaMin) || 0.1;
          formattedConfig.alturaMax = Number(config.alturaMax) || 10;
          formattedConfig.anguloMin = Number(config.anguloMin) || 0;
          formattedConfig.anguloMax = Number(config.anguloMax) || 90;
          formattedConfig.aceleracionMin = Number(config.aceleracionMin) || 9.7;
          formattedConfig.aceleracionMax = Number(config.aceleracionMax) || 9.9;
          formattedConfig.PMin = Number(config.PMin) || 0;
          formattedConfig.PMax = Number(config.PMax) || 100;
          
          
          setConfiguracion(formattedConfig);
        } else {
          console.error("La configuración no tiene el formato esperado");
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      } finally {
        setLoadingConfig(false);
      }
    };
  
    cargarConfiguracion();
  }, []);

  // Funciones de Validacion
  // Si carga la configuracion por defecto
  const validateNumber = (name, value) => {
    if (!configuracion) return "Configuración no disponible";
    
    // Si es un numero
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Debe ingresar un número válido";

    const min = configuracion[`${name}Min`];
    const max = configuracion[`${name}Max`];

    // Si esta dentro de los limites
    if (typeof min !== 'number' || typeof max !== 'number') {
      return "Límites no configurados correctamente";
    }

    if (numValue < min) return `El valor debe ser ≥ ${min}`;
    if (numValue > max) return `El valor debe ser ≤ ${max}`;

    return "";
  };

  // Validacion del Formulario
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
    if (!loadingConfig) {
      validateForm();
    }
  }, [calculo, configuracion, loadingConfig]);

   // Manejadores de Eventos
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
  
   // Valida el campo cuando pierde el foco, 
   // Actualiza los errores específicos del campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateNumber(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Envío del Formulario
  const handleSubmit = (action) => {
    //Valida el formulario antes de enviar
    if (!validateForm()) return;

    //Filtra campos vacíos
    const datosEnviar = Object.fromEntries(
      Object.entries(calculo).filter(([_, v]) => v !== "")
    );

    //Ejecuta la acción correspondiente (calcular o actualizar)
    if (action === "calcular") {
      calcularDatos({ calculo: datosEnviar, getDatos, limpiarDatos });
    } else if (action === "actualizar") {
      actualizarDatos({ id: calculo.id, calculo: datosEnviar, getDatos, limpiarDatos });
    }
  };

  //  Renderizado Condicional
  // Estados de Carga y Error
  if (loadingConfig) {
    return (
      <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <MDTypography variant="h6">Cargando configuración...</MDTypography>
      </MDBox>
    );
  }

  if (!configuracion) {
    return (
      <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <MDTypography variant="h6" color="error">
          Error al cargar la configuración
        </MDTypography>
      </MDBox>
    );
  }

  // Renderizado del Formulario
  return (
    <MDBox sx={{ pl: 2 }}>
      <Grid container direction="column">
        <MDTypography variant="h5" fontWeight="medium" color="black" mt={1} mb={2}>
          Nuevo Cálculo
        </MDTypography>

        {/*Campos del Formulario */}
        <Grid container spacing={2}>
          {[
            { label: "Densidad del sedimento (ρs) [kg/m³]", name: "densidad_a", min: configuracion.densidad_aMin || 0, max: configuracion.densidad_aMax || 3000 },
            { label: "Densidad del Mar (ρ) [kg/m³]", name: "densidad_m", min: configuracion.densidad_mMin || 0, max: configuracion.densidad_mMax || 2000 },
            { label: "Coeficiente de Porosidad (n) ", name: "coeficiente", min: configuracion.coeficienteMin || 0, max: configuracion.coeficienteMax || 1, step: 0.01 },
            { label: "Índice de Rompiente (k) ", name: "indice", min: configuracion.indiceMin || 0, max: configuracion.indiceMax || 2, step: 0.01 },
            { label: "Altura (Hb) [m]", name: "altura", min: configuracion.alturaMin || 0.1, max: configuracion.alturaMax || 10 },
            { label: "Ángulo (α) [°]", name: "angulo", min: configuracion.anguloMin || 0, max: configuracion.anguloMax || 90 },
            { label: "Aceleración de la Gravedad (g) [m/s²]", name: "aceleracion", min: configuracion.aceleracionMin || 9.7, max: configuracion.aceleracionMax || 9.9 },
            { label: "Medición Práctica (P) [m³]", name: "P", min: configuracion.PMin || 0, max: configuracion.PMax || 100 },
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

           {/*Selector de Ubicación */}
          <Grid item xs={6}>
            <MDBox mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl sx={{ width: "100%", maxWidth: 300 }}>
                <InputLabel id="ubicacion-label">Ubicación</InputLabel>
                <Select
                  labelId="ubicacion-label"
                  id="ubicacion"
                  value={calculo.ubicacion || ""}
                  label="Ubicación"
                  onChange={(e) =>
                    setCalculo({ ...calculo, ubicacion: e.target.value })
                  }
                  sx={{ width: "100%" }}
                >
                  {ubicaciones.map((ubi) => (
                    <MenuItem key={ubi.id} value={ubi.nombre}>
                      {ubi.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <MDButton
                variant="outlined"
                color="info"
                onClick={() => window.open("/mapa", "_blank")}
                sx={{ height: "56px", mt: "8px" }}
              >
                Ir al mapa
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
        
        {/*Botones de Acción */}
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