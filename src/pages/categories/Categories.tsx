import '../../css/homepage.css';
import Sidebar from '../sidebar/Sidebar';
import { useAuth } from '../../state';
import AddCat from './AddCat';
import DeleteDoc from '../homepage/DeleteDoc';
import ModifyDoc from '../homepage/ModifyDoc';
import { useState } from 'react';
import DeleteCat from './DeleteCat';
import FavouriteBook from '../favourites/FavouriteBook';

function Categories() {
    const { category, books } = useAuth();
    const [catSelected, setCatSelected] = useState('');
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
        <div className='home-page categories'>
            <Sidebar />
            <div className='site-content'>
                <h1>Categorie</h1>
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
                    
                    <div style={{gap: '10px', display: 'flex'}}>
                        <select value={catSelected} onChange={(e) => setCatSelected(e.target.value)}>
                            <option value="" disabled selected>Seleziona categoria</option>
                            {category.map((cat, index) => {
                                if (!cat.categoria) {
                                    return null;
                                }
                                return (
                                    <option key={index} value={cat.categoria}>{cat.categoria}</option>
                                );
                            })}
                        </select>
                        <AddCat />
                        <DeleteCat />
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
                            {category.map((cat, index) => {
                                if (!cat.categoria) {
                                    return null;
                                }

                                if (cat.categoria !== catSelected) {
                                    return null;
                                }

                                return (
                                    <>  {filteredBooks.map((book) => {
                                            if (book.categoria === catSelected) {
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
                                                        <td >
                                                            <div className='box-btn'>
                                                                <DeleteDoc id={book.id}/>
                                                                <ModifyDoc book={book}/>
                                                                <FavouriteBook id={book.id} preferito={book.preferito} />
                                                            </div>
                                                            
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                            return null;
                                        })}
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Categories;

