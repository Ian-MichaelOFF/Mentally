import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import "../CSS/sidebarmast.css"; // Asegúrate de que el CSS esté bien enlazado

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarM: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); // Utiliza el hook useNavigate para redirigir al usuario

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/logout");
      if (response.data.message === "Sesión cerrada exitosamente") {
        alert("Has cerrado sesión exitosamente");
        navigate("/Formulario-Mast"); // Redirige al login después de cerrar sesión
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      alert("Ocurrió un error al cerrar sesión. Intenta nuevamente.");
    }
  };

    const handleNavigateToInicio = () => {
      navigate("/Pagina-Principal-Mast"); // Redirige a la página Principal
    };
    const handleNavigateToGrupos = () => {
      navigate("/Pagina-Grupos-Mast"); // Redirige a la página de Grupos
    };
    const handleNavigateToPerfil = () => {
      navigate("/PerfilMaestro"); // Redirige a la página de Grupos
    };
    

  return (
    <>
      {/* Botón de abrir/cerrar */}
      <button onClick={toggleSidebar} className="toggle-btn3">
        {isOpen ? " ☰ " : " ☰ "}
      </button>

      {/* Sidebar */}
      <div className={`sidebarMast ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="#" onClick={handleNavigateToPerfil}>Perfil</a>
          </li>
          <li>
            <a href="#" onClick={handleNavigateToGrupos}>Grupos</a>
          </li>
          <li>
          <a href="#" onClick={handleNavigateToInicio}>Inicio</a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>Salir</a> {/* Llama a handleLogout al hacer clic */}
          </li>
        </ul>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto */}
      {isOpen && <div className="backdropMast" onClick={toggleSidebar}></div>}
    </>
  );
};

export default SidebarM;
