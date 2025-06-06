import './css/sidebar.css';
import image from './images/libri.png';
import { useAuth } from './state';

function Sidebar() {
    const { nome, cognome, username } = useAuth();

    return (
        <div className="sidebar">
            <h2 style={{color: "var(--dark-blue)", fontWeight: "800", marginTop: "0"}}>LIBRERIA</h2>
            <a className='utente' href='/library/user'>
                {/* <img src={image} className='img'/> */}
                <div className='iniziale'>{nome.charAt(0)}</div>
                <div className='utente-info'>
                    <h4 style={{textTransform: "capitalize"}}>{username}</h4>
                    <p style={{textTransform: "capitalize"}}>{nome} {cognome}</p>
                </div>
            </a>
            <div className='line'></div>
            <div className='nav-link'>
                <a className='link libreria' href='/library/home'>
                    <i className='fas fa-bookmark-o'></i>
                    <p style={{fontSize: "18px"}}>Libri</p>
                </a>
                <a className='link categorie' href='/library/categories'>
                    <i className='fas fa-tags'></i>
                    <p style={{fontSize: "18px"}}>Categorie</p>
                </a>
            </div>
        </div>
    );
}

export default Sidebar;