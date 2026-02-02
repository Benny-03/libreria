import '../../css/homepage.css';
import Sidebar from '../../Sidebar';
import DeleteDoc from './DeleteDoc';
import ModifyDoc from './ModifyDoc';
import AddDoc from './AddDoc';
import { useAuth } from '../../state';
import { useState } from 'react';
import GoogleBooks from '../../GoogleBooks';

function HomePage() {
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
        <div className='home-page'>
            <Sidebar />
            <div className='site-content'>
                <h1>Raccolta libri</h1>
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
                    <div style={{display:'flex', flexDirection: 'row', gap: '10px'}}>
                        <AddDoc />
                        <GoogleBooks />
                    </div>
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Titolo</th>
                                <th>Categoria</th>
                                <th>Autori</th>
                                <th>Casa editrice</th>
                                <th>Anno di pubblicazione</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book, index) => {
                                if (!book.id || !book.autori ) {
                                    return null;
                                }

                                return (
                                    <tr key={index}>
                                        <td>{book.id}</td>
                                        <td>{book.titolo}</td>
                                        <td>{book.categoria}</td>
                                        <td>{book.autori.map((autore: string) => {
                                            return (
                                                <span key={autore}>
                                                    {autore}, <br />
                                                </span>
                                            )
                                        })}</td>
                                        <td>{book.casa_editrice}</td>
                                        <td>{book.anno_pubblicazione}</td>
                                        <td className='box-btn'>
                                            <DeleteDoc id={book.id}/>
                                            <ModifyDoc book={book}/>
                                        </td>
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

export default HomePage;
