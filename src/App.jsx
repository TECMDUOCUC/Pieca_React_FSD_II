import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/Product";
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/blog" element={<Blogs/>}/>
        <Route path="/catalog" element={<Catalog/>}/>
        <Route path="/product" element={<ProductDetail/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
