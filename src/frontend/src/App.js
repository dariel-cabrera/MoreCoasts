// Se importan hooks de React como useState, useEffect, useMemo y useContext para manejar el 
// estado, efectos secundarios, memorización y contexto.
import { useState, useEffect, useMemo, useContext } from "react";

// react-router components
// Se importan componentes y hooks de react-router-dom 
// para manejar el enrutamiento en la aplicación.
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
// Se importan componentes de Material-UI (@mui) para manejar temas, 
// estilos globales (CssBaseline) e íconos.
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
// DBox es un componente personalizado de Material
//  Dashboard 2 React para manejar cajas o contenedores.
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
// Sidenav y Configurator son componentes personalizados para la 
// barra lateral y el configurador de la aplicación.
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import AdminRoute from "examples/ProtectedRoute/adminRouter";
import AccessDenied from "examples/ProtectedRoute/AccessDenied";
// Material Dashboard 2 React themes
// Se importan temas personalizados para la aplicación, tanto en modo claro como oscuro, y en formato LTR 
// (izquierda a derecha) y RTL (derecha a izquierda).
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
// Se importan herramientas para manejar estilos RTL (derecha a izquierda) 
// con stylis-plugin-rtl y @emotion/react.
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
// Se importan las rutas definidas para la aplicación.
import routes from "routes";

// Material Dashboard 2 React contexts
// Se importan funciones y hooks personalizados para manejar el 
// estado de la interfaz de usuario (UI) de Material Dashboard.
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
// Se importan imágenes para el logo de 
// la aplicación en modo claro y oscuro.
import brandWhite from "assets/images/MoreCoastIco.png";
import brandDark from "assets/images/MoreCoastIco.png";

//     Se importan componentes y utilidades adicionales, como:
// setupAxiosInterceptors: Para manejar interceptores de Axios (por ejemplo, 
// redirigir al login si el token expira).
// ProtectedRoute: Para proteger rutas que requieren autenticación.
// Componentes de autenticación (Login, Register, ForgotPassword, ResetPassword).
// Contexto de autenticación (AuthContext).
// Componentes de perfil y gestión de usuarios (UserProfile, UserManagement).
//Helmet: Para manejar metadatos del documento HTML.

import { setupAxiosInterceptors } from "./services/interceptor";
import ProtectedRoute from "examples/ProtectedRoute";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import Login from "auth/login";
import Register from "auth/register";
import { AuthContext } from "context";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import { Helmet } from "react-helmet";

export default function App() {
  const authContext = useContext(AuthContext);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();

  // Obtener rol del contexto
  const { role } = authContext;
  

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "false");
  }, []);

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // Filtrar rutas para el menú lateral
const menuRoutes = useMemo(() => {
  return routes.filter(route => {
    if (!route.showInMenu) return false; // 👈 Filtro clave que te falta
    if (route.type === "auth") return false;
    if (route.adminOnly && role !== "admin") return false;
    return true;
  });
}, [routes, role]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };


  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Función getRoutes modificada
  // Reemplaza la definición anterior de getRoutes por esta
const getRoutes = (allRoutes) =>
  allRoutes.flatMap((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse);
    }

    if (route.route) {
      if (route.type === "auth") {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }

      return (
        <Route
          exact
          path={route.route}
          element={
            route.adminOnly ? (
              <AdminRoute>
                {route.component}
              </AdminRoute>
            ) : (
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            )
          }
          key={route.key}
        />
      );
    }

    return [];
  });

 

  return (
    <>
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="MoreCoast"
                  routes={menuRoutes} // Usar menuRoutes filtradas
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                
              
              </>
            )}
           
            <Routes>
              <Route path="login" element={<Navigate to="/auth/login" />} />
              <Route path="register" element={<Navigate to="/auth/register" />} />
              <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" />} />
              <Route path="/access-denied" element={<AccessDenied />} /> {/* Nueva ruta */}
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="MoreCoast"
                routes={menuRoutes} // Usar menuRoutes filtradas
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
             
              
            </>
          )}
          
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} /> {/* Nueva ruta */}
            <Route
              exact
              path="/user-profile"
              element={
                <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                  <UserProfile />
                </ProtectedRoute>
              }
              key="user-profile"
            />
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Routes>
        </ThemeProvider>
      )}
    </>
  );
}