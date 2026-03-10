/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, useContext, useEffect, useState } from "react";
import { GetCategories, GetDocuments, auth, getUser} from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({
    nome: '',
    setNome: (value: string) => {},
    cognome: '',
    setCognome: (value: string) => {},
    username: '',
    setUsername: (value: string) => {},
    email: '',
    setEmail: (value: string) => {},
    data: '',
    setData: (value: string) => {},
    message: '',
    setMessage: (value: string) => {},
    books: [] as any[],
    setBooks: (value: any[]) => {},
    category: [] as any[],
    setCategory: (value: any[]) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');
    const [books, setBooks] = useState<any[]>([]);
    const [category, setCategory] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email || '');
            } else {
                setEmail('');
                setBooks([]);
                setCategory([]);
            }

        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!email) return;

        const fetchUserData = async () => {
            const user = await getUser(email);
            setNome(user.nome);
            setCognome(user.cognome);
            setUsername(user.username);
            setData(user.data_nascita);
        };

        const fetchBooks = async () => {
            try {
                const data = await GetDocuments(email);
                setBooks(data || []);
            } catch (error) {
                console.error("Errore nel recupero dei libri:", error);
            }
        };
        const fetchCategories = async () => {
            try {
                const data = await GetCategories(email);
                setCategory(data || []);
            } catch (error) {
                console.error("Errore nel recupero delle categorie:", error);
            }
        };
        fetchUserData();
        fetchBooks();
        fetchCategories();

    }, [email]);

    return (
        <AuthContext.Provider
            value={{
                nome,
                setNome,
                cognome,
                setCognome,
                username,
                setUsername,
                email,
                setEmail,
                data,
                setData,
                message,
                setMessage,
                books,
                setBooks,
                category,
                setCategory
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);