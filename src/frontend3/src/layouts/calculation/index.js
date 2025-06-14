import React, { useState, useEffect } from 'react';
import { Card, Snackbar, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { TablaCalculo } from './table/dataTable';
import CalculationService from 'services/calculation-service';
import { NuevoCalculo } from './NuevoCalculo';
import { eliminarDatos } from './CalculationFunction';
import DataTable from 'examples/Tables/DataTable';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import PDFExporter from './PDFExporter';
import dayjs from 'dayjs';

const CALCULO_INICIAL = {
  densidad_a: 0,
  densidad_m: 0,
  coeficiente: 0,
  indice: 0,
  altura: 0,
  angulo: 0,
  aceleracion: 0,
  P: 0,
  id: 0,
  ubicacion: '',
};

function Calculation() {
  const [calculo, setCalculo] = useState(CALCULO_INICIAL);
  const [editar, setEditar] = useState(false);
  const [mstNvoCalc, setMstNvoCalc] = useState(false);
  const [calculos, setCalculos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    fechaInicio: null, 
    fechaFin: null, 
    ubicacion: '' 
  });

  const [mensaje, setMensaje] = useState({ 
    open: false, 
    text: '', 
    severity: 'info' 
  });

  const mostrarMensaje = (text, severity = 'info') => {
    setMensaje({ open: true, text, severity });
  };

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [calculations, locations] = await Promise.all([
        CalculationService.getCalculation(),
        CalculationService.getLocations()
      ]);

      const normalizedLocations = Array.isArray(locations) 
        ? locations.filter(loc => loc && String(loc).trim() !== '')
        : [];

      setCalculos(calculations);
      setUbicaciones(normalizedLocations);
    } catch (error) {
      setError(error.message);
      mostrarMensaje("Error al cargar datos iniciales", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getFilteredData = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CalculationService.getFiltrosCalculation(params);
      setCalculos(data);
      if (data.length === 0) mostrarMensaje("No se encontraron resultados", 'warning');
    } catch (error) {
      setError(error.message);
      mostrarMensaje(`Error al filtrar: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (name, date) => {
    setFiltros(prev => ({ ...prev, [name]: date }));
  };

  const applyFilters = () => {
    if (!filtros.fechaInicio && !filtros.fechaFin && !filtros.ubicacion) {
      mostrarMensaje("Debe aplicar al menos un filtro", 'warning');
      return;
    }
    
    if (filtros.fechaInicio && filtros.fechaFin && dayjs(filtros.fechaInicio).isAfter(filtros.fechaFin)) {
      mostrarMensaje("La fecha de inicio no puede ser mayor que la fecha fin", 'error');
      return;
    }
    
    const params = {
      ...(filtros.fechaInicio && { fechaInicio: dayjs(filtros.fechaInicio).format('YYYY-MM-DD') }),
      ...(filtros.fechaFin && { fechaFin: dayjs(filtros.fechaFin).format('YYYY-MM-DD') }),
      ...(filtros.ubicacion && { ubicacion: filtros.ubicacion.trim() })
    };
    
    getFilteredData(params);
  };

  const clearFilters = () => {
    setFiltros({ fechaInicio: null, fechaFin: null, ubicacion: '' });
    fetchInitialData();
  };

  const handleExportPDF = () => {
    if (calculos.length === 0) {
      mostrarMensaje("No hay datos para exportar", 'warning');
      return;
    }
    PDFExporter.exportCalculations(calculos, filtros);
  };

  const handlePrint = () => {
    if (calculos.length === 0) {
      mostrarMensaje("No hay datos para imprimir", 'warning');
      return;
    }
    PDFExporter.exportCalculations(calculos, filtros, 'print');
  };

  const LoadingIndicator = () => (
    <MDBox display="flex" justifyContent="center" alignItems="center" height="300px" flexDirection="column">
      <CircularProgress size={60} thickness={4} color="info" />
      <MDTypography mt={2} variant="button" color="text">
        Cargando datos de cálculos...
      </MDTypography>
    </MDBox>
  );

  const ErrorMessage = ({ error, onRetry }) => (
    <MDBox p={3} textAlign="center" color="error">
      <MDTypography color="error" variant="h6">
        Ocurrió un error
      </MDTypography>
      <MDTypography color="text" variant="body2">
        {error}
      </MDTypography>
      <MDButton 
        variant="gradient" 
        color="info" 
        onClick={onRetry}
        sx={{ mt: 2 }}
      >
        Reintentar
      </MDButton>
    </MDBox>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black">
          Gestión de Cálculos
        </MDTypography>
      </MDBox>

      {error ? (
        <ErrorMessage error={error} onRetry={fetchInitialData} />
      ) : loading ? (
        <LoadingIndicator />
      ) : mstNvoCalc ? (
        <NuevoCalculo
          calculo={calculo}
          setCalculo={setCalculo}
          editar={editar}
          limpiarDatos={() => {
            setCalculo(CALCULO_INICIAL);
            setEditar(false);
            setMstNvoCalc(false);
          }}
          getDatos={fetchInitialData}
        />
      ) : (
        <>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2} px={2}>
            <MDButton variant="gradient" color="info" onClick={() => setMstNvoCalc(true)}>
              Nuevo 
            </MDButton>
            
            <MDBox display="flex" gap={2}>
              <MDButton
                variant="gradient"
                color="success"
                onClick={handlePrint}
                disabled={calculos.length === 0}
              >
                Imprimir
              </MDButton>
              
              <MDButton
                variant="gradient"
                color="error"
                onClick={handleExportPDF}
                disabled={calculos.length === 0}
              >
                Exportar PDF
              </MDButton>
            </MDBox>
          </MDBox>

          <AdvancedSearchFilters
            filters={filtros}
            locations={ubicaciones}
            onFilterChange={handleFilterChange}
            onDateChange={handleDateChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />

          <MDBox pt={3} pb={3}>
            <Card>
              <MDBox 
                mx={2} 
                mt={-3} 
                py={3} 
                px={2} 
                bgColor="info" 
                borderRadius="lg" 
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Resultados de Cálculos ({calculos.length})
                </MDTypography>
              </MDBox>
              
              <MDBox pt={3}>
                <DataTable
                  table={TablaCalculo({
                    datos: calculos,
                    onEditar: (val) => {
                      setEditar(true);
                      setMstNvoCalc(true);
                      setCalculo({ ...val, id: val._id });
                    },
                    onEliminar: (id) => { 
                      eliminarDatos({ idValue: id, getDatos: fetchInitialData });
                      
                    }
                    })
                  }
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </MDBox>
        </>
      )}

      <Snackbar
        open={mensaje.open}
        autoHideDuration={4000}
        onClose={() => setMensaje(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMensaje(prev => ({ ...prev, open: false }))} 
          severity={mensaje.severity}
          sx={{ width: '100%' }}
        >
          {mensaje.text}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Calculation;