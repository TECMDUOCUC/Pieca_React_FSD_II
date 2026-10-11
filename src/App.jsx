import { BrowserRouter, Routes, Route } from "react-router";
import Index from "./pages/Index";

export default function App() {
  return (
    <BrowserRouter basename="/Pieca_React_FSD_II">
      <Routes>
        <Route path="/" element={<Index/>} />
      </Routes>
    </BrowserRouter>
  );
}
