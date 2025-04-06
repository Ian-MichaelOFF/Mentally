import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Seccion_Concentracion.css";
import logoCerebro from "/logos/cerebro.png";
import logoconcentracion from "/logos/rana.png";
import { useNavigate } from "react-router-dom";
import Medallas from "./Medallas";


const JuegosConcentracion: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMedallasOpen, setIsMedallasOpen] = useState(false);


  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Anagrama");
    navigate(0); // Esto fuerza una recarga
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleMedallas = () => {
    setIsMedallasOpen(!isMedallasOpen);
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar5">
        <div className="logos5">
          <span className="logos-text5">MENTALLY</span>
          <img src={logoCerebro} alt="Logo5" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
      <Medallas isOpen={isMedallasOpen} toggleMedallas={toggleMedallas} />

      {/* Contenido principal */}
      <div className="Cuerpos5">
        
        <h1>Bienvenido a la seccion Concentracion!</h1>
        <div className="JuegosConcentracion">
        <button className="btn-Concentracion1" type="button" onClick={handleClick}>
          Anagramas <img src={logoconcentracion}/>
          </button>
          <button className="btn-Concentracion2">Juego 2 <img src={logoconcentracion}/></button>
          <button className="btn-Concentracion3">Juego 3 <img src={logoconcentracion}/></button>
        </div>
      </div>
    </div>
  );
};

export default JuegosConcentracion;
