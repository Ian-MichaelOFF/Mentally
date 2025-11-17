import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Seccion_Concentracion.css";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const JuegosConcentracion: React.FC = () => {
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
      <div className="cuerpo-concentracion">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Concentracion</h1>
        <div className="JuegosConcentracion">
          <button
            className="btn-Concentracion1M"
            type="button"
            onClick={handleClick}
          >
            Anagramas 
          </button>
          <button
            className="btn-Concentracion2M"
            type="button"
            onClick={handleClick2}
          >
            Sopa De Letras
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegosConcentracion;
