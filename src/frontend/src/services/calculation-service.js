import HttpService from "./htttp.service";

class  CalculationService {
    getCalculation=async()=>{
        const url="getCalculation";
        return await HttpService.get(url);
    };

    getFiltrosCalculation=async(params)=>{
        const url= "getfiltrosCalculation";
        return await HttpService.get(url,params);
    }
    getLocations=async()=>{
        const url="getLocations";
        return await HttpService.get(url);
    }

    deleteCalculation=async(id)=>{
        const url="deleteCalculation";
        return await HttpService.delete(`${url}/${id}`)
    };
    
    updateCalculation=async(datos)=>{
        const url="updateCalculation"
        return await HttpService.put(`${url}`,datos)
    };

    postCalculation=async(datos)=>{
        const url="postCalculation"
        return await HttpService.post(url,datos)
    }

    exportToExcel= async()=>{
        const url="exportToExcel"
        return await HttpService.get(url)
    }
    getFiltrosQ=async(params)=>{
        const url="getFiltrosQ"
        return await HttpService.get(url,params)
    }
    getFiltrosP=async(params)=>{
        const url="getFiltrosP"
        return await HttpService.get(url,params)
    }
    getFiltrosK=async(params)=>{
        const url="getFiltrosK"
        return await HttpService.get(url,params)
    }
}

export default new CalculationService();