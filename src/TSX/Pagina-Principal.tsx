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
    <div>
      {/* Navbar */}
      <nav className="navbar2">
        <div className="logos">
          <span className="logos-text">MENTALLY</span>
          <img src={logoCerebro} alt="Logo" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpo">
        <h1>REGRESA A TUS JUEGOS!</h1>
        <div className="BotonJuegos">
          <button
            className="btn-juego1"
            type="button"
            onClick={() => navigate("/Seccion_Memoria")}
          >
            Memoria
            <img src={logomemoria} alt="Logo Memoria" />
          </button>
          <button
            className="btn-juego2"
            type="button"
            onClick={() => navigate("/Seccion_Concentracion")}
          >
            Concentracion
            <img src={logoconcentracion} alt="Logo Memoria" />
          </button>
          <button
            className="btn-juego3"
            type="button"
            onClick={() => navigate("/Seccion_AgilidadM")}
          >
            Agilidad Mental
            <img src={logoagilidad} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipal;
