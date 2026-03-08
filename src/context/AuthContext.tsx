import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser {
    username: string;
    token: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (username: string, token: string, isAdmin: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        return token && username ? { token, username, isAdmin } : null;
    });

    const login = (username: string, token: string, isAdmin: boolean) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', String(isAdmin));
        setUser({ username, token, isAdmin });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
