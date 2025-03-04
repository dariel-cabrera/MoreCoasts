import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { actualizarDatos } from "./CalculationFunction";


export const NuevoCalculo = ({ calculo, setCalculo,editar,limpiarDatos }) => {
  const handleChange = (e) => {
    setCalculo({ ...calculo, [e.target.name]: e.target.value });
  };
 const {id}=calculo;
  return (
    <Grid container direction="column" sx={{ pl: 2 }}>
      <MDTypography variant="h5" fontWeight="medium" color="black" mt={1} mb={2}>
        Nuevo Cálculo
      </MDTypography>

      <Grid container spacing={2}>
        {[
          { label: "Densidad de Arena", name: "densidad_a" },
          { label: "Densidad del Mar", name: "densidad_m" },
          { label: "Coeficiente de Porosidad", name: "coeficiente" },
          { label: "Índice", name: "indice" },
          { label: "Altura", name: "altura" },
          { label: "Ángulo", name: "angulo" },
          { label: "Aceleración de la Gravedad", name: "aceleracion" },
          { label: "Medición Práctica (P)", name: "P" },
        ].map((item, index) => (
          <Grid item xs={6} key={item.name}>
            <MDBox mt={2} sx={{ width: "100%", maxWidth: 300, mb: index === 7 ? 6 : 0 }}>
              <MDInput
                type="number"
                label={item.label}
                sx={{ width: "100%" }}
                value={calculo[item.name]}
                name={item.name}
                onChange={handleChange}
              />
            </MDBox>
          </Grid>
        ))}
      </Grid>

      {/* Botones según el estado de edición */}
      <MDBox sx={{ mt: 4 }}>
        {editar ? (
          <>
            <MDButton variant="gradient" color="info" size="medium" onClick={actualizarDatos({ id,calculo, getDatos, limpiarDatos})}>
              Actualizar
            </MDButton>
            <MDButton variant="gradient" color="info" size="medium" onClick={limpiarDatos}>
              Cancelar
            </MDButton>
            <MDButton className="btn btn-success" onClick={calcularDatos({calculo,getDatos,limpiarDatos})}>
              Nuevo
            </MDButton>
          </>
        ) : (
          <>
            <MDButton className="btn btn-success m-2" onClick={calcularDatos({calculo,getDatos,limpiarDatos})}>
              Calcular
            </MDButton>
            <MDButton className="btn btn-info m-2" onClick={limpiarDatos}>
              Cancelar
            </MDButton>
          </>
        )}
      </MDBox>

      
    </Grid>
  );
};
