import HttpService from "./htttp.service";

class  CalculationService {
    getCalculation=async()=>{
        const url="getCalculation";
        return await HttpService.get(url);
    };

    deleteCalculation=async(id,idUser)=>{
        const url="deleteCalculation";
        return await HttpService.delete(`${url}/${id}`,idUser)
    };
    
    updateCalculation=async(id,datos)=>{
        const url="updateCalculation"
        return await HttpService.put(`${url}/${id}`,datos)
    };

    postCalculation=async(datos)=>{
        const url="postCalculation"
        return await HttpService.post(url,datos)
    }
}

export default new CalculationService();