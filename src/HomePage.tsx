import './css/homepage.css';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import { GetCategories, AddDocument, GetDocuments } from './Firebase';
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

const fetchCategories = async () => {
    try {
        const categories = await GetCategories();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

function HomePage() {
    //const { books } = useAuth();
    const [books, setBooks] = useState([]);
    const [isOpen, setOpen] = useState(false);
    const [addFlag, setAddFlag] = useState(false);
    const [category, setCategory] = useState([]);

    const book = {
        id: '',
        titolo: '',
        categoria: '',
        autori: [],
        casa_editrice: '',
        anno_pubblicazione: ''
    }

    const toggleOpen = () => {
        setOpen(!isOpen);
    }

    const toggleAddFlag = () => {
        setAddFlag(!addFlag);
    }

    const addBook = async () => {
        await AddDocument(book.id, book.titolo, book.autori, book.anno_pubblicazione, book.casa_editrice, book.categoria);
        setAddFlag(false);
        window.location.reload();
    }

    useEffect(() => {
        const loadBooks = async () => {
            const booksData = await fetchBooks();
            setBooks(booksData);
        }
        loadBooks();

        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategory(categoriesData);
        }
        loadCategories();
    }, []);

    return (
        <div className='home-page'>
            <Sidebar />
            <div className='site-content'>
                <h1>Raccolta libri</h1>
                <div className='add-book'>
                    <button onClick={toggleAddFlag}>Aggiungi</button>
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
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => {
                                if (!book.id || !book.titolo || !book.autori || !book.categoria || !book.casa_editrice || !book.anno_pubblicazione) {
                                    return null;
                                }

                                return (
                                    <tr key={index} onClick={toggleOpen} >
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
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {isOpen && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{ textAlign: "center" }}>Modifica libro</h1>
                        <button onClick={toggleOpen}>Salva</button>
                    </div>
                </div>
            )}
            {addFlag && (
                <div className='box-popup add'>
                    <div className='popup'>
                        <div className='title'>
                            <button className='close' onClick={toggleAddFlag}>
                                <i className='fas  fa-close' style={{fontSize: "20px"}}></i>
                            </button>
                            <h1 style={{ textAlign: "center" }}>Aggiungi libro</h1>
                        </div>
                        <form>
                            <div className='row'>
                                <label htmlFor="isbn"> ISBN:
                                    <input type="number" id="isbn" autoComplete="current-isbn" onChange={(e) => book.id = e.target.value} />
                                </label>
                                <label htmlFor="titolo"> Titolo:
                                    <input type="text" id="titolo" autoComplete="current-titolo" onChange={(e) => book.titolo = e.target.value} />
                                </label>
                            </div>
                            <div className='row'>
                                <label htmlFor="casa"> Casa editrice:
                                    <input type="text" id="casa" autoComplete="current-casa" onChange={(e) => book.casa_editrice = e.target.value} />
                                </label>
                                <label htmlFor="anno"> Anno di pubblicazione:
                                    <input type="number" id="anno" autoComplete="current-anno" onChange={(e) => book.anno_pubblicazione = e.target.value} />
                                </label>
                            </div>
                            <div className='row'>
                                <div className='box-autori'>
                                    <label htmlFor="autori"> Autori:
                                        <input type="text" id="autori" autoComplete="current-autori" onChange={(e) => {
                                            book.autori = e.target.value.split(', ').map((author: string) => author);
                                        }}/>
                                    </label>
                                    <p>Devono essere divisi da una virgola</p>
                                </div>
                                <label htmlFor='categorie'> Categoria:
                                    <select id='categorie' onChange={(e) => book.categoria = e.target.value}>
                                        {category.map((cat, index) => {
                                            return (
                                                <option key={index} value={cat.categoria}>{cat.categoria}</option>
                                            )
                                        })}
                                        <option value="Nessuna">Nessuna</option>
                                    </select>
                                </label>
                            </div>
                        </form>
                        <button onClick={addBook}>Aggiungi</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage;
