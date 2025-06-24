import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useState, useEffect } from "react";
import React from 'react';
import ConfiguracionService from 'services/configuracion-service';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DataTrazas from "layouts/trazas/DataTrazas";
import Footer from 'examples/Footer';

export const Configuracion = () => {
  const initialConfigState = {
    _id: "",
    densidad_aMax: "",
    densidad_aMin: "",
    densidad_mMin: "",
    densidad_mMax: "",
    indiceMax: "",
    indiceMin: "",
    coeficienteMax: "",
    coeficienteMin: "",
    alturaMax: "",
    alturaMin: "",
    anguloMax: "",
    anguloMin: "",
    aceleracionMax: "",
    aceleracionMin: "",
    PMax: "",
    PMin: "",
  };

  const [configuracion, setConfiguracion] = useState(initialConfigState);
  const [originalConfig, setOriginalConfig] = useState(initialConfigState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const response = await ConfiguracionService.getConfiguration();
        
        
        if (Array.isArray(response) && response.length > 0) {
          const config = response[0];
          
          
          const formattedConfig = {
            _id: config._id || "",
            densidad_aMin: config.densidad_aMin !== undefined ? Number(config.densidad_aMin) : "",
            densidad_aMax: config.densidad_aMax !== undefined ? Number(config.densidad_aMax) : "",
            densidad_mMin: config.densidad_mMin !== undefined ? Number(config.densidad_mMin) : "",
            densidad_mMax: config.densidad_mMax !== undefined ? Number(config.densidad_mMax) : "",
            coeficienteMin: config.coeficienteMin !== undefined ? Number(config.coeficienteMin) : "",
            coeficienteMax: config.coeficienteMax !== undefined ? Number(config.coeficienteMax) : "",
            indiceMin: config.indiceMin !== undefined ? Number(config.indiceMin) : "",
            indiceMax: config.indiceMax !== undefined ? Number(config.indiceMax) : "",
            alturaMin: config.alturaMin !== undefined ? Number(config.alturaMin) : "",
            alturaMax: config.alturaMax !== undefined ? Number(config.alturaMax) : "",
            anguloMin: config.anguloMin !== undefined ? Number(config.anguloMin) : "",
            anguloMax: config.anguloMax !== undefined ? Number(config.anguloMax) : "",
            aceleracionMin: config.aceleracionMin !== undefined ? Number(config.aceleracionMin) : "",
            aceleracionMax: config.aceleracionMax !== undefined ? Number(config.aceleracionMax) : "",
            PMin: config.PMin !== undefined ? Number(config.PMin) : "",
            PMax: config.PMax !== undefined ? Number(config.PMax) : "",
          };
          setConfiguracion(formattedConfig);
          setOriginalConfig(formattedConfig);
        } else {
          console.error("La configuración no tiene el formato esperado");
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      } finally {
        setLoading(false);  // Corregido: estaba usando setLoadingConfig que no estaba definido
      }
    };
    DataTrazas.crear({ accion: "Vió la Configuración del Sistema" });
    cargarConfiguracion();
  }, []);

  const validateConfig = (name, value) => {
    if (value === "") return "Este campo es requerido";
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Debe ser un número válido";

    const rules = {
      densidad_aMin: val => configuracion.densidad_aMax === "" || val < parseFloat(configuracion.densidad_aMax),
      densidad_aMax: val => configuracion.densidad_aMin === "" || val > parseFloat(configuracion.densidad_aMin),
      densidad_mMin: val => configuracion.densidad_mMax === "" || val < parseFloat(configuracion.densidad_mMax),
      densidad_mMax: val => configuracion.densidad_mMin === "" || val > parseFloat(configuracion.densidad_mMin),
      coeficienteMin: val => configuracion.coeficienteMax === "" || val < parseFloat(configuracion.coeficienteMax),
      coeficienteMax: val => configuracion.coeficienteMin === "" || val > parseFloat(configuracion.coeficienteMin),
      indiceMin: val => configuracion.indiceMax === "" || val < parseFloat(configuracion.indiceMax),
      indiceMax: val => configuracion.indiceMin === "" || val > parseFloat(configuracion.indiceMin),
      alturaMin: val => configuracion.alturaMax === "" || val < parseFloat(configuracion.alturaMax),
      alturaMax: val => configuracion.alturaMin === "" || val > parseFloat(configuracion.alturaMin),
      anguloMin: val => configuracion.anguloMax === "" || val < parseFloat(configuracion.anguloMax),
      anguloMax: val => configuracion.anguloMin === "" || val > parseFloat(configuracion.anguloMin),
      aceleracionMin: val => configuracion.aceleracionMax === "" || val < parseFloat(configuracion.aceleracionMax),
      aceleracionMax: val => configuracion.aceleracionMin === "" || val > parseFloat(configuracion.aceleracionMin),
      PMin: val => configuracion.PMax === "" || val < parseFloat(configuracion.PMax),
      PMax: val => configuracion.PMin === "" || val > parseFloat(configuracion.PMin),
    };

    if (rules[name] && !rules[name](numValue)) {
      return "Rango inválido: revise los valores mínimo y máximo";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateConfig(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    setConfiguracion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateConfig(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    if (value !== "") {
      setConfiguracion(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    }
  };

  const handleGuardar = async () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(configuracion).forEach(key => {
      if (key === '_id') return;
      
      const error = validateConfig(key, configuracion[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    try {
      await ConfiguracionService.updateConfiguration(configuracion._id, configuracion);
      setOriginalConfig(configuracion);
      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      alert("Error al guardar la configuración");
    }
  };

  const handleCancelar = () => {
    setConfiguracion(originalConfig);
    setErrors({});
  };

  const configPairs = [
    { labelMin: "Densidad sedimento - Mínimo [kg/m³]", nameMin: "densidad_aMin", labelMax: "Máximo", nameMax: "densidad_aMax" },
    { labelMin: "Densidad mar - Mínimo [kg/m³]", nameMin: "densidad_mMin", labelMax: "Máximo", nameMax: "densidad_mMax" },
    { labelMin: "Coeficiente porosidad - Mínimo", nameMin: "coeficienteMin", labelMax: "Máximo", nameMax: "coeficienteMax" },
    { labelMin: "Índice rompiente - Mínimo", nameMin: "indiceMin", labelMax: "Máximo", nameMax: "indiceMax" },
    { labelMin: "Altura - Mínimo [m]", nameMin: "alturaMin", labelMax: "Máximo", nameMax: "alturaMax" },
    { labelMin: "Ángulo - Mínimo [°]", nameMin: "anguloMin", labelMax: "Máximo", nameMax: "anguloMax" },
    { labelMin: "Aceleración gravedad - Mínimo [m/s²]", nameMin: "aceleracionMin", labelMax: "Máximo", nameMax: "aceleracionMax" },
    { labelMin: "Medición práctica - Mínimo [m³]", nameMin: "PMin", labelMax: "Máximo", nameMax: "PMax" },
  ];

  if (loading) {
    return (
      <MDBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <MDTypography variant="h6">Cargando configuración...</MDTypography>
      </MDBox>
    );
  }

  return (
    <DashboardLayout sx={{ width: "100%" }}>
      <DashboardNavbar />
    <MDBox sx={{ pl: 2 }}>
      <Grid container direction="column">
      <MDBox py={3} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="black">
                  Configuración de Límites
            </MDTypography>
        </MDBox>
        <Grid container spacing={2}>
          {configPairs.map(({ labelMin, nameMin, labelMax, nameMax }) => (
            <React.Fragment key={`${nameMin}-${nameMax}`}>
              <Grid item xs={6}>
                <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                  <MDInput
                    type="number"
                    label={labelMin}
                    sx={{ width: "100%" }}
                    name={nameMin}
                    value={configuracion[nameMin] ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors[nameMin]}
                    helperText={errors[nameMin]}
                    inputProps={{
                      step: nameMin.includes("coeficiente") || nameMin.includes("indice") ? "0.01" : "any"
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={6}>
                <MDBox mt={2} sx={{ width: "100%", maxWidth: 300 }}>
                  <MDInput
                    type="number"
                    label={labelMax}
                    sx={{ width: "100%" }}
                    name={nameMax}
                    value={configuracion[nameMax] ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors[nameMax]}
                    helperText={errors[nameMax]}
                    inputProps={{
                      step: nameMax.includes("coeficiente") || nameMax.includes("indice") ? "0.01" : "any"
                    }}
                  />
                </MDBox>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <MDBox sx={{ mt: 4, width: "100%" }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <MDButton
                variant="gradient"
                color="info"
                size="medium"
                onClick={handleGuardar}
                disabled={Object.values(errors).some(e => e)}
              >
                Guardar
              </MDButton>
            </Grid>
            <Grid item>
              <MDButton
                variant="gradient"
                color="error"
                size="medium"
                onClick={handleCancelar}
              >
                Cancelar
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Grid>
    </MDBox>
    <Footer />
    </DashboardLayout>
  );
};