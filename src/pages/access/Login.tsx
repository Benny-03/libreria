import '../../css/login-register.css';
import { signInUser, resetPassword, getUser } from '../../Firebase';
import { useState } from 'react';
import image from '../../images/login-image.jpg';
import { useAuth } from '../../state';
import { isFirebaseError } from '../../Firebase';
import { useNavigate } from 'react-router';

const Login = () => {
    const { email, setEmail, message, setMessage} = useAuth();
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [flagPassword, setFlagPassword] = useState(false);
    const navigate = useNavigate();

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
            const signInResponse = await signInUser(email, password);
            localStorage.setItem('token', signInResponse.accessToken);
            const user = await getUser(email);
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Login effettuato con successo');
            navigate('/library/home');
        } catch (error) {
            if (isFirebaseError(error)) {
                if (error.code === 'auth/invalid-credential') {
                    setMessage("Credenziali non valide");
                } else {
                    setMessage("Errore Firebase");
                }
            } else {
                setMessage("Errore sconosciuto");
            }
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
        <div className='root-login-page'>
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
                                            <input type="email" id="email" autoComplete="current-email" required onChange={(e) => setEmail(e.target.value)} />
                                        </label>
                                    </div>
                                    <div className='form-group password'>
                                        <i className='fas fa-lock'></i>
                                        <label htmlFor="password"> Password:
                                            <input type="password" id="password" autoComplete="current-password" required onChange={(e) => setPassword(e.target.value)} />
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
                        <h1 style={{textAlign: "center"}}>Errore durante l'accesso</h1>
                        <p style={{textAlign: "center"}}>{message}</p>
                        <button onClick={togglePopup}>Chiudi</button>
                    </div>
                </div>
            )}
            {flagPassword && (
                <div className='box-popup'>
                    <div className='popup'>
                        <h1 style={{textAlign: "center"}}>Recupero password</h1>
                        <form onSubmit={forgotPassword}>
                            <div className='form-group email'>
                                <i className='fas fa-envelope-o'></i>
                                <label htmlFor="email"> Email:
                                    <input type="email" id="email" value={email} autoComplete="current-email" required onChange={(e) => setEmail(e.target.value)} />
                                </label>
                            </div>
                            <button type='submit'>Invia</button>
                        </form>
                        <a style={{ paddingTop: "10px", width: "40%", textAlign: "end" }} onClick={toggleFlagPassword}>chiudi</a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;