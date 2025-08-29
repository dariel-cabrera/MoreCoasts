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
import { TablaUser } from "./table/dataTableUser";
import DataTable from "examples/Tables/DataTable";
import { eliminarDatos } from "./UserFunction";

function Users(){
    const [user,setUser]=useState({
        name:"",
        lastname:"",
        user_name:"",
        rol:"",
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
            user_name:"",
            email:"",
            password:"",
            ci:""
        });
        setEditar(false);
        setMstNvoUser(false);
    };
    
    const editarUsers = (val) => {
        
        setEditar(true);
        setMstNvoUser(true);
        setUser({
          name:val.name,
          lastname:val.lastname,
          user_name:val.user_name,
          email:val.email,
          id:val._id
        });
    };

    const handleNuevoUser = () => {
        setMstNvoUser(true);
    };
    
    const tablaUser = TablaUser({
        users:users,
        onEditar: (val) => editarUsers(val),
        onEliminar: (id) => eliminarDatos({ idValue: id, getDatos: getDatos, limpiarDatos: limpiarDatos }),
    });
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
               getDatos={getDatos}
            
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
                    Usuarios del Sistema
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                   <DataTable
                      table={tablaUser}
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

export default Users;