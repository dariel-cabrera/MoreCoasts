import { useState, useEffect, useContext, useRef } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/MoreCoastIco.png";
import brandDark from "assets/images/MoreCoastIco.png";
import { setupAxiosInterceptors } from "./services/interceptor";

import ProtectedRoute from "examples/ProtectedRoute";

import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import Login from "auth/login";
import Register from "auth/register";
import { AuthContext } from "context";

import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";



export default function App() {
  const authContext = useContext(AuthContext);
  const [controller, dispatch] = useMaterialUIController();
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

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const onMouseEnterRef = useRef(onMouseEnter);
  onMouseEnterRef.current = onMouseEnter;

  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
  }, []);

  useEffect(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    setupAxiosInterceptors(() => {
      authContext.logout();
      navigate("/auth/login");
    });
  }, [authContext]);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnterRef.current) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnterRef.current) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const allowedRoutesForWorker = ["/dashboard", "/ubicacion", "/calculation", "/estadistica", "/profile"];

  const filterRoutesByRole = (allRoutes) => {
    if (!authContext.user) return [];
    if (authContext.role === "admin") return allRoutes;

    if (authContext.role === "worker") {
      return allRoutes
        .map((route) => {
          if (route.collapse) {
            const filteredCollapse = filterRoutesByRole(route.collapse);
            return filteredCollapse.length ? { ...route, collapse: filteredCollapse } : null;
          }
          if (route.route && allowedRoutesForWorker.includes(route.route)) {
            return route;
          }
          return null;
        })
        .filter(Boolean);
    }

    return [];
  };

  const filteredRoutes = filterRoutesByRole(routes);

  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) return getRoutes(route.collapse);
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
      return [];
    });

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
      <Icon fontSize="small" color="inherit">settings</Icon>
    </MDBox>
  );

  const themeToUse = direction === "rtl"
    ? (darkMode ? themeDarkRTL : themeRTL)
    : (darkMode ? themeDark : theme);

  const renderRoutes = (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route
        exact
        path="/user-profile"
        element={
          <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        exact
        path="/user-management"
        element={
          <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      {getRoutes(filteredRoutes)}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />

    </Routes>
  );

  const AppContent = (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="MoreCoast"
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      {renderRoutes}
    </ThemeProvider>
  );

  return direction === "rtl" && rtlCache ? (
    <CacheProvider value={rtlCache}>{AppContent}</CacheProvider>
  ) : (
    AppContent
  );
}
