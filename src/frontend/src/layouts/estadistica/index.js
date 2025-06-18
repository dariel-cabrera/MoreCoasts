import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Select, MenuItem, InputLabel, FormControl, TextField, CircularProgress
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from 'date-fns/locale/es';
import PieChart from 'examples/Charts/PieChart';
import DataTrazas from "layouts/trazas/DataTrazas";
import ReportesEstadisticos from './reporte';

// Loading Indicator
const LoadingIndicator = () => (
  <MDBox display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseUbicaciones = await CalculationService.getLocations();
      const locationsData = Array.isArray(responseUbicaciones)
        ? responseUbicaciones
        : Object.values(responseUbicaciones || {});

      const ubicacionesUnicas = [...new Set(locationsData.map(loc => loc && String(loc).trim()))]
        .filter(Boolean)
        .sort();

      setUbicaciones(ubicacionesUnicas);

      const params = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        ubicacion: ubicacionSeleccionada === 'Todas' ? null : ubicacionSeleccionada
      };

      const [responseQ, responseK, responseP] = await Promise.all([
        CalculationService.getFiltrosQ(params),
        CalculationService.getFiltrosK(params),
        CalculationService.getFiltrosP(params)
      ]);

      setDatosQ(responseQ || []);
      setDatosK(responseK || []);
      setDatosP(responseP || []);

      if (responseQ) setChartDataQ(formatearDatos(responseQ, 'Q'));
      if (responseK) setChartDataK(formatearDatos(responseK, 'K'));
      if (responseP) setChartDataP(formatearDatos(responseP, 'P'));
      DataTrazas.crear({ accion: "Vió los Datos Estadísticos" });
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err.message || "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, ubicacionSeleccionada]);

  const formatearDatos = (data, parametro) => ({
    labels: data.map(item => new Date(item.fecha).toLocaleDateString()),
    datasets: {
      label: `Valor ${parametro}`,
      data: data.map(item => item[parametro])
    }
  });

  const formatearDatosPieChart = (data, parametro) => {
  return {
    labels: data.map(item => `${new Date(item.fecha).toLocaleDateString()} (${item[parametro]})`),
    datasets: {
      label: `Distribución de ${parametro}`,
      data: data.map(item => item[parametro]),
      backgroundColor: [
        "#42A5F5", "#66BB6A", "#FFA726", "#EF5350",
        "#AB47BC", "#29B6F6", "#FF7043", "#9CCC65"
      ],
    }
  };
};

  const renderGraficos = () => {
      if (datosQ.length === 0 && datosK.length === 0 && datosP.length === 0) {
      return (
        <Grid item xs={12}>
          <MDBox textAlign="center" py={6}>
            <MDTypography variant="body1" color="text">
              No hay datos disponibles para los filtros seleccionados
            </MDTypography>
          </MDBox>
        </Grid>
      );
    }
    const parametros = [
      { data: datosQ, clave: 'Q', titulo: 'Valor Q', color: 'info' },
      { data: datosK, clave: 'K', titulo: 'Valor K', color: 'dark' },
      { data: datosP, clave: 'P', titulo: 'Valor P', color: 'success' }
    ];

    return parametros.map(param => {
      if (param.data.length === 0) return null;

      const chartData = tipoGrafico === 'pastel'
        ? formatearDatosPieChart(param.data, param.clave)
        : formatearDatos(param.data, param.clave);

      return (
        <Grid item xs={12} md={4} key={param.clave}>
          {tipoGrafico === 'barras' && (
            <ReportsBarChart
              color={param.color}
              title={param.titulo}
              description="Datos históricos"
              chart={chartData}
            />
          )}
          {tipoGrafico === 'lineas' && (
            <ReportsLineChart
              color={param.color}
              title={param.titulo}
              description="Evolución temporal"
              chart={chartData}
            />
          )}
          {tipoGrafico === 'pastel' && (
            <PieChart
              color={param.color}
              icon={{ color: param.color, component: "pie_chart" }}
              title={param.titulo}
              description="Distribución por fecha"
              chart={chartData}
            />
          )}
        </Grid>
      );
    });
  };

  const handleExportPDF = async () => {
    const allData = [...datosQ, ...datosK, ...datosP];
    if (!allData.length || !reportRef.current) return;
     DataTrazas.crear({ accion: "Ha exportado Pdf los Datos Estadístico" });
    await ReportesEstadisticos.exportReports(reportRef.current, allData, {
      fechaInicio, fechaFin, ubicacion: ubicacionSeleccionada
    }, 'save');
  };

  const handlePrint = async () => {
    const allData = [...datosQ, ...datosK, ...datosP];
    if (!allData.length || !reportRef.current) return;
    DataTrazas.crear({ accion: "Ha impreso los Datos Estadístico" });
    await ReportesEstadisticos.exportReports(reportRef.current, allData, {
      fechaInicio, fechaFin, ubicacion: ubicacionSeleccionada
    }, 'print');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {error ? (
        <ErrorMessage error={error} onRetry={cargarDatos} />
      ) : loading ? (
        <LoadingIndicator />
      ) : (
        <MDBox py={3}>
          <MDBox py={3} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium" color="black">
              Datos Estadísticos
            </MDTypography>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={2} px={2}>
            <MDButton variant="gradient" color="success" onClick={handlePrint}>Imprimir</MDButton>
            <MDButton variant="gradient" color="error" onClick={handleExportPDF} sx={{ ml: 2 }}>
              Exportar PDF
            </MDButton>
          </MDBox>

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
                  >
                    <MenuItem value="Todas">Todas</MenuItem>
                    {ubicaciones.map((ubic, idx) => (
                      <MenuItem key={idx} value={ubic}>
                        {ubic}
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
                  >
                    <MenuItem value="barras">Barras</MenuItem>
                    <MenuItem value="lineas">Líneas</MenuItem>
                    <MenuItem value="pastel">Pastel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Grid container spacing={3} ref={reportRef}>
            {renderGraficos()}
          </Grid>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
};

export default ModuloEstadisticas;
