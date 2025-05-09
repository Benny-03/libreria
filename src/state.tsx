/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, use, useState } from "react";
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
    // books: [],
    // setBooks: (value: any) => {}
});

let userStorage = localStorage.getItem('user');
userStorage = userStorage ? JSON.parse(userStorage) : null;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [nome, setNome] = useState(userStorage ? userStorage.nome : '');
    const [cognome, setCognome] = useState(userStorage ? userStorage.cognome : '');
    const [username, setUsername] = useState(userStorage ? userStorage.username : '');
    const [email, setEmail] = useState(userStorage ? userStorage.id : '');
    const [data, setData] = useState(userStorage ? userStorage.data_nascita : '');
    // const [books, setBooks] = useState([]);

    // const fetchBooks = async () => {
    //     try {
    //         const books = await GetDocuments();
    //         return books;
    //     } catch (error) {
    //         console.error('Error fetching books:', error);
    //         return [];
    //     }
    // }
    // const loadBooks = async () => {
    //     const booksData = await fetchBooks();
    //     setBooks(booksData);
    // }
    // loadBooks();

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
                // books,
                // setBooks
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => use(AuthContext);