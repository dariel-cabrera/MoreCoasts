// Librerías de terceros
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState, useEffect } from "react";
import { TablaCalculo } from "./table/dataTable";
import CalculationService from "services/calculation-service";
import { NuevoCalculo } from "./NuevoCalculo";
import { eliminarDatos } from "./CalculationFunction";
import { Card } from "@mui/material";
import DataTable from "examples/Tables/DataTable";


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
  });
  
  
  const [editar, setEditar] = useState(false);
  const [mstNvoCalc, setMstNvoCalc] = useState(false);
  const [calculos, setCalculos] = useState([]);

  const getDatos = async () => {
    try {
      const datos = await CalculationService.getCalculation();
      setCalculos(datos);
      console.log(datos);
    } catch (error) {
      console.error(error);
    }
  };

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

  const tablaCalculo = TablaCalculo({
      datos: calculos,
      onEditar: (val) => editarCalculos(val),
      onEliminar: (id) => eliminarDatos({ idValue: id, getDatos: getDatos, limpiarDatos: limpiarDatos }),
  });

  return (
    <DashboardLayout sx={{ width: "100%" }}>
      <DashboardNavbar />

      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black" mt={1}>
          Gestión de Cálculos
        </MDTypography>
      </MDBox>

      {mstNvoCalc ? (
        <NuevoCalculo
          calculo={calculo}
          setCalculo={setCalculo}
          editar={editar}
          limpiarDatos={limpiarDatos}
          getDatos={getDatos}
        />
      ) : (
        <>
          <MDButton variant="gradient" color="info" size="medium" onClick={handleNuevoCalculo}>
                        Nuevo
          </MDButton>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                  Cálculo Teórico del Transporte de Sedimentos
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                   <DataTable
                      table={tablaCalculo}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        </>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Calculation;