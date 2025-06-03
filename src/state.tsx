/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, use, useEffect, useState } from "react";
import { GetDocuments } from "./Firebase";

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
    books: [],
    setBooks: (value: []) => {}
});

let userStorage = localStorage.getItem('user');
userStorage = userStorage ? JSON.parse(userStorage) : null;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [nome, setNome] = useState(userStorage ? userStorage.nome : '');
    const [cognome, setCognome] = useState(userStorage ? userStorage.cognome : '');
    const [username, setUsername] = useState(userStorage ? userStorage.username : '');
    const [email, setEmail] = useState(userStorage ? userStorage.id : '');
    const [data, setData] = useState(userStorage ? userStorage.data_nascita : '');
    const [message, setMessage] = useState('');
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const querySnapshot = await GetDocuments();
                const booksData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBooks(booksData);
            } catch (error) {
                console.error("Errore nel recupero dei libri:", error);
            }
        };

        fetchBooks();
    }, []);

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
                setBooks
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => use(AuthContext);