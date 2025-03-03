//  Librerías de terceros
//Grid de Material UI se usa para estructurar la disposición de los 
// elementos en filas y columnas.
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
// MDBox es un contenedor personalizado basado en Box de Material UI, utilizado 
// para estructurar y dar estilo a los elementos
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
// DashboardLayout: Contenedor principal del panel de control.
// DashboardNavbar: Barra de navegación superior del panel.
// Footer: Pie de página del panel.
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useState } from "react";
import CalculationTable from "./table";
import { TablaCalculo } from "./table/dataTable";

{/* const [calculo, setCalculo] = useState({
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
  console.log('Editando Datos');
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

function Calculation(){
    return (
        <DashboardLayout>
          <DashboardNavbar />
          {/*Sección de Tarjetas de Estadísticas 
          <MDBox py={3}  textAlign="center">
             <MDTypography variant="h4" fontWeight="medium"  color="black" mt={1}>
                    Gestión de Cálculos
             </MDTypography>
           </MDBox>
            <MDBox mt={2} mb={1}>
                <MDButton variant="gradient" color="info"  size="medium">
                    Nuevo
                </MDButton>
            </MDBox>

            /* <TablaCalculo
              datos={calculos}
              onEliminar={(id) => eliminarDatos({ idValue: id, getDatos, limpiarDatos })}
              onEditar={(val) => {
                editarCalculos(val);
              }}
            />  
           

          
          <Footer />
        </DashboardLayout>

    );


} 

export default Calculation;  */}