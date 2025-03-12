import Swal from 'sweetalert2';
import { eliminar, actualizar, crear } from './UserHttp';


// Función para eliminar datos
export const eliminarDatos = async ({ idValue, getDatos, limpiarDatos }) => {
  console.log(idValue);
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
      swalWithBootstrapButtons.fire({
        title: "Eliminados!",
        text: "Sus datos han sido eliminados",
        icon: "success"
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
export const actualizarDatos = async ({ id, user, getDatos, limpiarDatos }) => {
  console.log(id,user);
  const { user_name,name,lastname,email} = user;

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
      await actualizar(id,user_name,name,lastname,email);
      await getDatos();
      limpiarDatos();
      swalWithBootstrapButtons.fire({
        title: "Actualizados!",
        text: "Sus datos han sido actualizados.",
        icon: "success"
      });
    } catch (error) {
      swalWithBootstrapButtons.fire({
        title: "Error",
        text: "Hubo un problema al actualizar los datos",
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
  console.log(user);
  

  const { user_name,name,lastname,email,password,ci}= user;

  if (!user_name || !name || !lastname || !email || !password || !ci) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos antes de crear.'
    });
    return;
  }

  try {
    await crear(user_name,name,lastname,email,password,ci);
    await getDatos();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario Creado con éxito",
      showConfirmButton: false,
      timer: 1500
    });
    limpiarDatos();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al crear el usuario.'
    });
  }
};
