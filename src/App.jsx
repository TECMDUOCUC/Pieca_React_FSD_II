import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";
import Blogs from "./pages/Blogs";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index/>} />
        <Route path="/blog" element={<Blogs/>}/>
      </Routes>
    </BrowserRouter>
  );
}
