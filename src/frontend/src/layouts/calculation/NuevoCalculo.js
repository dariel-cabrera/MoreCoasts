import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { actualizarDatos, calcularDatos } from "./CalculationFunction";

export const NuevoCalculo = ({ calculo, setCalculo, editar, limpiarDatos, getDatos }) => {
  // Función para manejar los cambios en los inputs y convertir a número
  const handleChange = (e) => {
    setCalculo({ ...calculo, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const { id } = calculo;

  return (
    <MDBox sx={{ pl: 2 }}>
      <Grid container direction="column">
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
                  value={calculo[item.name] || ""}
                  name={item.name}
                  onChange={handleChange}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

         {/* Botones centrados y más cerca de los inputs */}
         <MDBox sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2} justifyContent="center">
            {editar ? (
              <>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="warning"
                    size="medium"
                    onClick={() => actualizarDatos({ id, calculo, getDatos, limpiarDatos })}
                  >
                    Actualizar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={() => calcularDatos({ calculo, getDatos, limpiarDatos })}
                  >
                    Nuevo
                  </MDButton>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="medium"
                    onClick={() => calcularDatos({ calculo, getDatos, limpiarDatos })}
                  >
                    Calcular
                  </MDButton>
                </Grid>
                <Grid item>
                  <MDButton variant="gradient" color="error" size="medium" onClick={limpiarDatos}>
                    Cancelar
                  </MDButton>
                </Grid>
              </>
            )}
          </Grid>
        </MDBox>
      </Grid>
    </MDBox>
  );
};