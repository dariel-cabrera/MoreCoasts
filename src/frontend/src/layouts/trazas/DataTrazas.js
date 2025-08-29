import TrazasService from "services/trazas-service";
class DataTrazas {

    eliminar({idValue,getTrazas}){
        getTrazas();
        TrazasService.deleteTrazas(idValue);
    }

    crear({accion}){
        TrazasService.postTrazas(accion);
    }

}

export default new DataTrazas();