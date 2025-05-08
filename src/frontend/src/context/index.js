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

// Contextos
const MaterialUI = createContext();

export const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

const ROLES_PERMITIDOS = ["admin", "worker"];

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole")?.toLowerCase();
    const storedUserData = localStorage.getItem("userData");

    try {
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }
      }

      if (token && storedRole && ROLES_PERMITIDOS.includes(storedRole)) {
        setIsAuthenticated(true);
        setUserRole(storedRole);
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }

        if (location.pathname === "/auth/login") {
          navigate("/dashboard");
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error("Token inválido:", err);
      logout();
    }
  }, []);

  const login = (token, role, userData) => {
    const normalizedRole = role.toLowerCase();

    if (!ROLES_PERMITIDOS.includes(normalizedRole)) {
      console.warn("Rol no permitido:", normalizedRole);
      logout();
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userRole", normalizedRole);
    localStorage.setItem("userData", JSON.stringify(userData));

    setIsAuthenticated(true);
    setUserRole(normalizedRole);
    setUserData(userData);

    if (normalizedRole === "admin") {
      navigate("/dashboard");
    } else if (normalizedRole === "worker") {
      navigate("/tasks");
    } else {
      navigate("/");
    }
  };

  const register = (token, role, userData) => {
    login(token, role, userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");

    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);

    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Material UI Configuración
MaterialUI.displayName = "MaterialUIContext";

function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": return { ...state, miniSidenav: action.value };
    case "TRANSPARENT_SIDENAV": return { ...state, transparentSidenav: action.value };
    case "WHITE_SIDENAV": return { ...state, whiteSidenav: action.value };
    case "SIDENAV_COLOR": return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR": return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR": return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR": return { ...state, openConfigurator: action.value };
    case "DIRECTION": return { ...state, direction: action.value };
    case "LAYOUT": return { ...state, layout: action.value };
    case "DARKMODE": return { ...state, darkMode: action.value };
    default: throw new Error(`Unhandled action type: ${action.type}`);
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
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }
  return context;
}

MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

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
