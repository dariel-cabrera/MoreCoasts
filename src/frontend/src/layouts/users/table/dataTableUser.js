import React from 'react';
import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

export const TablaUser = ({ users, onEditar, onEliminar }) => {
  const columns = [
    { Header: "#", accessor: "index", align: "left" },
    { Header: "Usuario", accessor: "usuario", align: "left" },
    { Header: "Fecha", accessor: "fecha", align: "left" },
    { Header: "Nombre", accessor: "nombre", align: "left" },
    { Header: "Apellido", accessor: "apellido", align: "left" },
    { Header: "Carnet de Identidad", accessor: "ci", align: "left" },
    { Header: "Correo", accessor: "correo", align: "left" },
    { Header: "Acciones", accessor: "acciones", align: "center" },
  ];
  
  
  const rows = Array.isArray(users) ? users.map((val, index) => ({
    index: index + 1,
    usuario: val.user_name,
    fecha: val.createdAt ? format(new Date( val.createdAt), 'dd-MM-yy') : "Sin fecha",
    nombre:val.name,
    apellido: val.lastname,
    ci: val.ci,
    correo: val.email,

    acciones: (
      <MDBox display="flex" justifyContent="space-around">
        <MDButton 
          variant="gradient" 
          color="info" 
          size="small" 
          onClick={() => onEditar(val)}
        >
          <EditIcon />
        </MDButton>
        <MDButton 
          variant="gradient" 
          color="error" 
          size="small" 
          onClick={() => onEliminar(val._id)}
          disabled={val.user_name === "Admin"}
          sx={{
            opacity: val.user_name === "Admin" ? 0.5 : 1,
            cursor: val.user_name === "Admin" ? "not-allowed" : "pointer"
          }}
        >
          <DeleteIcon />
        </MDButton>
      </MDBox>
    )
  })) : [];

  return { columns, rows };
};

TablaUser.propTypes = {
  users: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
};