import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaginaPrincipal from "./TSX/Pagina-Principal";
import PaginaInicio from "./TSX/Pagina-Inicio";
import FormularioAlum from "./TSX/formulario-alum"; // Asegúrate de tener este archivo creado
import PaginaJuegos from "./TSX/Pagina-Juegos";  
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/PaginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/FormularioAlum" element={<FormularioAlum />} />
        <Route path="/Pagina-Juegos" element={<PaginaJuegos />} />
      </Routes>
    </Router>
  );
}


export default App;

