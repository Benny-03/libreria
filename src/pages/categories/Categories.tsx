import '../../css/homepage.css';
import Sidebar from '../../Sidebar';
import { useAuth } from '../../state';
import AddCat from './AddCat';
import DeleteCat from './DeleteCat';

function Categories() {
    const { category, books } = useAuth();

    return (
        <div className='home-page'>
            <Sidebar />
            <div className='site-content'>
                <h1>Categorie</h1>
                <div className='add-book'>
                    <AddCat />
                </div>
                <div className='table'>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Libri associati</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {category.map((cat, index) => {
                                if (!cat.categoria) {
                                    return null;
                                }

                                return (
                                    <tr key={index}>
                                        <td>{cat.categoria}</td>
                                        <td>{books.map((book) => {
                                            if (book.categoria === cat.categoria) {
                                                return (
                                                    <span key={book.id}>
                                                        {book.titolo}, <br />
                                                    </span>
                                                )
                                            }
                                            return null;
                                        })}</td>
                                        <td className='box-btn'>
                                            <DeleteCat category={cat.categoria} />
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

export default Categories;
