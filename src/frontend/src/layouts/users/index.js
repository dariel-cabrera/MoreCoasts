import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import UserService from "services/user-service";
import { Grid,Card } from "@mui/material";


import { NewUser } from "./newUser";



function Users(){
    const [user,setUser]=useState({
        name:"",
        lastname:"",
        user:"",
        email:"",
        password:"",
        ci:"",
        id:""
    });

    const [editar, setEditar] = useState(false);
    const [mstNvoUser, setMstNvoUser] = useState(false);
    const [users, setUsers] = useState([]);
    
    const getDatos = async () => {
        try {
          const datos = await UserService.getUsers();
          setUsers(datos);
          console.log(datos);
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        getDatos();
    }, []);
    
    const limpiarDatos = () => {
        setUser({
            name:"",
            apellido:"",
            user:"",
            email:"",
            password:"",
            ci:""
        });
        setEditar(false);
        setMstNvoUser(false);
    };
    
    const editarUsers = (val) => {
        console.log("Editando Datos");
        setEditar(true);
        setMstNvoUser(true);
        setCalculo({
          name:val.name,
          lastname:val.lastname,
          user:val.user,
          email:val.name,
        });
    };

    const handleNuevoUser = () => {
        setMstNvoUser(true);
    };
    
    return (
        <DashboardLayout>
        <DashboardNavbar />
        <MDBox  py={3} textAlign="center" >
            <MDTypography variant="h4" fontWeight="medium" color="black" mt={1} >
                    Gestión de Usuarios
            </MDTypography>
         </MDBox>
         {mstNvoUser ? (
            <NewUser
               user={user}
               setUser={setUser}
               limpiarDatos={limpiarDatos}
               editar={editar}
            
            />

         ) : (
         <> 
         <MDButton variant="gradient" color="info" size="medium" onClick={handleNuevoUser}>
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
                    Authors Table
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  {/*La Tabla va aki */}
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

export default Users;