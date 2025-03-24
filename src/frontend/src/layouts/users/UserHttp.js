import UsersService from "services/user-service";

export const eliminar = async (id) =>{
    try {
            const response = await UsersService.deleteUsers(id)
            console.log('Registro eliminado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el registro:', error.response?.data || error.message);
            throw error;
    }
}

export const actualizar = async(
    id,
    user_name,
    name,
    lastname,
    email,
)=>{
    const data = {user_name,name,lastname,email}
    try {
           const response = await UsersService.updateUsers(id, data);
           console.log('Datos actualizados exitosamente:', response.data);
           return response.data;
       } catch (error) {
           console.error('Error al actualizar los datos:', error.response?.data || error.message);
           throw error;
    }
}

export const crear = async (
   user_name,
   name,
   lastname,
   email,
   password,
   ci,
   
) => {
   
    const data = {user_name,name,lastname,email,password,ci};

    try {
        const response = await UsersService.postUsers(data);
        console.log('Datos creados exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear los datos:', error.response?.data || error.message);
        throw error;
    }
};