import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Index/>} />
      </Routes>
    </BrowserRouter>
  );
}
