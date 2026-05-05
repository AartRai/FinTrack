import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/user');
                    const userData = response.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    console.error('Auth check failed', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                }
            } else {
                setUser(null);
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            const response = await api.post('/login', { email, password });
            console.log('Login response:', response.data);
            
            const { access_token, user: userData } = response.data;
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            console.log('Attempting registration for:', email);
            const response = await api.post('/register', { name, email, password });
            console.log('Registration response:', response.data);
            
            const { access_token, user: userData } = response.data;
            localStorage.setItem('auth_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
