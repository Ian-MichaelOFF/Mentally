import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Pagina-Juegos.css";
import logoCerebro from "../logos/cerebro.png";
import logomemoria from "../logos/memoria.png";
import logoconcentracion from "../logos/rana.png";
import logoagilidad from "../logos/cartoon-capybara.png";

const PaginaJuegos: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}

      {/* Contenido principal */}
      <div className="Cuerpos2">
        
        <h1>QUE JUGARAS HOY??</h1>
        <div className="BJuegos">
          <button className="btn-juegos1">Memoria <img src={logomemoria}/></button>
          <button className="btn-juegos2">Concentracion <img src={logoconcentracion}/></button>
          <button className="btn-juegos3">Agilidad Mental <img src={logoagilidad}/></button>
        </div>
      </div>
    </div>
  );
};

export default PaginaJuegos;
