import { BrowserRouter, Routes, Route, Link } from 'react-router';
import Index from './pages/Index';
import Blogs from './pages/Blogs';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Receipt from './pages/Receipt';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import RequireRole from './components/RequireRole';

function NotFound() {
  return (
    <div className="page-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <h1>404</h1>
        <p>Esta página no existe.</p>
        <Link className="btn btn-light" to="/">Volver al Inicio</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<RequireRole><Cart /></RequireRole>} />
        <Route path="/orders" element={<RequireRole><MyOrders /></RequireRole>} />
        <Route path="/receipt/:id" element={<RequireRole><Receipt /></RequireRole>} />
        <Route path="/admin" element={
          <RequireRole roles={['ROLE_ADMIN', 'ROLE_SELLER']}><Admin /></RequireRole>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}