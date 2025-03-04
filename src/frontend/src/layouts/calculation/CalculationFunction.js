import Swal from 'sweetalert2';
import { eliminar,actualizar } from './CalculationHttp';

export const eliminarDatos= ({idValue,getDatos, limpiarDatos}) =>{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estas Seguro?",
      text: "Deseas eliminar los datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si,eliminarlos!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(idValue)
        swalWithBootstrapButtons.fire({
          title: "Eliminados!",
          text: "Sus Datos han sido Eliminados",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Operación Cancelada",
          icon: "error"
        });
      }
    });
    getDatos();
    limpiarDatos();
    
  } 

  export const actualizarDatos= ({id, calculo, getDatos, limpiarDatos}) =>{
    const { densidad_a, densidad_m, indice, coeficiente, altura, angulo, aceleracion, P } = calculo;
    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "¿Estas Seguro?",
      text: "Deseas actualizar los datos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si,actualizalos!",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        actualizar(id,densidad_a,densidad_m,indice,coeficiente,altura,angulo,aceleracion,P);
        getDatos();
        swalWithBootstrapButtons.fire({
          title: "Actualizdos!",
          text: "Sus Datos han sido actualizados.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "Operación Cancelada",
          icon: "error"
        });
      }
    });
    limpiarDatos();

  }