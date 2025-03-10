import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaginaPrincipal from "./TSX/Pagina-Principal";
import PaginaInicio from "./TSX/Pagina-Inicio";
import FormularioAlum from "./formalum/formulario-alum"; // Asegúrate de tener este archivo creado

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/PaginaPrincipal" element={<PaginaPrincipal />} />
        <Route path="/FormularioAlum" element={<FormularioAlum />} />
      </Routes>
    </Router>
  );
}


export default App;

