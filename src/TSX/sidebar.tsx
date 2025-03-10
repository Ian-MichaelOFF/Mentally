import React from "react";
import "../CSS/sidebar.css"; // Asegúrate que el CSS esté bien enlazado

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Botón de abrir/cerrar */}
      <button onClick={toggleSidebar} className="toggle-btn2">
        {isOpen ? " ☰ " : " ☰ "}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>


        <ul>
          <li>
            <a href="#">Perfil</a>
          </li>
          <li>
            <a href="#">Juegos</a>
          </li>
          <li>
            <a href="#">Configuración</a>
          </li>
          <li>
            <a href="#">Salir</a>
          </li>
        </ul>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto */}
      {isOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
