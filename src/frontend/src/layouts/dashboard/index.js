import React, { useState, useEffect } from "react";

// Librerías de terceros
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress"; // ✅ FALTABA ESTA IMPORTACIÓN

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Cards & Charts
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Services
import CalculationService from "services/calculation-service";
import UbicacionService from "services/ubicacion-service";
import UserService from "services/user-service";

// Componentes personalizados
import QTrendChart from "./components/QTrendChart";
import PTrendChart from "./components/PTrendChart";
import KTrendChart from "./components/KTrendChart";

// Imágenes
import PlayaIco from "assets/images/playa3.png";
import UserImg from "assets/images/user.png";
import CalculosImg from "assets/images/calculos1.png";
import UbicacionImg from "assets/images/ubicacion.png";

import DataTrazas from "layouts/trazas/DataTrazas";

// Loading Indicator
const LoadingIndicator = () => (
  <MDBox
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="50vh"
    flexDirection="column"
  >
    <CircularProgress size={60} thickness={4} color="info" />
    <MDTypography mt={2} variant="button" color="text">
      Iniciando...
    </MDTypography>
  </MDBox>
);

// Error Message
const ErrorMessage = ({ error, onRetry }) => (
  <MDBox p={3} textAlign="center">
    <MDTypography color="error" variant="h6">
      Ocurrió un error
    </MDTypography>
    <MDTypography color="text" variant="body2" mt={1}>
      {error || "Error desconocido al cargar datos."}
    </MDTypography>
    <MDButton variant="gradient" color="info" onClick={onRetry} sx={{ mt: 2 }}>
      Reintentar
    </MDButton>
  </MDBox>
);

// Imagen como ícono personalizado
const ImageIcon = ({ src, alt, fontSize = "small" }) => {
  const size = fontSize === "small" ? 25 : 40;
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        filter: "invert(1)",
      }}
    />
  );
};

// Componente principal
function Dashboard() {
  const [calculos, setCalculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ciudades, setCiudades] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  // Snackbar (mensaje informativo)
  const [mensaje, setMensaje] = useState({
    open: false,
    text: "",
    severity: "info",
  });

  const mostrarMensaje = (text, severity = "info") => {
    setMensaje({ open: true, text, severity });
  };

  // Cargar datos iniciales
  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [calculations, locations, city, user] = await Promise.all([
        CalculationService.getCalculation(),
        CalculationService.getLocations(),
        UbicacionService.getCiudades(),
        UserService.getUsers(),
      ]);

      if (!Array.isArray(calculations)) {
        throw new Error("Respuesta inválida de cálculos");
      }

      const normalizedLocations = Array.isArray(locations)
        ? locations.filter((loc) => loc && String(loc).trim() !== "")
        : [];

      setCalculos(calculations);
      setUbicaciones(normalizedLocations);
      setCiudades(city);
      DataTrazas.crear({ accion: "Vió el Inicio" });
      setUsuarios(user);
    } catch (error) {
      setError(error.message);
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error al cargar datos iniciales", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {error ? (
        <ErrorMessage error={error} onRetry={fetchInitialData} />
      ) : loading ? (
        <LoadingIndicator />
      ) : (
        <MDBox py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon={<ImageIcon src={CalculosImg} alt="Calculos" />}
                  title="Cálculos Realizados"
                  count={calculos.length}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon={<ImageIcon src={PlayaIco} alt="Áreas Estudiadas" />}
                  title="Áreas Estudiadas"
                  count={ubicaciones.length}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon={<ImageIcon src={UserImg} alt="Usuarios" />}
                  title="Usuarios"
                  count={usuarios.length}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon={<ImageIcon src={UbicacionImg} alt="Provincias" />}
                  title="Provincias"
                  count={ciudades.length}
                />
              </MDBox>
            </Grid>
          </Grid>

          {/* Sección de gráficos */}
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <QTrendChart />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <PTrendChart />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <KTrendChart />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
