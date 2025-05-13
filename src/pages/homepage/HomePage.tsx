import '../../css/homepage.css';
import Sidebar from '../../Sidebar';
import { useEffect, useState } from 'react';
import { GetDocuments} from '../../Firebase';
import DeleteDoc from './DeleteDoc';
import ModifyDoc from './ModifyDoc';
import AddDoc from './AddDoc';
//import { useAuth } from './state';

const fetchBooks = async () => {
    try {
        const books = await GetDocuments();
        return books;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

function HomePage() {
    //const { books } = useAuth();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const loadBooks = async () => {
            const booksData = await fetchBooks();
            setBooks(booksData);
        }
        loadBooks();
    }, []);

    return (
        <div className='home-page'>
            <Sidebar />
            <div className='site-content'>
                <h1>Raccolta libri</h1>
                <div className='add-book'>
                    <AddDoc />
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Titolo</th>
                                <th>Categoria</th>
                                <th>Autori</th>
                                <th>Casa editrice</th>
                                <th>Anno di pubblicazione</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => {
                                if (!book.id || !book.titolo || !book.autori || !book.categoria || !book.casa_editrice || !book.anno_pubblicazione) {
                                    return null;
                                }

                                return (
                                    <tr key={index}>
                                        <td>{book.id}</td>
                                        <td>{book.titolo}</td>
                                        <td>{book.categoria}</td>
                                        <td>{book.autori.map((autore: string) => {
                                            return (
                                                <span key={autore}>
                                                    {autore}<br />
                                                </span>
                                            )
                                        })}</td>
                                        <td>{book.casa_editrice}</td>
                                        <td>{book.anno_pubblicazione}</td>
                                        <td className='box-btn'>
                                            <DeleteDoc id={book.id}/>
                                            <ModifyDoc book={book}/>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default HomePage;
