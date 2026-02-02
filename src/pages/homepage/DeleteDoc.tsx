import { useState } from "react";
import { useAuth } from "../../state";
import { DeleteDocument } from "../../Firebase";
import '../../css/homepage.css';

function DeleteDoc (props) {
    const { setMessage, message, setBooks } = useAuth();
    const [popup, setPopup] = useState(false);
    const [removeFlag, setRemoveFlag] = useState(false);

    const togglePopup = () => {
        setPopup(!popup);
    }

    const toggleRemoveFlag = () => {
        setRemoveFlag(!removeFlag);
    }

    const Delete = async () => {
        await DeleteDocument(props.id);
        setBooks(prevBooks => prevBooks.filter(book => book.id !== props.id));
        setMessage('Il libro è stato eliminato');
        setPopup(true);
        setRemoveFlag(false);
        window.location.reload();
    }

    return(
        <>
            <button className='btn-delete' onClick={toggleRemoveFlag}><i className='fas fa-trash'></i></button>
            {removeFlag && (
                <div className='box-popup remove book'>
                    <div className='popup'>
                        <div className='title'>
                            <h3 style={{ textAlign: "center" }}>Sei sicuro di eliminare il libro?</h3>
                        </div>
                        <div className='buttons'>
                            <button onClick={toggleRemoveFlag}>Annulla</button>
                            <button onClick={Delete}>Elimina</button>
                        </div>
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

export default DeleteDoc;