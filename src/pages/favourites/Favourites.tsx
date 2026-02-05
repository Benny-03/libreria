import Sidebar from "../sidebar/Sidebar";
import { useState } from "react";
import { useAuth } from "../../state";
import FavouriteBook from "./FavouriteBook";

const Favourites = () => {
    const { books } = useAuth();
    const [search, setSearch] = useState('');

    const filteredBooks = books.filter(book => {
        if (!book.id || !book.autori) return false;

        const q = search.toLowerCase();

        return (
            book.titolo?.toLowerCase().includes(q) ||
            book.categoria?.toLowerCase().includes(q) ||
            book.casa_editrice?.toLowerCase().includes(q) ||
            book.id.toString().includes(q) ||
            book.anno_pubblicazione.toString().includes(q) ||
            book.autori.some(autore =>
                autore.toLowerCase().includes(q)
            )
        );
    });

    return (
        <div className='home-page favourites'>
            <Sidebar />
            <div className='site-content'>
                <h1>Preferiti</h1>
                <div className='add-book'>
                    <div style={{display:'flex', gap:'10px', width:'32%'}}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Cerca per titolo, autore, ISBN, editore o anno"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Titolo</th>
                                <th>Autori</th>
                                <th>Casa editrice</th>
                                <th>Anno di pubblicazione</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => {
                                if (!book.id || !book.autori || !book.preferito) return null;

                                return (
                                    <tr key={book.id}>
                                        <td>{book.id}</td>
                                        <td>{book.titolo}</td>
                                        <td>{book.autori.map((autore: string) => {
                                            return (
                                                <span key={autore}>
                                                    {autore}, <br />
                                                </span>
                                            )
                                        })}</td>
                                        <td>{book.casa_editrice}</td>
                                        <td>{book.anno_pubblicazione}</td>
                                        <td><FavouriteBook id={book.id} preferito={book.preferito} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Favourites;