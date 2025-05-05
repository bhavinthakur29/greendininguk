import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check if admin is already logged in
        const savedAuth = localStorage.getItem('adminAuth');
        return savedAuth === 'true';
    });

    useEffect(() => {
        localStorage.setItem('adminAuth', isAuthenticated);
    }, [isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 