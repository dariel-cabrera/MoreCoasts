import HttpService from "./htttp.service";

class  ConfiguracionService {
    getConfiguration=async()=>{
        const url="getConfiguration";
        return await HttpService.get(url);
    }; 
    updateConfiguration=async(id,datos)=>{
        const url="updateConfiguration"
        return await HttpService.put(`${url}/${id}`,datos)
    };

}
export default new ConfiguracionService();