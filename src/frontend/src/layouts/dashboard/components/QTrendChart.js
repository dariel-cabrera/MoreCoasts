import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import CalculationService from 'services/calculation-service';
import MDBox from "components/MDBox";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const QTrendChart = () => {
  const [data, setData] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedUbicacion, setSelectedUbicacion] = useState('Todas');
  const [periodo, setPeriodo] = useState('1mes');

  // Cargar ubicaciones disponibles
  useEffect(() => {
    const fetchUbicaciones = async () => {
      const res = await CalculationService.getLocations();
      setUbicaciones(res);
    };
    fetchUbicaciones();
  }, []);

  // Cargar datos según filtros
  useEffect(() => {
    const fetchData = async () => {
      let fechaInicio;
      const hoy = new Date();

      switch (periodo) {
        case 'semana':
          fechaInicio = new Date(hoy);
          fechaInicio.setDate(hoy.getDate() - 7);
          break;
        case '1mes':
          fechaInicio = new Date(hoy);
          fechaInicio.setMonth(hoy.getMonth() - 1);
          break;
        case '6meses':
          fechaInicio = new Date(hoy);
          fechaInicio.setMonth(hoy.getMonth() - 6);
          break;
        case '1año':
          fechaInicio = new Date(hoy);
          fechaInicio.setFullYear(hoy.getFullYear() - 1);
          break;
        default:
          fechaInicio = new Date(hoy);
          fechaInicio.setMonth(hoy.getMonth() - 1);
      }

      // Ajustar horas para incluir todo el día
      fechaInicio.setHours(0, 0, 0, 0);  // inicio del día
      const fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);  // fin del día actual

      const params = {
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        ubicacion: selectedUbicacion === 'Todas' ? undefined : selectedUbicacion,
      };

      const res = await CalculationService.getFiltrosQ(params);
      setData(res);
    };

    fetchData();
  }, [periodo, selectedUbicacion]);

  // Preparar datos para el gráfico
  const chartData = {
    labels: data.map(item => new Date(item.fecha).toLocaleDateString()),
    datasets: {
      label: `Valor Q - ${selectedUbicacion}`,
      data: data.map(item => item.Q),
    }
  };

  return (
    <MDBox mb={3}>
      <MDBox display="flex" gap={2} mb={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="periodo-label">Período</InputLabel>
          <Select
            labelId="periodo-label"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            label="Período"
          >
            <MenuItem value="semana">Esta semana</MenuItem>
            <MenuItem value="1mes">Último mes</MenuItem>
            <MenuItem value="6meses">Últimos 6 meses</MenuItem>
            <MenuItem value="1año">Último año</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="ubicacion-label">Ubicación</InputLabel>
          <Select
            labelId="ubicacion-label"
            value={selectedUbicacion}
            onChange={(e) => setSelectedUbicacion(e.target.value)}
            label="Ubicación"
          >
            <MenuItem value="Todas">Todas las ubicaciones</MenuItem>
            {ubicaciones.map((ubic) => (
              <MenuItem key={ubic} value={ubic}>
                {ubic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MDBox>

      {data.length > 0 ? (
        <ReportsLineChart
          color="info"
          title="Tendencia de Valores Q"
          description={
            <>
              Datos de <strong>{selectedUbicacion}</strong> en el período seleccionado
            </>
          }
          date={`Actualizado: ${new Date().toLocaleString()}`}
          chart={chartData}
        />
      ) : (
        <MDBox p={3} textAlign="center">
          No hay datos disponibles para los filtros seleccionados
        </MDBox>
      )}
    </MDBox>
  );
};

export default QTrendChart;