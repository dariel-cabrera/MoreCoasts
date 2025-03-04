import Swal from 'sweetalert2';
import CalculationService from 'services/calculation-service';

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
        CalculationService.deleteCalculation(idValue)
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