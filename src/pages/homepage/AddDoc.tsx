import { useEffect, useState } from "react";
import { AddDocument, GetCategories } from "../../Firebase";
import { useAuth } from "../../state";
import '../../css/homepage.css';

const fetchCategories = async () => {
    try {
        const categories = await GetCategories();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

function AddDoc() {
    const { setMessage, message } = useAuth();
    const [category, setCategory] = useState([]);
    const [addFlag, setAddFlag] = useState(false);
    const [popup, setPopup] = useState(false);
    const [book, setBook] = useState({
        id: '',
        titolo: '',
        categoria: '',
        autori: [],
        casa_editrice: '',
        anno_pubblicazione: ''
    });

    const toggleAddFlag = () => {
        setAddFlag(!addFlag);
    }

    const togglePopup = () => {
        setPopup(!popup);
        if (popup) {
            window.location.reload();
        }
    }

    const addBook = async () => {
        const flag = await AddDocument(book.id, book.titolo, book.autori, book.anno_pubblicazione, book.casa_editrice, book.categoria);
        if (flag) {
            setMessage('Il libro è stato aggiunto');
        } else {
            setMessage('Il libro è già presente');
        }
        setAddFlag(false);
        setPopup(true);
    }

    useEffect(() => {
        const loadCategories = async () => {
            const categoriesData = await fetchCategories();
            setCategory(categoriesData);
        }
        loadCategories();
    }, []);

    return (
        <>
            <button onClick={toggleAddFlag}>Aggiungi</button>
            {addFlag && (
                <div className='box-popup add'>
                    <div className='popup'>
                        <div className='title'>
                            <button className='close' onClick={toggleAddFlag}>
                                <i className='fas fa-close' style={{ fontSize: "20px" }}></i>
                            </button>
                            <h1 style={{ textAlign: "center" }}>Aggiungi libro</h1>
                        </div>
                        <form>
                            <div className='row'>
                                <label htmlFor="isbn"> ISBN:
                                    <input type="number" id="isbn" autoComplete="current-isbn" required placeholder='9788838613319' onChange={(e) => setBook({ ...book, id: e.target.value })} />
                                </label>
                                <label htmlFor="titolo"> Titolo:
                                    <input type="text" id="titolo" autoComplete="current-titolo" required placeholder='titolo' onChange={(e) => setBook({ ...book, titolo: e.target.value })} />
                                </label>
                            </div>
                            <div className='row'>
                                <label htmlFor="casa"> Casa editrice:
                                    <input type="text" id="casa" autoComplete="current-casa" required placeholder='casa editrice' onChange={(e) => setBook({ ...book, casa_editrice: e.target.value })} />
                                </label>
                                <label htmlFor="anno"> Anno di pubblicazione:
                                    <input type="number" id="anno" autoComplete="current-anno" required placeholder='2025' onChange={(e) => setBook({ ...book, anno_pubblicazione: e.target.value })} />
                                </label>
                            </div>
                            <div className='row'>
                                <div className='box-autori'>
                                    <label htmlFor="autori"> Autori:
                                        <input type="text" id="autori" autoComplete="current-autori" required placeholder='tommaso, filippo' onChange={(e) => {
                                            setBook({ ...book, autori: e.target.value.split(', ').map((author: string) => author) })
                                        }} />
                                    </label>
                                    <p>Devono essere divisi da una virgola</p>
                                </div>
                                <label htmlFor='categorie'> Categoria:
                                    <select id='categorie' onChange={(e) => setBook({ ...book, categoria: e.target.value })} defaultValue={"Nessuna"}>
                                        {category.map((cat, index) => {
                                            if (!cat.categoria) {
                                                return null;
                                            }
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
            {popup && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{ textAlign: "center" }}>{message}</h1>
                        <button onClick={togglePopup}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddDoc;