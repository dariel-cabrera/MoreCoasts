//  Librerías de terceros
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState, useEffect} from "react";
import CalculationTable from "./table";
import CalculationService from "services/calculation-service";
import { TablaCalculo } from "./table/dataTable";
import { NuevoCalculo } from "./NuevoCalculo";
function Calculation() {
  const [calculo, setCalculo] = useState({
    densidad_a: 0,
    densidad_m: 0,
    coeficiente: 0,
    indice: 0,
    altura: 0,
    angulo: 0,
    aceleracion: 0,
    P: 0,
    id: 0,
  });

  const [editar, setEditar] = useState(false);
  const [mstNvoCalc, setMstNvoCalc] = useState(false);
  const[calculos,setCalculos]=useState([])

  const getDatos= async()=> {
    try{
      const datos=  await CalculationService.getCalculation();
      setCalculos(datos);
      console.log(datos);
    }
    catch(error){
      console.error(error)
    }

  }
  useEffect(() => {
    getDatos();
  }, []);

  const limpiarDatos = () => {
    setCalculo({
      densidad_a: 0,
      densidad_m: 0,
      coeficiente: 0,
      indice: 0,
      altura: 0,
      angulo: 0,
      aceleracion: 0,
      P: 0,
      id: 0,
    });
    setEditar(false);
    setMstNvoCalc(false);
  };

  const editarCalculos = (val) => {
    console.log("Editando Datos");
    setEditar(true);
    setMstNvoCalc(true);
    setCalculo({
      densidad_a: val.densidad_a,
      densidad_m: val.densidad_m,
      coeficiente: val.coeficiente,
      indice: val.indice,
      altura: val.altura,
      angulo: val.angulo,
      aceleracion: val.aceleracion,
      P: val.P,
      id: val._id,
    });
  };

  const handleNuevoCalculo = () => {
    setMstNvoCalc(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black" mt={1}>
          Gestión de Cálculos
        </MDTypography>
      </MDBox>

     
       
      {mstNvoCalc ?(
      <NuevoCalculo 
        calculo={calculo}
        setCalculo={setCalculo}
        editar={editar}
        limpiarDatos={limpiarDatos}
        getDatos={getDatos}
       
      />
      ):(
        <>
        <MDBox mt={2} mb={1}>
        <MDButton variant="gradient" color="info" size="medium" onClick={handleNuevoCalculo}>
          Nuevo
        </MDButton>
      </MDBox>
      <CalculationTable
        datos={calculos}
        getDatos={getDatos}
        limpiarDatos={limpiarDatos}
        editarCalculos={(val)=>{editarCalculos(val)}}
      />
      </>
       )
      }
      
      
      <Footer />
    </DashboardLayout>
  );
}

export default Calculation;
