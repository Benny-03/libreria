import { UpdateSingleValue } from "../../Firebase";
import { useAuth } from "../../state";

function FavouriteBook( {id, preferito}: {id: number, preferito: boolean} ) {
    const { setBooks } = useAuth();

    const toggleFavourite = async () => {
        const newValue = !preferito;
        await UpdateSingleValue(id, "preferito", newValue);

        setBooks(prev => prev.map(book => book.id === id ? { ...book, preferito: newValue } : book )
        );
    };

    return (
        <button className="favourite-btn" onClick={toggleFavourite}>
            <i className={preferito ? "fas fa-heart" : "fas fa-heart-o"} />
        </button>
    );
}

export default FavouriteBook;