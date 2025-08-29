// Librerías de terceros
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MDButton from "components/MDButton";

import { Card } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import TrazasService from "services/trazas-service";
import DataTrazas from "./DataTrazas";
import { TablaTrazas } from "./table";
import AdvancedSearchFilters from "./AdavancedSeachFilters";
import PDFExporter from "./PDFExporer";
import dayjs from "dayjs";

function Trazas() {
  const [trazas, setTrazas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ fechaInicio: null, fechaFin: null, users: '' });
  const [usuarios, setUsuarios] = useState([]);
  // Estados para mensajes de error o éxito
  const [mensaje, setMensaje] = useState({ open: false, text: '', severity: 'info' });

  // Mostrar snackbar con mensaje
  const mostrarMensaje = (text, severity = 'info') => {
    setMensaje({ open: true, text, severity });
  };

  const fetchInitialData = async () => {
  setLoading(true);
  setError(null);
  try {
    const [datos, users] = await Promise.all([
      TrazasService.getTrazas(),
      TrazasService.getUsers(), 
    ]);

    // Versión más segura para normalizar usuarios
    const normalizedUsers = Array.isArray(users) 
      ? users.filter(user => {
          if (user === null || user === undefined) return false;
          const userStr = String(user);
          return userStr.trim() !== '';
        })
      : [];

    setTrazas(datos);
    setUsuarios(normalizedUsers);

  } catch (error) {
    setError(error.message);
    mostrarMensaje("Error al cargar datos iniciales", 'error');
    
    
    // Debug: Mostrar el valor de users si está disponible
    if (error.response?.data) {
      console.log("Datos recibidos del servidor:", error.response.data);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Obtener datos filtrados del backend
  const getFilteredData = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TrazasService.getFiltrosTrazas(params);
      if (!Array.isArray(data)) throw new Error("Respuesta inválida del servidor");
      setTrazas(data);
      if (data.length === 0) mostrarMensaje("No se encontraron resultados", 'warning');
    } catch (error) {
      setError(error.message);
      console.error("Error al filtrar datos:", error);
      mostrarMensaje(`Error al filtrar: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const LoadingIndicator = () => (
    <MDBox display="flex" justifyContent="center" alignItems="center" height="300px" flexDirection="column">
      <CircularProgress size={60} thickness={4} color="info" />
      <MDTypography mt={2} variant="button" color="text">
        Cargando datos de trazas...
      </MDTypography>
    </MDBox>
  );

  // Componente de Error
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

  // Manejadores de filtros
  const handleFilterChange = (e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDateChange = (name, date) => setFiltros(prev => ({ ...prev, [name]: date }));

  const applyFilters = () => {
    if (!filtros.fechaInicio && !filtros.fechaFin && !filtros.users) {
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
      ...(filtros.users && { users: filtros.users.trim() })
    };
    
    getFilteredData(params);
  };

  const clearFilters = () => {
    setFiltros({ fechaInicio: null, fechaFin: null, users: '' });
    fetchInitialData();
  };

  const handleExportPDF = () => {
      if (trazas.length === 0) {
        mostrarMensaje("No hay datos para exportar", 'warning');
        return;
      }
      PDFExporter.exportTrazas(trazas, filtros);
    };
  
    const handlePrint = () => {
      if (trazas.length === 0) {
        mostrarMensaje("No hay datos para imprimir", 'warning');
        return;
      }
      PDFExporter.exportTrazas(trazas, filtros, 'print');
    };

  const tablaTrazas = TablaTrazas({
    datos: trazas,
    onEliminar: (id) => DataTrazas.eliminar({ idValue: id, getTrazas: fetchInitialData }),
  });

  return (
    <DashboardLayout sx={{ width: "100%" }}>
      <DashboardNavbar />
      
      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black" mt={1}>
          Gestión de Trazas 
        </MDTypography>
      </MDBox>

      {error ? (
        <ErrorMessage error={error} onRetry={fetchInitialData} />
      ) : loading ? (
        <LoadingIndicator />
      ) : (
        
        <>
          <MDBox display="flex" justifyContent="flex-end" alignItems="center" mb={2} px={2}>
                      <MDBox display="flex" gap={2}>
                        <MDButton
                          variant="gradient"
                          color="success"
                          onClick={handlePrint}
                          disabled={trazas.length === 0}
                        >
                          Imprimir
                        </MDButton>
                        
                        <MDButton
                          variant="gradient"
                          color="error"
                          onClick={handleExportPDF}
                          disabled={trazas.length === 0}
                        >
                          Exportar PDF
                        </MDButton>
                      </MDBox>
                    </MDBox>
          <AdvancedSearchFilters
            filters={filtros}
            users={usuarios}
            onFilterChange={handleFilterChange}
            onDateChange={handleDateChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h6" color="white">
                      Trazas del Sistema
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
                    <DataTable
                      table={tablaTrazas}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
      
      <Footer />
    </DashboardLayout>
  );
}

export default Trazas;