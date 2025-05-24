//  Librerías de terceros
//Grid de Material UI se usa para estructurar la disposición de los 
// elementos en filas y columnas.
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
// MDBox es un contenedor personalizado basado en Box de Material UI, utilizado 
// para estructurar y dar estilo a los elementos
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
// DashboardLayout: Contenedor principal del panel de control.
// DashboardNavbar: Barra de navegación superior del panel.
// Footer: Pie de página del panel.
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
/*ReportsBarChart → Gráfico de barras.
ReportsLineChart → Gráfico de líneas.
ComplexStatisticsCard → Tarjetas de estadísticas con iconos y valores */
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// reportsBarChartData: Datos del gráfico de barras.
// reportsLineChartData: Datos del gráfico de líneas.
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
// Projects: Muestra una lista de proyectos.
// OrdersOverview: Resumen de pedidos recientes.
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import React, { useState, useEffect } from 'react';
import CalculationService from 'services/calculation-service';
import UbicacionService from "services/ubicacion-service";
import UserService from "services/user-service";
import QTrendChart from "./components/QTrendChart";
import PTrendChart from "./components/PTrendChart";
import KTrendChart from "./components/KTrendChart";

import PlayaIco from "assets/images/playa3.png"
import UserImg from "assets/images/user.png";
import CalculosImg from "assets/images/calculos1.png";
import UbicacionImg from "assets/images/ubicacion.png"

// Se extraen sales y tasks desde reportsLineChartData,
// que contienen los datos del gráfico de líneas.
function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [calculos, setCalculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ciudades, setCiudades] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [usuarios,setUsuarios]= useState([]);
  const [error, setError] = useState(null);
  

  const ImageIcon = ({ src, alt, fontSize = "small" }) => {
  const size = fontSize === "small" ? 25 : 40; // Ajusta los tamaños según necesites
  
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: size, 
        height: size,
        filter: "invert(1)", // Opcional: si necesitas que sean blancos
      }} 
    />
  );
};
  // Estados para mensajes de error o éxito
    const [mensaje, setMensaje] = useState({ 
      open: false, 
      text: '', 
      severity: 'info' 
    });
  
    // Mostrar snackbar con mensaje
    const mostrarMensaje = (text, severity = 'info') => {
      setMensaje({ open: true, text, severity });
    };

  // Cargar datos iniciales
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [calculations, locations,city,user] = await Promise.all([
          CalculationService.getCalculation(),
          CalculationService.getLocations(),
          UbicacionService.getCiudades(),
          UserService.getUsers()
        ]);
  
        if (!Array.isArray(calculations)) throw new Error("Respuesta inválida de cálculos");
        
        const normalizedLocations = Array.isArray(locations) 
          ? locations.filter(loc => loc && String(loc).trim() !== '')
          : [];
  
        setCalculos(calculations);
        setUbicaciones(normalizedLocations);
        setCiudades(city);
        setUsuarios(user);
        console.log(city);
      } catch (error) {
        setError(error.message);
        console.error("Error al cargar datos:", error);
        mostrarMensaje("Error al cargar datos iniciales", 'error');
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
      {/*Sección de Tarjetas de Estadísticas */}
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon={<ImageIcon src={CalculosImg} alt="Calculos" fontSize="small" />}
                title="Cálculos Realizados"
                count= {calculos.length}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon={<ImageIcon src={PlayaIco} alt="Calculos" fontSize="small" />}
                title="Areas Estudiadas"
                count={ubicaciones.length}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon={<ImageIcon src={UserImg} alt="Calculos" fontSize="small" />}
                title="Usuarios"
                count={usuarios.length}
                
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon={<ImageIcon src={UbicacionImg} alt="Calculos" fontSize="small" />}
                title="Provincias"
                count={ciudades.length}
              />
            </MDBox>
          </Grid>
        </Grid>
        {/*Sección de Gráficos */}
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
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
