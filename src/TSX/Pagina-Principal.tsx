import React, { useState } from "react";
import Sidebar from "../TSX/sidebar"; // Importa la sidebar
import "../CSS/Pag-principal.css";
import logoCerebro from "../logos/cerebro.png";

const PaginaPrincipal: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar2">
        <div className="logos">
          <span className="logos-text">MENTALLY</span>
          <img src={logoCerebro} alt="Logo" />
        </div>

      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}

      {/* Contenido principal */}
      <main>
        <h1>Bienvenido a la Página Principal</h1>
        <p>Este es el contenido de la página principal.</p>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
