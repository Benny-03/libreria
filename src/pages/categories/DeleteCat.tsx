import { useState } from "react";
import { useAuth } from "../../state";
import { DeleteCategory} from "../../Firebase";
import '../../css/homepage.css';
import { UpdateDocument } from "../../Firebase";

function DeleteCat () {
    const { setMessage, message, setCategory, category, setBooks, books } = useAuth();
    const [popup, setPopup] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [catSelected, setCatSelected] = useState('');

    const togglePopup = () => {
        setPopup(!popup);
    }

    const toggleDeleteFlag = () => {
        setDeleteFlag(!deleteFlag);
    }
    
    const Delete = async () => {
        await DeleteCategory(catSelected);
        
        const booksToUpdate = books.filter(
            book => book.categoria === catSelected
        );

        for (const book of booksToUpdate) {
            await UpdateDocument(
                book.id,
                book.titolo,
                book.autori,
                book.anno_pubblicazione,
                book.casa_editrice,
                ''
            );
        }
        setCategory(prevCat => prevCat.filter(cat => cat.categoria !== catSelected));
        setBooks(prev => prev.map(book => book.categoria === catSelected
                    ? { ...book, categoria: 'Nessuna' }
                    : book
            )
        );
        setMessage('La categoria è stata eliminata');
        setPopup(true);
        setDeleteFlag(false);
    }

    return(
        <>  <button className="classic" onClick={toggleDeleteFlag}>Elimina categoria</button>
            {deleteFlag && (
                <div className='box-popup delete-cat'>
                    <div className='popup'>
                        <div className='title'>
                            <button className='close' onClick={toggleDeleteFlag}>
                                <i className='fas fa-close' style={{ fontSize: "20px" }}></i>
                            </button>
                            <h1 style={{ textAlign: "center" }}>Rimuovi categoria</h1>
                        </div>
                        <select value={catSelected} onChange={(e) => setCatSelected(e.target.value)}>
                            <option value="" disabled selected>Seleziona categoria</option>
                            {category.map((cat, index) => {
                                if (!cat.categoria) {
                                    return null;
                                }
                                return (
                                    <option key={index} value={cat.categoria}>{cat.categoria}</option>
                                );
                            })}
                        </select>
                        <button onClick={Delete}>Elimina categoria</button>
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
    )
}

export default DeleteCat;