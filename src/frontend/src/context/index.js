
import { createContext, useContext, useReducer, useMemo, useState, useEffect,useCallback } from "react";


import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Material Dashboard 2 React main context
const MaterialUI = createContext();

export const AuthContext = createContext({
  isAuthenticated: false,
  role: null,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  error: null,
});

const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const decodeToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      return {
        role: decoded.role || "worker",
        user: {
          id: decoded.sub,
          username: decoded.username || "",
          email: decoded.email || "",
          // Agrega más campos según necesites
        },
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      setError(error.message);
      return null;
    }
  }, []);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        role: null,
        token: null,
        user: null,
      });
      setLoading(false);
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      localStorage.removeItem("token");
      setLoading(false);
      return;
    }

    setAuthState({
      isAuthenticated: true,
      role: decoded.role,
      token,
      user: decoded.user,
    });
    setLoading(false);

    // Redirigir si está en login y ya está autenticado
    if (location.pathname === "/auth/login") {
      navigate("/dashboard", { replace: true });
    }
  }, [decodeToken, location.pathname, navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token, refreshToken) => {
    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        throw new Error("Invalid token");
      }

      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setAuthState({
        isAuthenticated: true,
        role: decoded.role,
        token,
        user: decoded.user,
      });
      setError(null);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAuthState({
      isAuthenticated: false,
      role: null,
      token: null,
      user: null,
    });
    setError(null);
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        role: authState.role,
        token: authState.token,
        user: authState.user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContextProvider;


// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Material Dashboard 2 React context provider
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

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
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
