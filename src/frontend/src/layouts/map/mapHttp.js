import UbicacionService from "services/ubicacion-service";

export const eliminar= async(id)=> {
     try {
            const response = await UbicacionService.deleteUbicacion(id);
            console.log('Registro eliminado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el registro:', error.response?.data || error.message);
            throw error;
    }
};

export const crear = async(currentArea)=>{
    try {
            const response = await UbicacionService.postUbicacion(currentArea);
            console.log('Datos creados exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al crear los datos:', error.response?.data || error.message);
            throw error;
    }
}