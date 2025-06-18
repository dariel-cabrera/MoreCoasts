import UsersService from "services/user-service";

export const eliminar = async (id) =>{
    try {
            const response = await UsersService.deleteUsers(id)
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
    rol,
    lastname,
    email,
    password
)=>{
    const data = {user_name,name,rol,lastname,email,password}
    try {
           const response = await UsersService.updateUsers(id, data);
           return response.data;
       } catch (error) {
           console.error('Error al actualizar los datos:', error.response?.data || error.message);
           throw error;
    }
}

export const crear = async (
   user_name,
   name,
   rol,
   lastname,
   email,
   password,
   ci,
   
) => {
   
    const data = {user_name,name,rol,lastname,email,password,ci};

    try {
        const response = await UsersService.postUsers(data);
        return response.data;
    } catch (error) {
        console.error('Error al crear los datos:', error.response?.data || error.message);
        throw error;
    }
};