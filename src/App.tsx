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
import RegistroMaestro from "./TSX/RegistroMast";
import LoginMaestro from "./TSX/Formulario-Mast";
import PaginaPrinMast from "./TSX/Pagina-Principal-Mast";
import PerfilMaestro from "./TSX/PerfilMast";
import PaginaGruposMaestro from "./TSX/Pagina-Grupos-Mast";
import RecuperarContraseñaAlumno from "./TSX/Recuperar-ContraseñaAlum";
import RecuperarContraseñaMaestro from "./TSX/Recuperar-ContraseñaMast"; // Asegúrate de tener este archivo creado
import PaginaJuegosMast from "./TSX/Pagina-JuegosMast";
import JuegosAgilidadMst from "./TSX/Seccion_AgilidadMaster";
import JuegosConcentracionMst from "./TSX/Seccion_ConcentracionMaster";
import JuegosMemoriaMst from "./TSX/Seccion_MemoriaMaster"; // Asegúrate de tener este archivo creado
import OperadorMisterioso from "./TSX/OperadorMate";
import SecuenciaColores from "./TSX/Secuencia-Colores";
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
        <Route path="/RegistroMast" element={<RegistroMaestro />} /> 
        <Route path="/Formulario-Mast" element={<LoginMaestro />} /> {/* Ruta para el formulario de maestro */}
        <Route path="/Pagina-Principal-Mast" element={<PaginaPrinMast />} /> {/* Ruta para la página principal del maestro */}
        <Route path="/PerfilMaestro" element={<PerfilMaestro />} /> {/* Ruta para el perfil del maestro */}
        <Route path="/Pagina-Grupos-Mast" element={<PaginaGruposMaestro />} /> {/* Ruta para la página de grupos del maestro */}
        <Route path="/Recuperar-ContraseñaAlum" element={<RecuperarContraseñaAlumno />} /> {/* Ruta para recuperar contraseña del alumno */}
        <Route path="/Recuperar-ContraseñaMast" element={<RecuperarContraseñaMaestro />} /> {/* Ruta para recuperar contraseña del maestro */}
        <Route path="/Pagina-JuegosMast" element={<PaginaJuegosMast />} /> {/* Ruta para la página de juegos del maestro */}
        <Route path="/Seccion_AgilidadMaster" element={<JuegosAgilidadMst />} /> {/* Ruta para la sección de agilidad del maestro */}
        <Route path="/Seccion_ConcentracionMaster" element={<JuegosConcentracionMst />} /> {/* Ruta para la sección de concentración del maestro */}
        <Route path="/Seccion_MemoriaMaster" element={<JuegosMemoriaMst />} /> {/* Ruta para la sección de memoria del maestro */}
        <Route path="/OperadorMate" element={<OperadorMisterioso />} /> {/* Ruta para el juego de operador misterioso */}
        <Route path="/Secuencia-Colores" element={<SecuenciaColores />} /> {/* Ruta para el juego de secuencia de colores */}
        {/* Puedes agregar más rutas aquí según sea necesario */}
      </Routes>
    </Router>
  );
}


export default App;

