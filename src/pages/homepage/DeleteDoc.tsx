import { useState } from "react";
import { useAuth } from "../../state";
import { DeleteDocument } from "../../Firebase";
import '../../css/homepage.css';

function DeleteDoc (props) {
    const { setMessage, message, setBooks } = useAuth();
    const [popup, setPopup] = useState(false);

    const togglePopup = () => {
        setPopup(!popup);
    }
    
    const Delete = async () => {
        await DeleteDocument(props.id);
        setBooks(prevBooks => prevBooks.filter(book => book.id !== props.id));
        setMessage('Il libro è stato eliminato');
        setPopup(true);
    }

    return(
        <>
            <button className='btn-delete' onClick={Delete}><i className='fas fa-trash'></i></button>
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