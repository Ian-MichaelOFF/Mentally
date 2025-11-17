import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Pagina-Juegos.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import logoconcentracion from "/logos/rana.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";


const PaginaJuegos: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar3">
        <div className="logos2">
          <span className="logos-text2">MENTALLY</span>
          <img src={logoCerebro} alt="Logo2" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos2">
        <h1>QUE JUGARAS HOY??</h1>
        <div className="BJuegos">
          <button
            className="btn-juegos1"
            type="button"
            onClick={() => navigate("/Seccion_Memoria")}
          >
            Memoria
            <img src={logomemoria} alt="Logo Memoria" />
          </button>
          <button
            className="btn-juegos2"
            type="button"
            onClick={() => navigate("/Seccion_Concentracion")}
          >
            Concentracion
            <img src={logoconcentracion} alt="Logo concentracion" />
          </button>
          <button
            className="btn-juegos3"
            type="button"
            onClick={() => navigate("/Seccion_AgilidadM")}
          >
            Agilidad Mental
            <img src={logoagilidad} alt="Logo agilidad" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaJuegos;
