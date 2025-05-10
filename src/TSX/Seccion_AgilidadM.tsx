import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Seccion_AgilidadM.css";
import logoCerebro from "/logos/cerebro.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const JuegosAgilidad: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = () => {
    navigate("/Frutas_Mat");
    navigate(0); // Esto fuerza una recarga
  };
  const handleClick2 = () => {
    navigate("/OperadorMate");
    navigate(0); // Esto fuerza una recarga
  };
  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar6">
        <div className="logos6">
          <span className="logos-text6">MENTALLY</span>
          <img src={logoCerebro} alt="Logo6" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos6">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Bienvenido a la seccion de Agilidad Mental!</h1>
        <div className="JuegosAgilidad">
          <button className="btn-Agilidad1" type="button" onClick={handleClick}>
            Operaciones <b /> Frutales
            <img src={logoagilidad} alt="Logo Agiidad" />
          </button>
          <button
            className="btn-Agilidad2"
            type="button"
            onClick={handleClick2}
          >
            Operador Misterioso <img src={logoagilidad} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuegosAgilidad;
