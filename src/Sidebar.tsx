import './css/sidebar.css';
import image from './images/caffe.png';
import { useAuth } from './state';

function Sidebar() {
    const { nome, cognome, username } = useAuth();

    return (
        <div className="sidebar">
            <h2 style={{color: "var(--dark-blue)", fontWeight: "800", marginTop: "0"}}>LIBRERIA</h2>
            <a className='utente' href='/library/utente'>
                <img src={image} className='img'/>
                <div className='utente-info'>
                    <h4 style={{textTransform: "capitalize"}}>{username}</h4>
                    <p style={{textTransform: "capitalize"}}>{nome} {cognome}</p>
                </div>
            </a>
            <div className='nav-link'>
                <a className='link libreria' href='/library/home'>
                    <i className='fas fa-bookmark-o'></i>
                    <p>Libri</p>
                </a>
                <a className='link categorie' href='/library/categories'>
                    <i className='fas fa-tags'></i>
                    <p>Categorie</p>
                </a>
            </div>
        </div>
    );
}

export default Sidebar;