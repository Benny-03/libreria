import { useState } from 'react';
import '../../css/login-register.css';
import { createUser, getUser } from '../../Firebase';
import { addUsers } from '../../Firebase';
import image from '../../images/login-image.jpg';
import { useAuth } from '../../state';
import { isFirebaseError } from '../../Firebase';

function Register() {
    const { email, setEmail, username, setUsername, nome, setNome, cognome, setCognome, data, setData, message, setMessage} = useAuth();
    const [password, setPassword] = useState('');
    const [isPresent, setIsPresent] = useState(false);
    const [flagPassword, setFlagPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [registered, setRegistered] = useState(false);

    const togglePresent = () => {
        setIsPresent(!isPresent);
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email_utente = nome.toLowerCase() + '.' + cognome.toLowerCase() + '@studio.com';
        setEmail(email_utente);

        try {
            await createUser(email_utente, password);
            await addUsers(email_utente, nome, cognome, data, username);
            const user = await getUser(email_utente);
            localStorage.setItem('user', JSON.stringify(user));
            setRegistered(true);
        } catch (error) {
            if (isFirebaseError(error)) {
                if (error.code === 'auth/email-already-in-use') {
                    setIsPresent(true);
                    setNome('');
                    setCognome('');
                    setData('');
                    setUsername('');
                    setPassword('');
                    setEmail('');
                    setFlagPassword(false);
                } 
                if (error.code === 'auth/weak-password') {
                    setFlagPassword(true);
                    setPassword('');
                }
            } else {
                setMessage("Errore sconosciuto");
            }
        }
    };

    return (
        <div className='root-register-page'>
            <div className='register-page'>
                <img src={image} className='img' />
                <div className='container'>
                    <div className='box'>
                        <h1 style={{ textAlign: 'center' }}>Registrati!</h1>
                        <div className='form-container'>
                            <form style={{ width: "80%" }} onSubmit={handleSubmit}>
                                <div className='form'>
                                    <div className='form-group username'>
                                        <i className='fas fa-user-o'></i>
                                        <label htmlFor="nome"> Username:
                                            <input type="username" id="username" autoComplete="current-username" required onChange={(e) => setUsername(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group nome'>
                                        <i className='fas fa-user-o'></i>
                                        <label htmlFor="nome"> Nome:
                                            <input type="text" id="nome" autoComplete="current-name" required onChange={(e) => setNome(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group cognome'>
                                        <i className='fas fa-user-o'></i>
                                        <label htmlFor="nome"> Cognome:
                                            <input type="text" id="cognome" autoComplete="current-surname" required onChange={(e) => setCognome(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group data'>
                                        <i className='fas fa-clock-o'></i>
                                        <label htmlFor="password"> Data di nascita:
                                            <input type="date" id="data" autoComplete="current-data" required onChange={(e) => setData(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group password'>
                                        <i className='fas fa-lock'></i>
                                        <label htmlFor="password"> Password:
                                            <input type="password" id="password" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                                        </label>
                                    </div>
                                    { flagPassword && (<p className='alert-psw'>deve essere almeno lunga 6 caratteri !</p>)}
                                </div>
                                <button type='submit'>Iscriviti</button>
                            </form>
                            <div className="login">
                                <p>Hai giá un account? <a href="/library/" style={{ color: "#3FB6FF", fontWeight: "bold" }}>Accedi</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{textAlign: "center"}}>Errore durante la registrazione</h1>
                        <p style={{textAlign: "center"}}>{message}</p>
                        <button onClick={toggleOpen}>Chiudi</button>
                    </div>
                </div>
            )}
            {isPresent && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{textAlign: "center"}}>Errore durante la registrazione</h1>
                        <p style={{textAlign: "center"}}>Il tuo account esiste giá: <a href="/library" style={{ color: "#3FB6FF", fontWeight: "bold" }}>Accedi</a></p>
                        <button onClick={togglePresent}>Chiudi</button>
                    </div>
                </div>
            )}
            {registered && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{textAlign: "center"}}>Registrazione avvenuta con successo!</h1>
                        <p style={{textAlign: "center"}}>La tua Email è: <a style={{color: "#3FB6FF", fontWeight: "bold", textDecoration: "underline", pointerEvents: "none"}}>{email}</a></p>
                        <button onClick={() => window.location.href = '/library/home'}>Vai alla Home</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Register;