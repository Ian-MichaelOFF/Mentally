import React, { useState } from "react";
import Sidebar from "../TSX/sidebarmast"; // Importa la sidebar
import "../CSS/Seccion_ConcentracionMst.css";
import logoCerebro from "/logos/cerebro.png";
import logoconcentracion from "/logos/rana.png";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const JuegosConcentracionMst: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Anagrama");
    navigate(0); // Esto fuerza una recarga
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar5M">
        <div className="logos5M">
          <span className="logos-text5M">MENTALLY</span>
          <img src={logoCerebro} alt="Logo5M" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos5M">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Bienvenido a la seccion Concentracion!</h1>
        <div className="JuegosConcentracionM">
          <button
            className="btn-Concentracion1M"
            type="button"
            onClick={handleClick}
          >
            Anagramas <img src={logoconcentracion} />
          </button>
          <button className="btn-Concentracion2M">
            Juego 2 <img src={logoconcentracion} />
          </button>
          <button className="btn-Concentracion3M">
            Juego 3 <img src={logoconcentracion} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegosConcentracionMst;
