import axios from 'axios';
import { calculando_K, calculo } from './ecuaciones';

const BASE_URL = 'http://localhost:3001'; 

export const fetchData = async (
  den_arena_,
  den_mar_,
  indice_,
  coeficiente_,
  altura_,
  angulo_,
  aceleracion_,
  P_
) => {
  const Q = calculo(
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
    P: P_,
    Q,
    K,
  };

  try {
    const response = await axios.post(`${BASE_URL}/calculo`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Datos creados exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear los datos:', error.response?.data || error.message);
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
  const Q = calculo(
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
    const response = await axios.put(`${BASE_URL}/calculo/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Datos actualizados exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos:', error.response?.data || error.message);
    throw error;
  }
};

// Función para eliminar un registro por su ID
export const eliminar = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/calculo/${id}`);
    console.log('Registro eliminado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el registro:', error.response?.data || error.message);
    throw error;
  }
};

/*
// Función para crear un usuario
export const crearUsuario = async (
  usuario,
  nombre,
  apellido,
  segundoApellido,
  ci,
  tipoTrabajador,
  sexo,
  correo,
  contrasena
) => {
  try {
    const response = await axios.post(`${BASE_URL}/createUsuario`, {
      usuario_,
      nombre_,
      apellido_,
      segundoApellido_,
      ci_,
      tipoTrabajador_,
      sexo_,
      correo_,
      contrasena_,
    });

    console.log('Usuario creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error.response?.data || error.message);
    throw error;
  }
};

/ Función para actualizar un usuario existente
export const actualizarUsuario = async (
  id,
  usuario,
  nombre,
  apellido,
  segundoApellido,
  ci,
  tipoTrabajador,
  sexo,
  correo,
  contrasena
) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateUsuario`, {
      _id: id,
      usuario_,
      nombre_,
      apellido_,
      segundoApellido_,
      ci_,
      tipoTrabajador_,
      sexo_,
      correo_,
      contrasena_,
    });

    console.log('Usuario actualizado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.response?.data || error.message);
    throw error;
  }
};

// Función para eliminar un usuario por su ID
export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteUsuario/${id}`);
    console.log('Usuario eliminado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.response?.data || error.message);
    throw error;
  }
}; */
