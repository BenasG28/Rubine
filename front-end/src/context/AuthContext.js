import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();
    const fetchUserRoles = useCallback(async (token) => {
        try {
            const response = await axios.get("/auth/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRoles(response.data.roles);
        } catch (error) {
            console.error("Error fetching user roles:", error);
            localStorage.removeItem('token');
            setToken(null);
            setIsAuthenticated(false);
            setRoles([]);
            navigate('/login');
        }
    }, [navigate]);
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const initializeAuthentication = async () => {
            if (storedToken) {
                setToken(storedToken);
                setIsAuthenticated(true);
                await fetchUserRoles(storedToken);
            }
            setLoading(false);
        }
        initializeAuthentication().catch((error) => {
            console.error("Error during authentication initialization:", error);
            setLoading(false);
        })
    }, [fetchUserRoles]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        fetchUserRoles(newToken).catch((error) => {
            console.error("Error fetching user roles during login:", error);
            logout();
        });
        navigate('/main');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setRoles([]);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, roles, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;