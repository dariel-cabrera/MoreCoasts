// Librerías de terceros
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState, useEffect } from "react";

import { Card } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import TrazasService from "services/trazas-service";
import DataTrazas from "./DataTrazas";
import { TablaTrazas } from "./table";
function Trazas() {
  
  const[trazas,setTrazas]=useState("");

  const getTrazas = async () => {
    try {
      const datos = await TrazasService.getTrazas();
      setTrazas(datos);
      console.log(datos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTrazas();
  }, []);

  

  const tablaTrazas = TablaTrazas({
      datos: trazas,
      onEliminar: (id) => DataTrazas.eliminar({ idValue: id, getTrazas: getTrazas }),
  });

  return (
    <DashboardLayout sx={{ width: "100%" }}>
      <DashboardNavbar />

      <MDBox py={3} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" color="black" mt={1}>
         Gestión de Trazas 
        </MDTypography>
      </MDBox>

        <> 
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
                  Trazas del Sistema
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                   <DataTable
                      table={tablaTrazas}
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
    
      <Footer />
    </DashboardLayout>
  );
}

export default Trazas;