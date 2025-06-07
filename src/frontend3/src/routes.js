
// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Calculation from "layouts/calculation";
import { Configuracion } from "layouts/configuration";
import Users from "layouts/users";
import Trazas from "layouts/trazas";
import ModuloEstadisticas from "layouts/estadistica";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";

import Login from "auth/login";
import Register from "auth/register";
import Mapa from "layouts/map/map";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TrazasImg from "assets/images/trazas.png";
import UserImg from "assets/images/user.png";
import CalculationImg from "assets/images/calculation.png";
import InicioImg from "assets/images/inicio.png";
import UbicacionImg from "assets/images/ubicacion.png"
import AjustesImg from "assets/images/ajustes.png"
import EstadisticaImg from "assets/images/estadistica.png"
 

const ImageIcon = ({ src, alt, fontSize = "small" }) => {
  const size = fontSize === "small" ? 20 : 25; // Ajusta los tamaños según necesites
  
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: size, 
        height: size,
        filter: "invert(1)", // Opcional: si necesitas que sean blancos
      }} 
    />
  );
};

const routes = [
  {
    type: "auth",
    name: "Login",
    key: "login",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    type: "collapse",
    name: "Inicio",
    key: "dashboard",
    icon: <ImageIcon src={InicioImg} alt="Inicio" fontSize="small" />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Ubicación",
    key: "ubicacion",
    icon: <ImageIcon src={UbicacionImg} alt="Ubicación" fontSize="small" />,
    route: "/area",
    component: <Mapa />,
  },  
   {
    type: "collapse",
    name: "Cálculos",
    key: "calculation",
    icon: <ImageIcon src={CalculationImg} alt="Calculos" fontSize="small" />,
    route: "/calculation",
    component: <Calculation />,
  }, 
   {
    type:"collapse",
    name:"Usuarios",
    key:"users",
    icon:<ImageIcon src={UserImg} alt="Usuarios" fontSize="small" />,
    route:"/users",
    component:<Users />,
   },
   {
    type:"collapse",
    name:"Trazas",
    key:"trazas",
    icon:<ImageIcon src={TrazasImg} alt="Trazas" fontSize="small" />,
    route:"/trazas",
    component:<Trazas />,
   },
   {
    type:"collapse",
    name:"Estadistica",
    key:"estadistica",
    icon:<ImageIcon src={EstadisticaImg} alt="Trazas" fontSize="small" />,
    route:"/estadistica",
    component:<ModuloEstadisticas />,
   },
   {
    type:"collapse",
    name:"Configuracion",
    key:"configuracion",
    icon:<ImageIcon src={AjustesImg} alt="Trazas" fontSize="small" />,
    route:"/configuracion",
    component:<Configuracion />,
   },

  {
    type: "collapse",
    name: "Salir",
    key: "salir",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">reigster</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
  {
    type: "auth",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "auth",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/auth/reset-password",
    component: <ResetPassword />,
  },
];

export default routes;