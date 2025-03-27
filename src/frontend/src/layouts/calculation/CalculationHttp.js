import CalculationService from "services/calculation-service";
import { calculando_K, calculando_Q } from "./ecuaciones/calculoTeorico";

// Función para eliminar un registro por su ID
export const eliminar = async (id,idUser) => {
    try {
        const response = await CalculationService.deleteCalculation(id,idUser);
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
    denArena,
    denMar,
    indice,
    coeficiente,
    altura,
    angulo,
    aceleracion, 
    P,
    idUser
) => {
    const Q = calculando_Q(denArena, denMar, indice, coeficiente, altura, angulo, aceleracion);
    const K = calculando_K(P, Q);

    const data = {
        densidad_a: denArena,
        densidad_m: denMar,
        indice,
        coeficiente,
        altura,
        angulo,
        aceleracion,
        P,
        Q,
        K,
        idUser
    };

    try {
        const response = await CalculationService.updateCalculation(id, data);
        console.log('Datos actualizados exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar los datos:', error.response?.data || error.message);
        throw error;
    }
};

// Función para crear un nuevo registro
export const crear = async (
    denArena,
    denMar,
    indice,
    coeficiente,
    altura,
    angulo,
    aceleracion,
    P,
    usuarioSist
) => {
    const Q = calculando_Q(denArena, denMar, indice, coeficiente, altura, angulo, aceleracion);
    const K = calculando_K(P, Q);

    const data = {
        densidad_a: denArena,
        densidad_m: denMar,
        indice,
        coeficiente,
        altura,
        angulo,
        aceleracion,
        P,
        Q,
        K,
        idUser
    };

    try {
        const response = await CalculationService.postCalculation(data);
        console.log('Datos creados exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear los datos:', error.response?.data || error.message);
        throw error;
    }
};
