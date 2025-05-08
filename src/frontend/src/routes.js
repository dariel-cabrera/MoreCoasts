
import ProtectedRoute from "examples/ProtectedRoute";

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Calculation from "layouts/calculation";
import Users from "layouts/users";
import Trazas from "layouts/trazas";
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

const ImageIcon = ({ src, alt, fontSize = "small" }) => {
  const size = fontSize === "small" ? 20 : 25;
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: size, 
        height: size,
        filter: "invert(1)",
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
    component: (
      <ProtectedRoute requiredRoles={["admin","worker"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Ubicación",
    key: "ubicacion",
    icon: <ImageIcon src={UbicacionImg} alt="Ubicación" fontSize="small" />,
    route: "/area",
    component: (
      <ProtectedRoute requiredRoles={["admin", "worker"]}>
        <Mapa />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Cálculos",
    key: "calculation",
    icon: <ImageIcon src={CalculationImg} alt="Cálculos" fontSize="small" />,
    route: "/calculation",
    component: (
      <ProtectedRoute requiredRoles={["admin", "worker"]}>
        <Calculation />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "users",
    icon: <ImageIcon src={UserImg} alt="Usuarios" fontSize="small" />,
    route: "/users",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Trazas",
    key: "trazas",
    icon: <ImageIcon src={TrazasImg} alt="Trazas" fontSize="small" />,
    route: "/trazas",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Trazas />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    type: "examples",
    name: "User Profile",
    key: "user-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/user-profile",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    type: "examples",
    name: "User Management",
    key: "user-management",
    icon: <Icon fontSize="small">list</Icon>,
    route: "/user-management",
    component: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <UserManagement />
      </ProtectedRoute>
    ),
  },
  {
    type: "auth",
    name: "Register",
    key: "register",
    icon: <Icon fontSize="small">app_registration</Icon>,
    route: "/auth/register",
    component: <Register />,
  },
  {
    type: "auth",
    name: "Forgot Password",
    key: "forgot-password",
    icon: <Icon fontSize="small">lock_reset</Icon>,
    route: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    type: "auth",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">lock_open</Icon>,
    route: "/auth/reset-password",
    component: <ResetPassword />,
  },
];

export default routes;
