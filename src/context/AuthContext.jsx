import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ryzno_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, we'd verify the token with the backend here
            const savedUser = JSON.parse(localStorage.getItem('ryzno_user'));
            if (savedUser) {
                setUser(savedUser);
            }
        }
        setLoading(false);
    }, [token]);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        localStorage.setItem('ryzno_token', tokenData);
        localStorage.setItem('ryzno_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ryzno_token');
        localStorage.removeItem('ryzno_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
