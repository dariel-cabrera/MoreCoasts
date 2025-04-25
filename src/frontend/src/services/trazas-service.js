import HttpService from "./htttp.service";

class  TrazasService {
   getTrazas=async()=>{
           const url="getTrazas";
           return await HttpService.get(url);
   };
   deleteTrazas=async(id)=>{
        const url="deleteTrazas";
        return await HttpService.delete(`${url}/${id}`)
   };
   postTrazas=async(datos)=>{
        const url="postTrazas"
        return await HttpService.post(`${url}/${datos}`)
   }
}

export default new TrazasService();