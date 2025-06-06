import { useState } from "react";
import { useAuth } from "../../state";
import { DeleteCategory} from "../../Firebase";
import '../../css/homepage.css';

function DeleteCat (props) {
    const { setMessage, message, setCategory } = useAuth();
    const [popup, setPopup] = useState(false);

    const togglePopup = () => {
        setPopup(!popup);
    }
    
    const Delete = async () => {
        await DeleteCategory(props.category);
        setCategory(prevCat => prevCat.filter(cat => cat.categoria !== props.category));
        setMessage('La categoria è stata eliminata');
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

export default DeleteCat;