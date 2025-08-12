import React, {createContext, ReactNode, useContext, useState} from 'react';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (register: RegisterType) => Promise<void>;
    logout: () => void;
    sendCode: (email: string) => Promise<void>;
}

interface ErrorResponse {
    status: number;
    msg: string;
    timestamp: string;
}

interface RegisterType {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    twoFactorEnabled: boolean;
    verificationCode: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }

        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const register = async (register: RegisterType) => {
        const response = await fetch('http://localhost:8080/api/v1/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstname: register.firstname,
                lastname: register.lastname,
                email: register.email,
                password: register.password,
                passwordConfirmation: register.passwordConfirmation,
                twoFactorEnabled: register.twoFactorEnabled,
                verificationCode: register.verificationCode,
            }),
        });

        if (!response.ok) {
            const errorResponse: ErrorResponse = await response.json();
            throw new Error(errorResponse.msg);
        }

        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
    };

    const sendCode = async (email: string) => {
        const response = await fetch('http://localhost:8080/api/v1/auth/send-code', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                type: 'EMAIL_CONFIRMATION'
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка регистрации');
        }
    };

    return (
        <AuthContext.Provider value={{token, login, logout, register, sendCode}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};