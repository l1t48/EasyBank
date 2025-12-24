import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { TOKEN_EXPIRATION_CHECK_INTERVAL_MS, MILLISECONDS_PER_SECOND } from "../Data/Global_variables"

// Create the AuthContext that will be shared across the app
const AuthContext = createContext();

// AuthProvider component — wraps your app and provides authentication state
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Keep localStorage in sync whenever token or user changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }

        if (user) {
            localStorage.setItem("user", JSON.stringify(user)); 
        } else {
            localStorage.removeItem("user");
        }
    }, [token, user]); // Run this effect whenever token or user changes

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!token) return;
            try {
                const { exp } = jwtDecode(token);
                if (Date.now() / MILLISECONDS_PER_SECOND >= exp) {
                    logout();
                    window.location.href = "/session-expired";
                }
            } catch (err) {
                console.error("Invalid token:", err);
                logout();
                window.location.href = "/auth-page";
            }
        };
        checkTokenExpiration(); // Run immediately
        const interval = setInterval(checkTokenExpiration, TOKEN_EXPIRATION_CHECK_INTERVAL_MS); // Check every 30s
        return () => clearInterval(interval);
    }, [token]);

    function login(newToken, userData) {
        setToken(newToken);
        setUser(userData);
    }

    function logout() {
        setToken(null);
        setUser(null);
        window.location.href = "/";
    }

    // Provide auth data/functions to the app
    return (
        <AuthContext.Provider
            value={{
                token, 
                user, 
                login, 
                logout, 
                isAuthenticated: !!token 
            }}
        >
            {children} {/* Render children inside the provider */}
        </AuthContext.Provider>
    );
}

// Custom hook to easily access AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
