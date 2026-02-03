import '../../css/sidebar.css';
import LogoutButton from './LogoutButton';
import { useAuth } from '../../state';

function Sidebar() {
    const { nome, cognome, username } = useAuth();

    return (
        <>
        <div className="sidebar desktop-only">
            <div>
                <h2 style={{color: "var(--dark-blue)", fontWeight: "800", marginTop: "0"}}>LIBRERIA</h2>
                <div className='utente'>
                    <div className='iniziale'>{nome.charAt(0)}</div>
                        <div className='utente-info'>
                            <h4 style={{textTransform: "capitalize"}}>{username}</h4>
                            <p style={{textTransform: "capitalize"}}>{nome} {cognome}</p>
                        </div>
                    </div>
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
            <LogoutButton />
        </div>
        <div className="sidebar mobile-only" style={{justifyContent: 'space-between', height: 'auto', alignItems: 'center'}}>
            <h2 style={{color: "var(--dark-blue)", fontWeight: "800", marginTop: "0", marginBottom: '0'}}>LIBRERIA</h2>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div className='nav-link' style={{flexDirection: 'row', paddingTop: '0', gap: '10px'}}>
                    <a className='link libreria' href='/library/home'>
                        <i className='fas fa-bookmark-o'></i>
                    </a>
                    <a className='link categorie' href='/library/categories'>
                        <i className='fas fa-tags'></i>
                    </a>
                </div>
                <div className='iniziale'>{nome.charAt(0)}</div>
            </div>
        </div>
        </>
        
    );
}

export default Sidebar;