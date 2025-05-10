import React, { useState } from "react";
import Sidebar from "../TSX/sidebarmast"; // Importa la sidebar
import "../CSS/Pagina-JuegosM.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import logoconcentracion from "/logos/rana.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";
import Medallas from "../TSX/Medallas";

const PaginaJuegosMast: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar3M">
        <div className="logos2M">
          <span className="logos-text2M">MENTALLY</span>
          <img src={logoCerebro} alt="Logo2M" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos2M">
        <h1>QUE JUGARAS HOY??</h1>
        <div className="BJuegosM">
          <button
            className="btn-juegos1M"
            type="button"
            onClick={() => navigate("/Seccion_MemoriaMaster")}
          >
            Memoria
            <img src={logomemoria} alt="Logo Memoria" />
          </button>
          <button
            className="btn-juegos2M"
            type="button"
            onClick={() => navigate("/Seccion_ConcentracionMaster")}
          >
            Concentracion
            <img src={logoconcentracion} alt="Logo concentracion" />
          </button>
          <button
            className="btn-juegos3M"
            type="button"
            onClick={() => navigate("/Seccion_AgilidadMaster")}
          >
            Agilidad Mental
            <img src={logoagilidad} alt="Logo agilidad" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaJuegosMast;
