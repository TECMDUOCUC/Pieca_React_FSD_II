import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/Product";
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/blog" element={<Blogs/>}/>
        <Route path="/catalog" element={<Catalog/>}/>
        <Route path="/product" element={<ProductDetail/>}/>
      </Routes>
    </BrowserRouter>
  );
}
