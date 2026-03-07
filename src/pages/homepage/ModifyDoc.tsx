import { use, useEffect, useState } from "react";
import '../../css/homepage.css';
import { GetCategories, UpdateDocument } from "../../Firebase";
import { useAuth } from "../../state";

function ModifyDoc(props) {
  const { setBooks, email } = useAuth();
  const [flagModify, setFlagModify] = useState(false);
  const [category, setCategory] = useState([]);
  const [popup, setPopup] = useState(false);
  const [book, setBook] = useState({
    id: props.book.id,
    titolo: props.book.titolo,
    autori: props.book.autori,
    casa_editrice: props.book.casa_editrice,
    anno_pubblicazione: props.book.anno_pubblicazione,
    categoria: props.book.categoria,
    preferito: props.book.preferito
  });

  const fetchCategories = async () => {
    try {
      const categories = await GetCategories(email);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  const toggleFlag = () => {
    setFlagModify(!flagModify);
  }

  const togglePopup = () => {
    setPopup(!popup);
  }

  const modifyBook = async () => {
    await UpdateDocument(email, book.id, book.titolo, book.autori, book.anno_pubblicazione, book.casa_editrice, book.categoria, book.preferito);
    setBooks(prevBooks => prevBooks.map(b => b.id === book.id && b.user === email ? book : b));
    setPopup(true);
    setFlagModify(false);
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
      <button className='btn-modify classic' onClick={toggleFlag}><i className='fas fa-pencil'></i></button>
      {flagModify && (
        <div className='box-popup modify'>
          <div className='popup'>
            <div className='title'>
              <button className='close' onClick={toggleFlag}>
                <i className='fas fa-close' style={{ fontSize: "20px" }}></i>
              </button>
              <h1 style={{ textAlign: "center" }}>Modifica libro</h1>
              <p style={{ margin: "0" }}> ISBN: {props.book.id}</p>
            </div>
            <form>
              <div className='row'>
                <label htmlFor="titolo"> Titolo:
                  <input type="text" id="titolo" defaultValue={book.titolo} autoComplete="current-titolo" onChange={(e) => setBook({ ...book, titolo: e.target.value })} />
                </label>
                <div className='box-autori'>
                  <label htmlFor="autori"> Autori:
                    <input type="text" id="autori" autoComplete="current-autori" defaultValue={book.autori.join(", ")} onChange={(e) => setBook({ ...book, autori: e.target.value.split(', ').map((author: string) => author) })} />
                  </label>
                  <p>Devono essere divisi da una virgola</p>
                </div>
              </div>
              <div className='row'>
                <label htmlFor="casa"> Casa editrice:
                  <input type="text" id="casa" defaultValue={book.casa_editrice} autoComplete="current-casa" onChange={(e) => setBook({ ...book, casa_editrice: e.target.value })} />
                </label>
              </div>
              <label htmlFor="anno"> Anno di pubblicazione:
                <input type="number" id="anno" defaultValue={book.anno_pubblicazione} autoComplete="current-anno" onChange={(e) => setBook({ ...book, anno_pubblicazione: e.target.value })} />
              </label>
              <div className='row'>
                <label htmlFor='categorie'> Categoria:
                  <select id='categorie' onChange={(e) => setBook({ ...book, categoria: e.target.value })} defaultValue={book.categoria}>
                    {category.map((cat, index) => {
                      if (!cat.categoria) {
                        return null;
                      }
                      return (
                        <option key={index} value={cat.categoria}>{cat.categoria}</option>
                      )
                    })}
                  </select>
                </label>
              </div>
            </form>
            <button onClick={modifyBook}>Salva</button>
          </div>
        </div>
      )}
      {popup && (
        <div className='box-popup'>
          <div className='popup'>
            <h1 style={{ textAlign: "center" }}>Il libro è stato modificato correttamente !</h1>
            <button onClick={togglePopup}>Chiudi</button>
          </div>
        </div>
      )}
    </>

  );
}

export default ModifyDoc;