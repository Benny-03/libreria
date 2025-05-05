/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, use, useState } from "react";

const AuthContext = createContext({
    authenticated: false,
    setAuthenticated: (value: boolean) => {},
    nome: '',
    setNome: (value: string) => {},
    cognome: '',
    setCognome: (value: string) => {},
    username: '',
    setUsername: (value: string) => {},
    email: '',
    setEmail: (value: string) => {},
    data: '',
    setData: (value: string) => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [data, setData] = useState('');

    return (
        <AuthContext.Provider 
            value={{ 
                authenticated,
                setAuthenticated,
                nome,
                setNome,
                cognome,
                setCognome,
                username,
                setUsername,
                email,
                setEmail,
                data,
                setData 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => use(AuthContext);