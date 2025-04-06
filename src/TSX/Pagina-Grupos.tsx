import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/PaginaGrupos.css";
import logoCerebro from "/logos/cerebro.png"; // Asegúrate de que la ruta sea correcta
import Medallas from "./Medallas";
import UnirseGrupoModal from "./Grupo";



const PaginaGrupos: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMedallasOpen, setIsMedallasOpen] = useState(false);
  const [showVentana, setShowVentana] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleMedallas = () => {
    setIsMedallasOpen(!isMedallasOpen);
  };
  

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar4">
        <div className="logos3">
          <span className="logos-text3">MENTALLY</span>
          <img src={logoCerebro} alt="Logo3" />
          </div>
          <div className="botonesGrupos">
          <button 
        className="btn-grupo1" 
        onClick={() => setShowVentana(true)}
      >
        UNIRSE A UN GRUPO
      </button>
      {showVentana && (
        <UnirseGrupoModal onClose={() => setShowVentana(false)} />
      )}

        </div>
        

      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
      <Medallas isOpen={isMedallasOpen} toggleMedallas={toggleMedallas} />
      {/* Contenido principal */}
      <div className="Cuerpo3">
        
        <h1>Grupos:(0)</h1>
        </div>
      </div>
  );
};

export default PaginaGrupos;
