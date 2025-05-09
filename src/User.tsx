import Sidebar from './Sidebar';
import './css/user.css';

function User () {
    return (
        <div className='home-page'>
            <Sidebar />
            <div className='site-content'>
                <h1>Profilo personale</h1>
            </div>
        </div>
    )
}

export default User;