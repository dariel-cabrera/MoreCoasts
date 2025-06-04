import axios from 'axios';
import UbicacionService from 'services/ubicacion-service';

const handleApiError = (error) => {
  // Extraer el mensaje del error del backend
  const backendMessage = error.response?.data?.message;
  const axiosMessage = error.message;
  
  // Priorizar el mensaje del backend si existe
  const errorMessage = backendMessage || axiosMessage || 'Error en la operación';
  
  // Crear un nuevo error con el mensaje adecuado
  const newError = new Error(errorMessage);
  
  // Mantener información original si es necesario
  newError.originalError = error;
  newError.response = error.response;
  
  throw newError;
};

export const crear = async (ubicacion) => {
  try {
    const response = await UbicacionService.createUbicacion(ubicacion);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const actualizar = async (id, ubicacion) => {
  try {
    const response = await UbicacionService.updateUbicacion(id, ubicacion);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const eliminar = async (id) => {
  try {
    const response = await UbicacionService.deleteUbicacion(id);
    return response;
  } catch (error) {
    handleApiError(error);
  }
};