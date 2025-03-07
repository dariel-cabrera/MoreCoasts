import HttpService from "./htttp.service";

class UsersService{
     getUsers=async()=>{
            const url="getUsers";
            return await HttpService.get(url);
    };
    
    deleteUsers=async(id)=>{
            const url="deleteUsers";
            return await HttpService.delete(`${url}/${id}`)
    };
        
    updateUsers=async(id,datos)=>{
            const url="updateUsers"
            return await HttpService.put(`${url}/${id}`,datos)
    };
    
    postUsers=async(datos)=>{
            const url="postUsers"
            return await HttpService.post(url,datos)
    }
}
export default new UsersService();