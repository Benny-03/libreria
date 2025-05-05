import './css/login-register.css';
import { signInUser, resetPassword, getUser } from './Firebase';
import { useState } from 'react';
import image from './images/login-image.jpg';
import { useAuth } from './state';

const Login = () => {
    const { setAuthenticated, email, setEmail, setNome, setCognome, setUsername, setData } = useAuth();
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [flagPassword, setFlagPassword] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setEmail('');
        setPassword('');
    }
    const toggleFlagPassword = () => {
        setFlagPassword(!flagPassword);
        setEmail('');
        setPassword('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInUser(email, password);
            console.log('Login effettuato con successo');
            setAuthenticated(true);
            const user = await getUser(email);
            console.log(user);
            setNome(user.nome);
            setCognome(user.cognome);
            setUsername(user.username);
            setData(user.data_nascita);
            setEmail(user.id);
            window.location.href = '/library/home';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Errore durante il login');
            togglePopup();
        }
    };

    const forgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await resetPassword(email);
            console.log('Email inviata con successo');
            toggleFlagPassword();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.log('Errore nel mandare l\'email');
        }
    }

    return (
        <>
            <div className='login-page'>
                <img src={image} className='img' />
                <div className='container'>
                    <div className='box'>
                        <h1 style={{ textAlign: 'center' }}>Accedi al tuo account!</h1>
                        <div className='form-container'>
                            <form style={{ width: "80%" }} onSubmit={handleSubmit}>
                                <div className='form'>
                                    <div className='form-group email'>
                                        <i className='fas fa-envelope-o'></i>
                                        <label htmlFor="email"> Email:
                                            <input type="email" id="email" value={email} autoComplete="current-email" required onChange={(e) => setEmail(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group password'>
                                        <i className='fas fa-lock'></i>
                                        <label htmlFor="password"> Password:
                                            <input type="password" id="password" value={password} autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
                                        </label>
                                    </div>
                                </div>
                                <div className="forgot-password">
                                    <a onClick={toggleFlagPassword}>Hai dimenticato la password?</a>
                                </div>
                                <button type='submit'>Accedi</button>
                            </form>
                            <div className="register">
                                <p>Non hai un account? <a href="/library/register" style={{ color: "#3FB6FF", fontWeight: "bold" }}>Registrati</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1>Errore durante l'accesso</h1>
                        <p>Email o/e password sbagliate</p>
                        <button onClick={togglePopup}>Chiudi</button>
                    </div>
                </div>
            )}
            {flagPassword && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1>Recupero password</h1>
                        <form onSubmit={forgotPassword}>
                            <div className='form-group email'>
                                <i className='fas fa-envelope-o'></i>
                                <label htmlFor="email"> Email:
                                    <input type="email" id="email" value={email} autoComplete="current-email" required onChange={(e) => setEmail(e.target.value)} />
                                </label>
                            </div>
                            <button type='submit'>Invia</button>
                        </form>
                        <a style={{paddingTop: "10px", width: "40%", textAlign: "end"}} onClick={toggleFlagPassword}>chiudi</a>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login;