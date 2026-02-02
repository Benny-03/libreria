import { useState } from 'react';
import { AddDocument } from './Firebase';
import { useAuth } from './state';
import './css/google-books.css';

function GoogleBooks() {
  const { setBooks, books } = useAuth();
  const [isbn, setIsbn] = useState('');
  const [flag, setflag] = useState(false);
  const [searchResult, setSearchResult] = useState({
    isbn: 0,
    title: '',
    authors: [],
    publisher: '',
    publishedDate: '',
    category: '',
  });
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [popupConferma, setPopupConferma] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePopup = () => {
    setPopup(!popup);
  }

  const toggleFlag = () => {
    setflag(!flag);
  }

  const togglePopupConferma = () => {
    setPopupConferma(!popupConferma);
  }

  async function getBookByISBN(isbn: string) {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${import.meta.env.VITE_GOOGLE_BOOKS_KEY}`
    );

    if (!response.ok) {
      throw new Error("Errore nella chiamata API");
    }

    const data = await response.json();
    return data;
  }

  async function getBookByISBNAsync(isbn: string) {
    if (!isbn) return;

    try {
      setLoading(true);
      const data = await getBookByISBN(isbn);

      if (!data.items || data.items.length === 0) {
        setMessage('Nessun libro trovato');
        return;
      }

      const info = data.items[0].volumeInfo;
      const year = info.publishedDate?.substring(0, 4) || '';

      setMessage('Libro trovato con successo!');
      setSearchResult({
        isbn: Number(isbn),
        title: info.title || '',
        authors: info.authors || [],
        publisher: info.publisher || '',
        publishedDate: year,
        category: info.categories?.[0] || '',
      });

      togglePopup();
    } catch (err) {
      setMessage('Errore durante la ricerca del libro');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const addBook = async () => {
    //se la categoria del libro non c'è aggiungerla
      //const flag = await AddDocument(searchResult.isbn, searchResult.title, searchResult.authors, searchResult.publishedDate, searchResult.publisher, searchResult.category);
      if (flag) {
          setMessage('Il libro è stato aggiunto');
          //setBooks(prevBooks => [...prevBooks, searchResult]);
      } else {
          setMessage('Il libro è già presente');
      }
      togglePopup();
      togglePopupConferma();
  }

  return (
    <div className="google-books">
      <button onClick={toggleFlag}>Ricerca libro tramite ISBN</button>
        {flag && (
          <div className='box-popup google-books-popup'>
              <div className='popup'>
                  <div className='title'>
                      <button className='close' onClick={toggleFlag}>
                          <i className='fas fa-close' style={{ fontSize: "20px" }}></i>
                      </button>
                      <h1 style={{ textAlign: "center" }}>Ricerca libro</h1>
                  </div>
                  <form>
                      <label htmlFor="isbn"> ISBN:
                          <input type="number" id="isbn" autoComplete="current-isbn" required placeholder='9788838613319' onChange={(e) => setIsbn(e.target.value)} />
                      </label>
                  </form>
                  <button onClick={() => getBookByISBNAsync(isbn)} disabled={loading}>
                    {loading ? 'Ricerca in corso...' : 'Ricerca'}
                  </button>
              </div>
          </div>
      )}
      {popup && (
        <div className='box-popup google-books-popup'>
            <div className='popup'>
                <h1 style={{ textAlign: "center" }}>{message}</h1>
                <div className='book-info'>
                    <p><strong>Titolo:</strong> {searchResult.title}</p>
                    <p><strong>Autori:</strong> {searchResult.authors.join(', ')}</p>
                    <p><strong>Casa editrice:</strong> {searchResult.publisher}</p>
                    <p><strong>Anno di pubblicazione:</strong> {searchResult.publishedDate}</p>
                    <p><strong>Categoria:</strong> {searchResult.category}</p>
                </div>
                <div style={{display: 'flex', gap: '20px', width: '100%', justifyContent: 'center'}}>
                  <button onClick={addBook}>Aggiungi</button>
                  <button onClick={togglePopup}>Annulla</button>
                </div>
            </div>
        </div>
      )}
      {popupConferma && (
        <div className='box-popup'>
            <div className='popup'>
                <h1 style={{ textAlign: "center" }}>{message}</h1>
                <button onClick={togglePopupConferma}>Chiudi</button>
            </div>
        </div>
      )}
    </div>
  );
}

export default GoogleBooks;