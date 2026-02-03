import { GetDocument, UpdateSingleValue } from "../../Firebase";
import { useAuth } from "../../state";
import { useEffect, useState } from "react";

function FavouriteBook({ id }: { id: string }) {
    const { setBooks } = useAuth();
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            const docData = await GetDocument("books", id);

            if (docData && typeof docData.preferito === "boolean") {
                setIsFavourite(docData.preferito);
            }
        };

        fetchDocument();
    }, [id]);

    const toggleFavourite = async () => {
        const newValue = !isFavourite;
        await UpdateSingleValue(parseInt(id), "preferito", newValue);
        setBooks(prevBooks => prevBooks.map(book => book.id === parseInt(id) ? { ...book, preferito: newValue } : book ));
        setIsFavourite(newValue);
    };

    return (
        <button className="favourite-btn" onClick={toggleFavourite}>
            <i className={isFavourite ? "fas fa-heart" : "fas fa-heart-o"} />
        </button>
    );
}

export default FavouriteBook;