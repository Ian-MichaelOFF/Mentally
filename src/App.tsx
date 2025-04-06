import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaginaPrincipal from "./TSX/Pagina-Principal";
import PaginaInicio from "./TSX/Pagina-Inicio";
import FormularioAlum from "./TSX/formulario-alum"; // Asegúrate de tener este archivo creado
import PaginaJuegos from "./TSX/Pagina-Juegos";  
import PaginaGrupos from "./TSX/Pagina-Grupos";
import RegistroAlumno from "./TSX/RegistroAlum";
import Memorama from "./TSX/Memorama";
import JuegosMemoria from "./TSX/Seccion_Memoria";
import JuegosConcentracion from "./TSX/Seccion_Concentracion";
import JuegosAgilidad from "./TSX/Seccion_AgilidadM";
import Anagrama from "./TSX/Anagrama";
import FrutasMatematicas from "./TSX/Frutas_Mat";
import PerfilAlumno from "./TSX/Perfil";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
        <Route path="/Pagina-Principal" element={<PaginaPrincipal />} />
        <Route path="/FormularioAlum" element={<FormularioAlum />} />
        <Route path="/Pagina-Juegos" element={<PaginaJuegos />} />
        <Route path="/Pagina-Grupos" element={<PaginaGrupos />} />
        <Route path="/RegistroAlum" element={<RegistroAlumno />} />
        <Route path="/Memorama" element={<Memorama />} />
        <Route path="/Seccion_Memoria" element={<JuegosMemoria />} />
        <Route path="/Seccion_Concentracion" element={<JuegosConcentracion />} />
        <Route path="/Seccion_AgilidadM" element={<JuegosAgilidad />} />
        <Route path="/Anagrama" element={<Anagrama />} />
        <Route path="/Frutas_Mat" element={<FrutasMatematicas />} />
        <Route path="/Perfil" element={<PerfilAlumno />} /> {/* Ruta para el perfil */}
      </Routes>
    </Router>
  );
}


export default App;

