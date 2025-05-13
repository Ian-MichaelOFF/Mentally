import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Pag-principal.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import logoconcentracion from "/logos/rana.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";

const PaginaPrincipal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  return (
    <div className="pagina_inicio_alumno">
      {/* Navbar */}
      <nav className="navbarra">  
        <div className="logomentally">
          <img src="logos/mascota2.png" alt="Logo" />
          MENTALLY
        </div>
        <div className="letrero_alumno">ALUMNO
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="cuerpo_alumno">
        <h1>¿Qué jugarás hoy?</h1>
        <div className="BotonJuegos">
        <button className="boton_memoria" type="button" onClick={() => navigate("/Seccion_Memoria")}>
            Memoria
          </button>
          <button className="boton_concentracion" type="button" onClick={() => navigate("/Seccion_Concentracion")}>
            Concentracion
          </button>
          <button className="boton_agilidad" type="button" onClick={()=> navigate("/Seccion_AgilidadM")}>
            Lógica Matemática 
            </button>
        </div>
        <div className="BotonMiscelaneos">
        <button className="boton_grupos" type="button" onClick={() => navigate("/Pagina-Grupos")}>
            Grupos
            <img src="logos/grupov1.png" alt="Icono_boton" />
          </button>
          <button className="boton_insignias" type="button" onClick={() => navigate("/Medallas")}>
            Medallas
            <img src="logos/medalla.png" alt="Icono_medalla" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
