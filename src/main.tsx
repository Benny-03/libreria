import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router'
import './css/index.css'
import HomePage from './pages/homepage/HomePage'
import Login from './pages/access/Login'
import Register from './pages/access/Register'
import Categories from './pages/categories/Categories'
import { AuthProvider } from './state'
import User from './pages/user/User'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='/library' element={<Login />} />
        <Route path='/library/register/' element={<Register />} />
        <Route path='/library/home/' element={<HomePage />} />
        <Route path='/library/categories/' element={<Categories />} />
        <Route path='/library/user/' element={<User />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)