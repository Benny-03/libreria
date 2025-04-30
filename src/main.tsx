import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './css/index.css'
import HomePage from './HomePage'
import Login from './Login'
import Register from './Register'
import Categories from './Categories'

const root = createRoot(document.getElementById('root') as HTMLElement);

const router = createBrowserRouter([
  {
    path: "/library/",
    element: <Login />,
  },
  {
    path: "/library/register/",
    element: <Register />,
  },
  {
    path: "/library/home/",
    element: <HomePage />,
  },
  {
    path: "/library/categories/",
    element: <Categories />,
  }
])


root.render(
    <>
      <header>
        <h1>Libreria</h1>
      </header>
      <main className='app-container'>
        <RouterProvider router={router} />
      </main>
    </>
)