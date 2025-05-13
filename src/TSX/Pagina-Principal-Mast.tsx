import React, { useState } from "react";
import "../CSS/Pag-PrincipalM.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import logoconcentracion from "/logos/rana.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";
import SidebarM from "../TSX/sidebarmast";

const PaginaPrinMast: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  return (
    <div className="pagina_inicio_maestro">
      {/* Navbar */}
      <nav className="navbarra">  
        <div className="logomentally">
          <img src="logos/mascota2.png" alt="Logo" />
          MENTALLY
        </div>
        <div className="letrero_maestro">MAESTRO
        </div>
      </nav>

      {/* Sidebar */}
      <SidebarM isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="cuerpo_maestro">
        
        <h1>¿Qué jugarás hoy?</h1>
        <div className="BotonJuegos">
        <button className="boton_memoria" type="button" onClick={() => navigate("/Seccion_MemoriaMaster")}>
            Memoria
          </button>
          <button className="boton_concentracion" type="button" onClick={() => navigate("/Seccion_ConcentracionMaster")}>
            Concentracion
          </button>
          <button className="boton_agilidad" type="button" onClick={()=> navigate("/Seccion_AgilidadMaster")}>
            Lógica Matemática 
            </button>
        </div>
        <div className="BotonMiscelaneos">
        <button className="boton_grupos" type="button" onClick={() => navigate("/Pagina-Grupos-Mast")}>
            Grupos
            <img src="logos/grupov1.png" alt="Icono_boton" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrinMast;
