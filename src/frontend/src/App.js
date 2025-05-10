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
  // Utiliza el hook useContext para acceder al contexto de autenticación (AuthContext). Este contexto probablemente 
  // contiene información sobre el estado de autenticación del usuario (por ejemplo, si está logueado o no
  const authContext = useContext(AuthContext);

  // Utiliza un hook personalizado (useMaterialUIController) para obtener el estado (controller) y la función de 
  // despacho (dispatch) de un contexto relacionado con Material UI. Esto permite manejar el estado de la interfaz de usuario (UI).
  const [controller, dispatch] = useMaterialUIController();

  // Extrae propiedades específicas del objeto controller, como el estado del menú lateral
  //  (miniSidenav), la dirección del texto (direction), el diseño (layout), etc.
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  // Define varios estados locales:
  //onMouseEnter: Controla si el mouse está sobre el menú lateral.
  // rtlCache: Almacena la caché para estilos RTL (derecha a izquierda).
  //pathname: Obtiene la ruta actual de la URL usando el hook useLocation de react-router-dom.
  // isDemo: Indica si la aplicación está en modo de demostración.
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  
  
  const [isDemo, setIsDemo] = useState(false);

  // Usa useEffect para verificar si la aplicación está en modo de demostración. 
  // Esto se hace comparando la variable de entorno REACT_APP_IS_DEMO con el valor "true".
  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "false");
  }, []);

  // Cache for the rtl
  // Usa useMemo para crear una caché de estilos RTL 
  // (derecha a izquierda) y almacenarla en el estado rtlCache. Esto solo se ejecuta una vez al montar el componente.
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  //     Define funciones para manejar eventos de mouse
  // handleOnMouseEnter: Expande el menú lateral cuando el mouse entra en él.
  //handleOnMouseLeave: Colapsa el menú lateral cuando el mouse sale de él.
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  // Alterna el estado del configurador (openConfigurator) entre abierto y cerrado.
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // if the token expired or other errors it logs out and goes to the login page
  // Configura interceptores de Axios para manejar errores (por ejemplo, token expirado). Si ocurre un error, 
  // cierra la sesión del usuario y lo redirige a la página de inicio de sesión.
  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  // Setting the dir attribute for the body element
  // Cambia la dirección del texto del cuerpo del documento (dir) según el estado direction (LTR o RTL).
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  // Restablece la posición del scroll a la parte superior de la página cada vez que cambia la ruta (pathname).
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Recorre un array de rutas (allRoutes) y genera componentes Route para cada una. 
  // Si la ruta está protegida (type !== "auth"), 
  // la envuelve en un componente ProtectedRoute que verifica la autenticación del usuario.
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.type !== "auth") {
        return (
          <Route   
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }
      return null;
    });

    // Define un botón flotante que abre el configurador de la aplicación.
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>

      {/*  Condición direction === "rtl": Si la dirección del texto es de derecha a izquierda (RTL), 
      se renderiza la interfaz con estilos RTL.
        CacheProvider: Proporciona la caché de estilos RTL (rtlCache) para componentes que la necesiten.
        ThemeProvider: Aplica un tema de Material UI basado en el modo oscuro (darkMode). 
        Si darkMode es true, usa themeDarkRTL; de lo contrario, usa themeRTL.*/}
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
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              <Route path="login" element={<Navigate to="/auth/login" />} />
              <Route path="register" element={<Navigate to="/auth/register" />} />
              <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" />} />
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          {/*CssBaseline: Normaliza los estilos CSS para garantizar consistencia en todos los navegadores.
        Renderizado condicional del diseño (layout):
            Si el diseño es "dashboard", se muestra el menú lateral (Sidenav), el configurador (Configurator)
             y el botón de configuración (configsButton).
            Si el diseño es "vr", solo se muestra el configurador. */}
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="MoreCoast"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          {/* Rutas (Routes):
            Define rutas para login, registro y recuperación de contraseña, redirigiendo a las rutas 
            correspondientes (/auth/login, /auth/register, etc.).
            Usa la función getRoutes(routes) para generar rutas dinámicamente.
            Si la ruta no coincide con ninguna definida (path="*"), redirige al dashboard */}
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route
              exact
              path="user-profile"
              element={
                <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                  <UserProfile />
                </ProtectedRoute>
              }
              key="user-profile"
            />
            <Route
              exact
              path="user-management"
              element={
                <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                  <UserManagement />
                </ProtectedRoute>
              }
              key="user-management"
            />
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Routes>
        </ThemeProvider>
      )}
    </>
  );
}
