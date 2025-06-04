import Swal from 'sweetalert2';
import CalculationService from "services/calculation-service";

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
      await CalculationService.deleteCalculation(idValue); 
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
export const actualizarDatos = async ({ id, calculo, getDatos, limpiarDatos }) => {
  
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
      await CalculationService.updateCalculation(id, calculo);
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
export const calcularDatos = async ({ calculo, getDatos, limpiarDatos }) => {
  if (!calculo) {
    console.error("calculo is undefined");
    return;
  }

  const { densidad_a, densidad_m, indice, coeficiente, altura, angulo, aceleracion, P,ubicacion } = calculo;

  if (!densidad_a || !densidad_m || !indice || !coeficiente || !altura || !angulo || !aceleracion || !P || !ubicacion) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos antes de calcular.'
    });
    return;
  }
  if (densidad_a  < densidad_m ) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La Densidad del Mar no puede ser mayor a la Densidad del Sedimento.'
    });
    return;
  }
  const data= {densidad_a, densidad_m, indice, coeficiente, altura, angulo, aceleracion, P,ubicacion}
  try {
    await await CalculationService.postCalculation(data);
    await getDatos();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Datos calculados con éxito",
      showConfirmButton: false,
      timer: 1500
    });
    limpiarDatos();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al calcular los datos.'
    });
  }
};
