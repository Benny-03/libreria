import { useState } from "react";
import { AddCategory } from "../../Firebase";
import { useAuth } from "../../state";
import '../../css/homepage.css';

function AddCat() {
    const { setMessage, message, setCategory } = useAuth();
    const [addFlag, setAddFlag] = useState(false);
    const [popup, setPopup] = useState(false);
    const [name, setName] = useState({
        categoria: ''
    });

    const toggleAddFlag = () => {
        setAddFlag(!addFlag);
    }

    const togglePopup = () => {
        setPopup(!popup);
    }

    const addCategory = async () => {
        const flag = await AddCategory(name.categoria);
        if (flag) {
            setMessage('La categoria è stata aggiunta');
            setCategory(prevCat => [...prevCat, name]);
        } else {
            setMessage('La categoria è già presente');
        }
        setAddFlag(false);
        setPopup(true);
    }

    return (
        <>
            <button onClick={toggleAddFlag}>Aggiungi categoria</button>
            {addFlag && (
                <div className='box-popup add category'>
                    <div className='popup'>
                        <div className='title'>
                            <button className='close' onClick={toggleAddFlag}>
                                <i className='fas fa-close' style={{ fontSize: "20px" }}></i>
                            </button>
                            <h1 style={{ textAlign: "center" }}>Aggiungi categoria</h1>
                        </div>
                        <form>
                            <div className='row'>
                                <label htmlFor="nome"> Nome:
                                    <input type="text" id="nome" autoComplete="current-nome" required placeholder='nome categoria' onChange={(e) => setName({ categoria: e.target.value })} />
                                </label>
                            </div>
                        </form>
                        <button onClick={addCategory}>Aggiungi categoria</button>
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

export default AddCat;