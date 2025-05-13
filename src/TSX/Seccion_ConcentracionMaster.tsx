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
  const handleClick2 = () => {
    navigate("/SopaLetras");
    navigate(0); // Esto fuerza una recarga
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };
  return (
    <div className="seccion-concentracion">
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="cuerpo-concentracion">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Concentracion</h1>
        <div className="JuegosConcentracionM">
          <button
            className="btn-Concentracion1M"
            type="button"
            onClick={handleClick}
          >
            Anagramas 
          </button>
          <button className="btn-Concentracion2M"
            type="button"
            onClick={handleClick2}>
            Sopa de Letras
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegosConcentracionMst;
