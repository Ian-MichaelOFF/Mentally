import React, { useState } from "react";
import Sidebar from "../TSX/sidebarmast"; // Importa la sidebar
import "../CSS/Seccion_MemoriaMst.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const JuegosMemoriaMst: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = () => {
    navigate("/Memorama");
    navigate(0); // Esto fuerza una recarga
  };
  const handleClick2 = () => {
    navigate("/Secuencia-Colores");
    navigate(0); // Esto fuerza una recarga
  };
  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar4M">
        <div className="logos4M">
          <span className="logos-text4M">MENTALLY</span>
          <img src={logoCerebro} alt="Logo4M" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos4M">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Bienvenido a la seccion Memoria!</h1>
        <div className="JuegosMemoriaM">
          <button className="btn-Memoria1M" type="button" onClick={handleClick}>
            Memorama <img src={logomemoria} />
          </button>
          <button
            className="btn-Memoria2M"
            type="button"
            onClick={handleClick2}
          >
            Secuencia Colores <img src={logomemoria} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegosMemoriaMst;
