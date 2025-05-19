import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
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
import { ExportToExcel } from 'layouts/buttonExport/ExportToExcel';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import PDFExporter from './PDFExporter';
import dayjs from 'dayjs';

function Calculation() {
  // Estados
  const [calculo, setCalculo] = useState({
    densidad_a: 0,
    densidad_m: 0,
    coeficiente: 0,
    indice: 0,
    altura: 0,
    angulo: 0,
    aceleracion: 0,
    P: 0,
    ubicacion: "",
  });
  const [editar, setEditar] = useState(false);
  const [mstNvoCalc, setMstNvoCalc] = useState(false);
  const [calculos, setCalculos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    ubicacion: ''
  });

  // Efectos
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Métodos
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [calculations, locations] = await Promise.all([
        CalculationService.getCalculation(),
        CalculationService.getLocations()
      ]);
      
      // Verificar y normalizar el formato de las ubicaciones
      const normalizedLocations = Array.isArray(locations) 
        ? locations.filter(loc => loc && loc.trim() !== '')
        : [];
      
      setCalculos(calculations);
      setUbicaciones(normalizedLocations);
      console.log("Datos iniciales cargados:", calculations);
      console.log("Ubicaciones disponibles:", normalizedLocations);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      alert("Error al cargar los datos iniciales");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = async (params = {}) => {
    setLoading(true);
    try {
      console.log("Solicitando datos con filtros:", params);
      const data = await CalculationService.getFiltrosCalculation(params);
      
      if (!Array.isArray(data)) {
        throw new Error("La respuesta del servidor no es válida");
      }
      
      console.log("Datos filtrados recibidos:", data);
      setCalculos(data);
      
      if (data.length === 0) {
        alert("No se encontraron resultados con los filtros aplicados");
      }
    } catch (error) {
      console.error("Error al obtener datos filtrados:", error);
      alert(`Error al filtrar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFiltros(prev => ({ ...prev, [name]: date }));
  };

  const applyFilters = () => {
    // Validación de fechas
    if (filtros.fechaInicio && filtros.fechaFin && dayjs(filtros.fechaInicio).isAfter(dayjs(filtros.fechaFin))) {
      alert("La fecha de inicio no puede ser mayor a la fecha fin");
      return;
    }

    // Preparar parámetros para el backend
    const params = {
      ...(filtros.fechaInicio && { 
        fechaInicio: dayjs(filtros.fechaInicio).format('YYYY-MM-DD') 
      }),
      ...(filtros.fechaFin && { 
        fechaFin: dayjs(filtros.fechaFin).format('YYYY-MM-DD') 
      }),
      ...(filtros.ubicacion && { ubicacion: filtros.ubicacion.trim() })
    };

    console.log("Parámetros que se enviarán:", params);
    getFilteredData(params);
  };

  const clearFilters = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      ubicacion: ''
    });
    fetchInitialData();
  };

  const handleExportPDF = () => {
    if (calculos.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    PDFExporter.exportCalculations(calculos, filtros);
  };

  // Render
  return (
    <DashboardLayout sx={{ width: "100%" }}>
      <DashboardNavbar />

      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black" mt={1}>
          Gestión de Cálculos
        </MDTypography>
      </MDBox>

      {loading ? (
        <MDBox display="flex" justifyContent="center" alignItems="center" height="200px">
          <MDTypography variant="body1">Cargando datos...</MDTypography>
        </MDBox>
      ) : mstNvoCalc ? (
        <NuevoCalculo
          calculo={calculo}
          setCalculo={setCalculo}
          editar={editar}
          limpiarDatos={() => {
            setCalculo({
              densidad_a: 0,
              densidad_m: 0,
              coeficiente: 0,
              indice: 0,
              altura: 0,
              angulo: 0,
              aceleracion: 0,
              P: 0,
              id: 0,
              ubicacion: "",
            });
            setEditar(false);
            setMstNvoCalc(false);
          }}
          getDatos={fetchInitialData}
        />
      ) : (
        <>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDButton 
              variant="gradient" 
              color="info" 
              size="medium" 
              onClick={() => setMstNvoCalc(true)}
            >
              Nuevo 
            </MDButton>
            
            <MDBox display="flex" gap={2}>
              <ExportToExcel 
                data={calculos} 
                fileName={`calculos_sedimentos_${dayjs().format('YYYYMMDD')}`} 
                disabled={calculos.length === 0}
              />
              <MDButton 
                variant="gradient" 
                color="error" 
                size="medium" 
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
                variant="gradient"
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
                      setCalculo({
                        densidad_a: val.densidad_a,
                        densidad_m: val.densidad_m,
                        coeficiente: val.coeficiente,
                        indice: val.indice,
                        altura: val.altura,
                        angulo: val.angulo,
                        aceleracion: val.aceleracion,
                        P: val.P,
                        id: val._id,
                        ubicacion: val.ubicacion
                      });
                    },
                    onEliminar: (id) => eliminarDatos({ 
                      idValue: id, 
                      getDatos:{fetchInitialData}, 
                      limpiarDatos: () => {
                        setCalculo({
                          densidad_a: 0,
                          densidad_m: 0,
                          coeficiente: 0,
                          indice: 0,
                          altura: 0,
                          angulo: 0,
                          aceleracion: 0,
                          P: 0,
                          id: 0,
                          ubicacion: "",
                        });
                      }
                    }),
                  })}
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

      <Footer />
    </DashboardLayout>
  );
}

export default Calculation;