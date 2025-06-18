import Swal from 'sweetalert2';
import { eliminar, actualizar, crear } from './UserHttp';
import DataTrazas from 'layouts/trazas/DataTrazas';


// Función para eliminar datos
export const eliminarDatos = async ({ idValue, getDatos, limpiarDatos }) => {
  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  const result = await swalWithBootstrapButtons.fire({
    title: "¿Estás Seguro?",
    text: "Deseas eliminar los datos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminarlos!",
    cancelButtonText: "No, cancelar!",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await eliminar(idValue); 
      await getDatos();
      limpiarDatos();
      DataTrazas.crear({accion: 'Ha eliminado un usuario'});
      swalWithBootstrapButtons.fire({
        title: "Eliminados!",
        text: "Sus datos han sido eliminados",
        icon: "success",
      });
    } catch (error) {
      swalWithBootstrapButtons.fire({
        title: "Error",
        text: "Hubo un problema al eliminar los datos",
        icon: "error"
      });
    }
  } else {
    swalWithBootstrapButtons.fire({
      title: "Cancelado",
      text: "Operación cancelada",
      icon: "error"
    });
  }
};

// Función para actualizar datos
export const actualizarDatos = async ({ user, getDatos, limpiarDatos }) => {
  
  const { id, user_name,name,rol,lastname,email,password} = user;
  
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  const result = await swalWithBootstrapButtons.fire({
    title: "¿Estás Seguro?",
    text: "Deseas actualizar los datos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, actualizarlos!",
    cancelButtonText: "No, cancelar!",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await actualizar(id,user_name,name,rol,lastname,email,password);
      await getDatos();
      limpiarDatos();
      DataTrazas.crear({accion: 'Ha actualizado un usuario'});
      swalWithBootstrapButtons.fire({
        title: "Actualizados!",
        text: "Sus datos han sido actualizados.",
        icon: "success"
      });
    } catch (error) {
      const {message}=error
      swalWithBootstrapButtons.fire({
        title: "Error",
        text: `Hubo un problema al actualizar los datos. ${message}`,
        icon: "error"
      });
    }
  } else {
    swalWithBootstrapButtons.fire({
      title: "Cancelado",
      text: "Operación cancelada",
      icon: "error"
    });
  }
};

// Función para calcular y crear datos
export const crearDatos = async ({ user, getDatos, limpiarDatos }) => {
  
  const { user_name,name,lastname,rol,email,password,ci}= user;

  if (!user_name || !name || !lastname || !email || !password || !ci) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos antes de crear.'
    });
    return;
  }

  try {
    await crear(user_name,name,rol,lastname,email,password,ci);
    await getDatos();
    DataTrazas.crear({accion: 'Ha creado un usuario'});
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario Creado con éxito",
      showConfirmButton: false,
      timer: 1500
    });
    limpiarDatos();
  } catch (error) {
    const {message}=error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Hubo un problema al crear el usuario.  ${message}`
    });
  }
};
  