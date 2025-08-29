import React from 'react';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';

export const TablaCalculo = ({ datos, onEditar, onEliminar }) => {
  const columns = [
    { Header: "#", accessor: "index", align: "left" },
    { Header: "Ubicación", accessor: "ubicacion", align: "left" },
    { Header: "Fecha", accessor: "fecha", align: "left" },
    { Header: "Hora", accessor: "hora", align: "left" },
    { Header: "Densidad de Arena", accessor: "densidad_a", align: "left" },
    { Header: "Densidad del Mar", accessor: "densidad_m", align: "left" },
    { Header: "Coeficiente", accessor: "coeficiente", align: "left" },
    { Header: "Indice", accessor: "indice", align: "left" },
    { Header: "Altura", accessor: "altura", align: "left" },
    { Header: "Angulo", accessor: "angulo", align: "left" },
    { Header: "Aceleración", accessor: "aceleracion", align: "left" },
    { Header: "Q", accessor: "Q", align: "left" },
    { Header: "P", accessor: "P", align: "left" },
    { Header: "K", accessor: "K", align: "left" },
    { Header: "Acciones", accessor: "acciones", align: "center" },
  ];

  const rows = Array.isArray(datos) ? datos.map((val, index) => ({
    index: index + 1,
    ubicacion: val.ubicacion || "Sin ubicación",
    fecha: val.fecha ? format(new Date(val.fecha), 'dd-MM-yy') : "Sin fecha",
    hora: val.fecha ? format(new Date(val.fecha), 'HH:mm:ss') : "Sin Hora",
    densidad_a: val.densidad_a,
    densidad_m: val.densidad_m,
    coeficiente: val.coeficiente,
    indice: val.indice,
    altura: val.altura,
    angulo: val.angulo,
    aceleracion: val.aceleracion,
    Q: val.Q,
    P: val.P,
    K: val.K,
    acciones: (
      <MDBox display="flex" justifyContent="space-around">
        <MDButton variant="gradient" color="info" size="small" onClick={() => onEditar(val)}>
          <EditIcon />
        </MDButton>
        <MDButton variant="gradient" color="error" size="small" onClick={() => onEliminar(val._id)}>
         <DeleteIcon />
        </MDButton>
      </MDBox>
    )
  })) : [];

  return { columns, rows };
};

TablaCalculo.propTypes = {
  datos: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};
