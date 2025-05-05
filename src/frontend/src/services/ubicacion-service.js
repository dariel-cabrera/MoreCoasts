import HttpService from "./htttp.service";

class UbicacionService {
  // authEndpoint = process.env.API_URL;

    getUbicaciones=async()=>{
         const url="getUbicaciones";
         return await HttpService.get(url);
     };
 
     deleteUbicacion=async(id)=>{
         const url="deleteUbicacion";
         return await HttpService.delete(`${url}/${id}`)
     };
     
     updateUbicacion=async(id,datos)=>{
         const url="updateUbicacion"
         return await HttpService.put(`${url}/${id}`,datos)
     };
 
     postUbicacion=async(datos)=>{
         const url="postUbicacion"
         return await HttpService.post(url,datos)
     }
}
 


export default new UbicacionService();