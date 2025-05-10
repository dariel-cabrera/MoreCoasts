import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Contexto de Material UI
const MaterialUI = createContext();

// Contexto de Autenticación
export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  isLoading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
});

const ROLES_PERMITIDOS = ["admin", "worker"];

const AuthContextProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    userRole: null,
    userData: null,
    isLoading: true,
  });

  const navigate = useNavigate();
  const location = useLocation();

 const logout = () => {
  try {
    // Limpiar almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("lastAuthTime");

    // Resetear estado
    setState({
      isAuthenticated: false,
      userRole: null,
      userData: null,
      isLoading: false,
    });

    // Redirigir usando navigate (mejor para SPAs)
    navigate("/auth/login", { replace: true });
    
    console.log("Sesión cerrada correctamente");
  } catch (error) {
    console.error("Error en logout:", error);
    // Forzar recarga como fallback
    window.location.href = "/auth/login";
  }
};

  useLayoutEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole")?.toLowerCase();
      const storedUserData = localStorage.getItem("userData");
      const lastAuthTime = localStorage.getItem("lastAuthTime");

      try {
        // Si no hay token, marcamos como no autenticado
        if (!token) {
          setState({
            isAuthenticated: false,
            userRole: null,
            userData: null,
            isLoading: false,
          });
          return;
        }

        // Verificar token y expiración
        const decoded = jwtDecode(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();

        // Verificar inactividad (30 minutos)
        const isSessionExpired = lastAuthTime 
          ? Date.now() - parseInt(lastAuthTime) > 30 * 60 * 1000
          : true;

        if (isTokenExpired || isSessionExpired) {
          logout();
          return;
        }

        // Verificar rol permitido
        if (!ROLES_PERMITIDOS.includes(storedRole)) {
          console.warn("Rol no permitido:", storedRole);
          logout();
          return;
        }

        // Actualizar estado de autenticación
        setState({
          isAuthenticated: true,
          userRole: storedRole,
          userData: storedUserData ? JSON.parse(storedUserData) : null,
          isLoading: false,
        });

        // Redirigir desde login si es necesario
        if (location.pathname === "/auth/login") {
          navigate(storedRole === "admin" ? "/dashboard" : "/area");
        }

        // Actualizar tiempo de última autenticación
        localStorage.setItem("lastAuthTime", Date.now().toString());

      } catch (err) {
        console.error("Error de autenticación:", err);
        logout();
      }
    };

    validateAuth();
  }, [location.pathname, navigate]);

  const login = (token, role, userData) => {
    const normalizedRole = role.toLowerCase();

    if (!ROLES_PERMITIDOS.includes(normalizedRole)) {
      console.warn("Rol no permitido:", normalizedRole);
      throw new Error("Rol no autorizado");
    }

    // Guardar datos de autenticación
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", normalizedRole);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("lastAuthTime", Date.now().toString());

    // Actualizar estado
    setState({
      isAuthenticated: true,
      userRole: normalizedRole,
      userData: userData,
      isLoading: false,
    });

    // Redirigir según rol
    const redirectPath = normalizedRole === "admin" ? "/dashboard" : "/area";
    navigate(redirectPath);
  };

  const register = (token, role, userData) => {
    login(token, role, userData);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        userData: state.userData,
        isLoading: state.isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ... (resto del código de MaterialUI permanece igual)

MaterialUI.displayName = "MaterialUIContext";

function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV":
      return { ...state, miniSidenav: action.value };
    case "TRANSPARENT_SIDENAV":
      return { ...state, transparentSidenav: action.value };
    case "WHITE_SIDENAV":
      return { ...state, whiteSidenav: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    case "DIRECTION":
      return { ...state, direction: action.value };
    case "LAYOUT":
      return { ...state, layout: action.value };
    case "DARKMODE":
      return { ...state, darkMode: action.value };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

function useMaterialUIController() {
  const context = useContext(MaterialUI);
  if (!context) {
    throw new Error(
      "useMaterialUIController debe usarse dentro de MaterialUIControllerProvider."
    );
  }
  return context;
}

MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Actions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  AuthContextProvider,
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};