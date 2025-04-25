import React, { useState } from "react";
import "../CSS/Pag-PrincipalM.css";
import logoCerebro from "/logos/cerebro.png";
import logomemoria from "/logos/memoria.png";
import logoconcentracion from "/logos/rana.png";
import logoagilidad from "/logos/cartoon-capybara.png";
import { useNavigate } from "react-router-dom";
import Medallas from "./Medallas";
import SidebarM from "../TSX/sidebarmast";



const PaginaPrinMast: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMedallasOpen, setIsMedallasOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleMedallas = () => {
    setIsMedallasOpen(!isMedallasOpen);
  };

  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <nav className="navbarMst">
        <div className="logosMst">
          <span className="logos-textMst">MENTALLY</span>
          <img src={logoCerebro} alt="LogoMst" />
        </div>

      </nav>

      {/* Sidebar */}
      <SidebarM isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
      <Medallas isOpen={isMedallasOpen} toggleMedallas={toggleMedallas} />

      {/* Contenido principal */}
      <div className="CuerpoMst">
        
        <h1>!Sigue Tu Racha! &#128293;</h1>
        <div className="BotonJuegosMst">
        <button className="btn-juego1M" type="button" onClick={() => navigate("/Seccion_Memoria")}>
            Memoria
            <img src={logomemoria} alt="Logo Memoria" />
          </button>
          <button className="btn-juego2M" type="button" onClick={() => navigate("/Seccion_Concentracion")}>
            Concentracion
            <img src={logoconcentracion}alt="Logo Memoria" />
          </button>
          <button className="btn-juego3M" type="button" onClick={()=> navigate("/Seccion_AgilidadM")}>
            Agilidad Mental 
            <img src={logoagilidad}/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrinMast;