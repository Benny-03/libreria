import { useState } from 'react';
import './css/login-register.css';
import { createUser } from './Firebase';
import { addUsers } from './Firebase';
import image from './images/login-image.jpg';
import { useAuth } from './state';

function Register() {
    const { setEmail, username, setUsername, nome, setNome, cognome, setCognome, data, setData } = useAuth();
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(!isOpen);
        setPassword('');
        setNome('');
        setCognome('');
        setData('');
        setUsername('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email_utente = nome.toLowerCase() + '.' + cognome.toLowerCase() + '@studio.com';
        setEmail(email_utente);

        try {
            await createUser(email_utente, password);
            await addUsers(email_utente, nome, cognome, data, username);
            window.location.href = '/library/home';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Errore durante la registrazione');
            togglePopup();
        }
    };

    return (
        <>
            <div className='login-page'>
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
                                            <input type="username" id="username" value={username} autoComplete="current-username" required onChange={(e) => setUsername(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group nome'>
                                        <i className='fas fa-user-o'></i>
                                        <label htmlFor="nome"> Nome:
                                            <input type="text" id="nome" value={nome} autoComplete="current-name" required onChange={(e) => setNome(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group cognome'>
                                        <i className='fas fa-user-o'></i>
                                        <label htmlFor="nome"> Cognome:
                                            <input type="text" id="cognome" value={cognome} autoComplete="current-surname" required onChange={(e) => setCognome(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group data'>
                                        <i className='fas fa-clock-o'></i>
                                        <label htmlFor="password"> Data di nascita:
                                            <input type="date" id="data" value={data} autoComplete="current-data" required onChange={(e) => setData(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group password'>
                                        <i className='fas fa-lock'></i>
                                        <label htmlFor="password"> Password:
                                            <input type="password" id="password" value={password} autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                                        </label>
                                    </div>
                                    <p className='alert-psw'>deve essere almeno lunga 6 caratteri !</p>
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
                        <h1>Errore durante la registrazione</h1>
                        <p>Il tuo account esiste giá: <a href="/library/" style={{ color: "#3FB6FF", fontWeight: "bold" }}>Accedi</a></p>
                        <button onClick={togglePopup}>Chiudi</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Register;