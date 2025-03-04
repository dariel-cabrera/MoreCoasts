import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TablaCalculo } from "./dataTable";
import DataTable from "examples/Tables/DataTable";
import { eliminarDatos } from "../CalculationFunction";

function CalculationTable({ datos, getDatos, limpiarDatos, editarCalculos }) {
  const tablaCalculo = TablaCalculo({
    datos: datos,
    onEditar: (val) => editarCalculos(val),
    onEliminar: (id) => eliminarDatos({id:id, getDatos:getDatos, limpiarDatos:limpiarDatos}),
  });

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        {/* Contenedor principal alineado a la izquierda */}
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item xs={12} md={8}> {/* Reducir el ancho para moverlo más a la izquierda */}
            <Card style={{ marginLeft: "20px", width: "100%" }}> {/* Ajuste de margen */}
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
    </DashboardLayout>
  );
}

export default CalculationTable;
