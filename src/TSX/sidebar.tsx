import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "../CSS/sidebar.css"; // Asegúrate de que el CSS esté bien enlazado

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); // Utiliza el hook useNavigate para redirigir al usuario

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/logout");
      if (response.data.message === "Sesión cerrada exitosamente") {
        alert("Has cerrado sesión exitosamente");
        navigate("/FormularioAlum"); // Redirige al login después de cerrar sesión
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      alert("Ocurrió un error al cerrar sesión. Intenta nuevamente.");
    }
  };
  const handleNavigateToInicio = () => {
    navigate("/Pagina-Principal"); // Redirige a la página Principal
  };
  const handleNavigateToGrupos = () => {
    navigate("/Pagina-Grupos"); // Redirige a la página de Grupos
  };
  const handleNavigateToPerfil = () => {
    navigate("/Perfil"); // Redirige a la página de Grupos
  };
  const handleNavigateToMedallas = () => {
    navigate("/Medallas"); // Redirige a la página de Grupos
  };

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
            <a href="#" onClick={handleNavigateToPerfil}>
              Perfil
            </a>
          </li>
          <li>
            <a href="#" onClick={handleNavigateToGrupos}>
              Grupos
            </a>
          </li>
          <li>
            <a href="#" onClick={handleNavigateToInicio}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#" onClick={handleNavigateToMedallas}>
              Medallas
            </a>{" "}
            {/* Enlaza al hacer clic */}
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              Salir
            </a>{" "}
            {/* Llama a handleLogout al hacer clic */}
          </li>
        </ul>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto */}
      {isOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
