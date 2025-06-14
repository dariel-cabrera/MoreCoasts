import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
import PieChart from 'examples/Charts/PieChart';
import ReportesEstadisticos from './reporte';

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

  const reportRef = useRef();

  // Cargar ubicaciones disponibles - CORREGIDO
  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const response = await CalculationService.getLocations();
        
        // Verificar y normalizar la respuesta
        let locationsData = [];
        
        if (Array.isArray(response)) {
          locationsData = response
            .filter(loc => loc && String(loc).trim() !== '')
            .map(loc => String(loc).trim());
        } 
        // Si el servicio devuelve un objeto con propiedades
        else if (typeof response === 'object' && response !== null) {
          locationsData = Object.values(response)
            .filter(loc => loc && String(loc).trim() !== '')
            .map(loc => String(loc).trim());
        }
        
        // Eliminar duplicados y ordenar
        const ubicacionesUnicas = [...new Set(locationsData)].sort();
        
        setUbicaciones(ubicacionesUnicas);
      } catch (error) {
        console.error("Error cargando ubicaciones:", error);
        setUbicaciones([]);
      }
    };
    
    cargarUbicaciones();
  }, []);

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
    
    data.forEach(item => {
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
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
          ubicacion: ubicacionSeleccionada === 'Todas' ? null : ubicacionSeleccionada
        };

        // Obtener datos para los 3 parámetros
        const [responseQ, responseK, responseP] = await Promise.all([
          CalculationService.getFiltrosQ(params),
          CalculationService.getFiltrosK(params),
          CalculationService.getFiltrosP(params)
        ]);

        setDatosQ(responseQ || []);
        setDatosK(responseK || []);
        setDatosP(responseP || []);

        // Formatear datos para cada gráfico
        if (responseQ) setChartDataQ(formatearDatos(responseQ, 'Q'));
        if (responseK) setChartDataK(formatearDatos(responseK, 'K'));
        if (responseP) setChartDataP(formatearDatos(responseP, 'P'));
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [fechaInicio, fechaFin, ubicacionSeleccionada]);

  // Renderizar gráficos según el tipo seleccionado
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

    const graficos = [];
    const parametros = [
      { data: datosQ, clave: 'Q', titulo: 'Valor Q', color: 'info' },
      { data: datosK, clave: 'K', titulo: 'Valor K', color: 'dark' },
      { data: datosP, clave: 'P', titulo: 'Valor P', color: 'success' }
    ];

    parametros.forEach((param) => {
      if (param.data.length === 0) return;

      let chartData;
      if (tipoGrafico === 'pastel') {
        chartData = formatearDatosPieChart(param.data, param.clave);
      } else {
        chartData = formatearDatos(param.data, param.clave);
      }

      graficos.push(
        <Grid item xs={12} md={4} key={param.titulo}>
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

    return graficos;
  };

  const handleExportPDF = async () => {
    // Combinar todos los datos en un solo array
    const allData = [...datosQ, ...datosK, ...datosP];
    
    if (allData.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    if (!reportRef.current) {
      console.error("El elemento de reporte no está disponible");
      return;
    }

    try {
      await ReportesEstadisticos.exportReports(
        reportRef.current,
        allData,
        {
          fechaInicio,
          fechaFin,
          ubicacion: ubicacionSeleccionada
        },
        'save'
      );
    } catch (error) {
      console.error("Error exportando PDF:", error);
    }
  };

  const handlePrint = async () => {
    const allData = [...datosQ, ...datosK, ...datosP];
    
    if (allData.length === 0) {
      console.warn("No hay datos para exportar");
      return;
    }

    if (!reportRef.current) {
      console.error("El elemento de reporte no está disponible");
      return;
    }

    try {
      await ReportesEstadisticos.exportReports(
        reportRef.current,
        allData,
        {
          fechaInicio,
          fechaFin,
          ubicacion: ubicacionSeleccionada
        },
        'print'
      );
    } catch (error) {
      console.error("Error imprimiendo PDF:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox py={3} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="black">
            Datos Estadísticos
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={2} px={2}>
          <MDBox display="flex" gap={2}>
            <MDButton
              variant="gradient"
              color="success"
              onClick={handlePrint}
              disabled={datosK.length===0 && datosP.length===0 && datosQ.length ===0}
            >
              Imprimir
            </MDButton>
            
            <MDButton
              variant="gradient"
              color="error"
              onClick={handleExportPDF}
              disabled={datosK.length===0 && datosP.length===0 && datosQ.length ===0}
            >
              Exportar PDF
            </MDButton>
          </MDBox>
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300, // Altura máxima del menú
                      },
                    },
                  }}
                >
                  <MenuItem value="Todas">Todas las ubicaciones</MenuItem>
                  {ubicaciones.map((ubicacion, index) => (
                    <MenuItem 
                      key={index} 
                      value={ubicacion}
                      style={{ whiteSpace: 'normal' }} // Asegura texto multilínea
                    >
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
                  <MenuItem value="pastel">Pastel</MenuItem>
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