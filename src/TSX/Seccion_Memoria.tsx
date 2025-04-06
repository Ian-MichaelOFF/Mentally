import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Seccion_Memoria.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import { useNavigate } from "react-router-dom";
import Medallas from "./Medallas";


const JuegosMemoria: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMedallasOpen, setIsMedallasOpen] = useState(false);


  const navigate = useNavigate();



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleMedallas = () => {
    setIsMedallasOpen(!isMedallasOpen);
  };
  const handleClick = () => {
    navigate("/Memorama");
    navigate(0); // Esto fuerza una recarga
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar4">
        <div className="logos4">
          <span className="logos-text4">MENTALLY</span>
          <img src={logoCerebro} alt="Logo4" />
        </div>

      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
      <Medallas isOpen={isMedallasOpen} toggleMedallas={toggleMedallas} />

      {/* Contenido principal */}
      <div className="Cuerpos4">
        
        <h1>Bienvenido a la seccion Memoria!</h1>
        <div className="JuegosMemoria">
        <button className="btn-Memoria1" type="button" onClick={handleClick}>
          Memorama <img src={logomemoria}/>
          </button>
          <button className="btn-Memoria2">Colores <img src={logomemoria}/></button>
          <button className="btn-Memoria3">Juego 3 <img src={logomemoria}/></button>
        </div>
      </div>
    </div>
  );
};

export default JuegosMemoria;
