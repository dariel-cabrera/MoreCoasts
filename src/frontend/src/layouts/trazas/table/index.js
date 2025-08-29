import React from 'react';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import { format } from 'date-fns';

import DeleteIcon from '@mui/icons-material/Delete';

export const TablaTrazas = ({ datos, onEliminar }) => {
  
  const columns = [
    { Header: "#", accessor: "index", align: "left" },
    { Header: "Usuario", accessor: "user", align: "left" },
    { Header: "Nombre", accessor: "nombre", align: "left" },
    { Header: "Apellido", accessor: "apellido", align: "left" },
    { Header: "Ci", accessor: "CI", align: "left" },
    { Header: "Accion Realizada", accessor: "accion", align: "left" },
    { Header: "Fecha", accessor: "fecha", align: "left" },
    { Header: "Hora", accessor: "hora", align: "left" },
    { Header: "Acciones", accessor: "acciones", align: "left" },
  ];

  const rows = Array.isArray(datos) ? datos.map((val, index) => ({
    index: index + 1,
    user:val.idUser.user_name,
    nombre:val.idUser.name,
    apellido:val.idUser.lastname,
    CI:val.idUser.ci,
    accion:val.accion,
    fecha: val.fecha ? format(new Date(val.fecha), 'dd-MM-yy') : "Sin fecha",
    hora: val.fecha ? format(new Date(val.fecha), 'HH:mm:ss') : "Sin Hora",
    acciones: (
      <>
      <MDBox display="flex" justifyContent="space-around">
        <MDButton variant="gradient" color="error" size="small" onClick={() => onEliminar(val._id)}>
         <DeleteIcon />
        </MDButton>
      </MDBox>
      </>
    )
  })) : [];

  return { columns, rows };
};

TablaTrazas.propTypes = {
  datos: PropTypes.array.isRequired,
  onEliminar: PropTypes.func.isRequired,
};
