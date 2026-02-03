import { logoutUser } from '../../Firebase';

function LogoutButton() {
    const logout = async () => {
        try {
            await logoutUser();
            console.log("Logout effettuato con successo");
            window.location.href = '/';
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    }

    return (
        <>
            <button className="classic logout"  onClick={logout}>Logout</button>
        </>
    )
}

export default LogoutButton;