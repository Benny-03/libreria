import { useState } from "react";
import { useAuth } from "../../state";
import { DeleteDocument } from "../../Firebase";
import '../../css/homepage.css';

function DeleteDoc (props) {
    const { setMessage, message } = useAuth();
    const [popup, setPopup] = useState(false);

    const togglePopup = () => {
        setPopup(!popup);
        if (popup) {
            window.location.reload();
        }
    }
    
    const Delete = async () => {
        await DeleteDocument(props.id);
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