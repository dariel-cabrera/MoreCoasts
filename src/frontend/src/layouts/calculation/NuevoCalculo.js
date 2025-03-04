import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

export const NuevoCalculo = ({ calculo, setCalculo }) => {
  const handleChange = (e) => {
    setCalculo({ ...calculo, [e.target.name]: e.target.value });
  };

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

      
    </Grid>
  );
};
