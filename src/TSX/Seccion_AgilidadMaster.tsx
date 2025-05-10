import React, { useState } from "react";
import Sidebar from "../TSX/sidebarmast"; // Importa la sidebar
import "../CSS/Seccion_AgilidadMst.css";
import logoCerebro from "/logos/cerebro.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

const JuegosAgilidadMst: React.FC = () => {
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
      <nav className="navbar6M">
        <div className="logos6M">
          <span className="logos-text6M">MENTALLY</span>
          <img src={logoCerebro} alt="Logo6M" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpos6M">
        <button
          onClick={goBack}
          className="back-buttonMemoryMst"
          aria-label="Regresar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Bienvenido a la seccion de Agilidad Mental!</h1>
        <div className="JuegosAgilidadM">
          <button
            className="btn-Agilidad1M"
            type="button"
            onClick={handleClick}
          >
            Operaciones <b /> Frutales
            <img src={logoagilidad} alt="Logo AgiidadM" />
          </button>
          <button
            className="btn-Agilidad2M"
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

export default JuegosAgilidadMst;
