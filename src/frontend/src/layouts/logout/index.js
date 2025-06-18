import { useEffect, useCallback } from "react";
import { AuthContext } from "context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();
    const { logout: contextLogout } = useContext(AuthContext);
    
    // Memoizar la función logout para evitar recrearla en cada render
    const logout = useCallback(async () => {
        try {
            await contextLogout();
            // Redirigir al login si no lo hace ya el contextLogout
            navigate("/auth/login", { replace: true });
        } catch (error) {
            console.error("Error durante el logout:", error);
        }
    }, [contextLogout, navigate]);

    useEffect(() => {
        logout();
    }, [logout]); // Ahora incluye todas las dependencias correctamente

    
    return null; // No renderiza nada visible
};

export default Logout;