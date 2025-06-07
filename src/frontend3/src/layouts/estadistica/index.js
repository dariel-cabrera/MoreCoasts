import React, { useState, useEffect } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  TextField
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from 'components/MDTypography';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButton from 'components/MDButton';
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import CalculationService from 'services/calculation-service';
import UbicacionService from "services/ubicacion-service";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from 'date-fns/locale/es';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print'
import PieChart from 'examples/Charts/PieChart';
import ReportesEstadisticos from './reporte';
import { useRef } from "react";

const ModuloEstadisticas = () => {
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('Todas');
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [datosQ, setDatosQ] = useState([]);
  const [datosK, setDatosK] = useState([]);
  const [datosP, setDatosP] = useState([]);
  const [chartDataQ, setChartDataQ] = useState({});
  const [chartDataK, setChartDataK] = useState({});
  const [chartDataP, setChartDataP] = useState({});

  // Cargar ubicaciones disponibles
  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const ubicaciones = await CalculationService.getLocations();
        setUbicaciones(ubicaciones);
      } catch (error) {
        console.error("Error cargando ubicaciones:", error);
      }
    };
    cargarUbicaciones();
  }, []);

   const reportRef = useRef();
   // Función para formatear datos de gráficos
  const formatearDatos = (data, parametro) => ({
    labels: data.map(item => new Date(item.fecha).toLocaleDateString()),
    datasets: {
      label: `Valor ${parametro}`,
      data: data.map(item => item[parametro])
    }
  });

  const formatearDatosPieChart = (data, parametro) => {
  const valores = {};

  data.map(item => {
    const fecha = new Date(item.fecha).toLocaleDateString();
    valores[fecha] = (valores[fecha] || 0) + item[parametro];
  });

  return {
    labels: Object.keys(valores),
    datasets: {
      label: `Distribución de ${parametro}`,
      data: Object.values(valores),
      backgroundColor: [
        "#42A5F5", "#66BB6A", "#FFA726", "#EF5350", "#AB47BC", "#29B6F6", "#FF7043", "#9CCC65"
      ],
    }
  };
};


   // Cargar datos según filtros
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const params = {
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFin: fechaFin.toISOString().split('T')[0],
          ubicacion: ubicacionSeleccionada === 'Todas' ? null : ubicacionSeleccionada
        };

        // Obtener datos para los 3 parámetros
        const [responseQ, responseK, responseP] = await Promise.all([
          CalculationService.getFiltrosQ(params),
          CalculationService.getFiltrosK(params),
          CalculationService.getFiltrosP(params)
        ]);

        setDatosQ(responseQ);
        setDatosK(responseK);
        setDatosP(responseP);

        // Formatear datos para cada gráfico
        setChartDataQ(formatearDatos(responseQ, 'Q'));
        setChartDataK(formatearDatos(responseK, 'K'));
        setChartDataP(formatearDatos(responseP, 'P'));
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [fechaInicio, fechaFin, ubicacionSeleccionada]);

   // Renderizar gráficos según el tipo seleccionado
  const renderGraficos = () => {
    const graficos = [];
    const parametros = [
      { data: chartDataQ, titulo: 'Valor Q', color: 'info' },
      { data: chartDataK, titulo: 'Valor K', color: 'dark' },
      { data: chartDataP, titulo: 'Valor P', color: 'success' }
    ];

    parametros.forEach((param) => {
      graficos.push(
        <Grid item xs={12} md={4} key={param.titulo}>
          {tipoGrafico === 'barras' && (
            <ReportsBarChart
              color={param.color}
              title={param.titulo}
              description="Datos históricos"
              chart={param.data}
            />
          )}
          
          {tipoGrafico === 'lineas' && (
            <ReportsLineChart
              color={param.color}
              title={param.titulo}
              description="Evolución temporal"
              chart={param.data}
            />
          )}

          {tipoGrafico === 'pastel' && (
          <PieChart
          icon={{ color: param.color, component: "pie_chart" }}
          title={param.titulo}
          description="Distribución por fecha"
          chart={formatearDatosPieChart(param.data, param.clave)}
          />
          )}
        </Grid>
      );
    });

    return graficos;
  };


  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Encabezado con título y botones */}
        <MDBox py={3} textAlign="center">
                <MDTypography variant="h4" fontWeight="medium" color="black">
                  Datos Estadísticos
                </MDTypography>
          </MDBox>
        <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={2} px={2}>
            <ReportesEstadisticos targetRef={reportRef} />
          </MDBox>

        {/* Filtros */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Fecha Inicial"
                value={fechaInicio}
                onChange={(newValue) => setFechaInicio(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Fecha Final"
                value={fechaFin}
                onChange={(newValue) => setFechaFin(newValue)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ubicación</InputLabel>
                <Select
                  value={ubicacionSeleccionada}
                  onChange={(e) => setUbicacionSeleccionada(e.target.value)}
                  label="Ubicación"
                >
                  <MenuItem value="Todas">Todas las ubicaciones</MenuItem>
                  {ubicaciones.map((ubicacion) => (
                    <MenuItem key={ubicacion} value={ubicacion}>
                      {ubicacion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Gráfico</InputLabel>
                <Select
                  value={tipoGrafico}
                  onChange={(e) => setTipoGrafico(e.target.value)}
                  label="Tipo de Gráfico"
                >
                  <MenuItem value="barras">Barras</MenuItem>
                  <MenuItem value="lineas">Líneas</MenuItem>
                  
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>

       {/* Gráficos */}
       <MDBox mt={4} ref={reportRef}>
          <Grid container spacing={3}>
          {renderGraficos()}
          </Grid>
      </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ModuloEstadisticas;