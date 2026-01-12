import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import TabelaKursowa from "./pages/TabelaKursowa";
import CenaZlota from "./pages/CenaZlota";
import Autor from "./pages/Autor";
import SzczegolyWaluty from "./pages/SzczegolyWaluty";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/tabela-kursowa" element={<TabelaKursowa />} />
        <Route path="/cena-zlota" element={<CenaZlota />} />
        <Route path="/autor" element={<Autor />} />
        <Route path="/tabela-kursowa/:waluta" element={<SzczegolyWaluty />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
