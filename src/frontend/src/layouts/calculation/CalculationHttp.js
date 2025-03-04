import CalculationService from "services/calculation-service";
import { calculando_K, calculando_Q } from "./ecuaciones/calculoTeorico";
// Función para eliminar un registro por su ID
export const eliminar = async (id) => {
    try {
      const response= await CalculationService.deleteCalculation(id);
      console.log('Registro eliminado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el registro:', error.response?.data || error.message);
      throw error;
    }
  };

  // Función para actualizar un registro existente
export const actualizar = async (
    id,
    den_arena_,
    den_mar_,
    indice_,
    coeficiente_,
    altura_,
    angulo_,
    aceleracion_,
    P_
  ) => {
    const Q = calculando_Q(
      den_arena_,
      den_mar_,
      indice_,
      coeficiente_,
      altura_,
      angulo_,
      aceleracion_
    );
  
    const K = calculando_K(P_, Q);
  
    const data = {
      densidad_a: den_arena_,
      densidad_m: den_mar_,
      indice: indice_,
      coeficiente: coeficiente_,
      altura: altura_,
      angulo: angulo_,
      aceleracion: aceleracion_,
      Q,
      P: P_,
      K,
    };
  
    try {
      const response = await CalculationService.updateCalculation(id,data)
  
      console.log('Datos actualizados exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar los datos:', error.response?.data || error.message);
      throw error;
    }
  };