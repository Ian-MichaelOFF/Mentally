import React from "react";
import "../CSS/Pagina-Inicio.css";
import { Link } from 'react-router-dom'; // Asegúrate de tener este archivo en la misma carpeta o actualizar la ruta según tu estructura de proyecto

const HomePage: React.FC = () => {
  return (
    <div className="main-container">
      <div className="logo">
        <div className="logo-text">
          <span style={{ "--i": 1 } as React.CSSProperties}>M</span>
          <span style={{ "--i": 2 } as React.CSSProperties}>E</span>
          <span style={{ "--i": 3 } as React.CSSProperties}>N</span>
          <span style={{ "--i": 4 } as React.CSSProperties}>T</span>
          <span style={{ "--i": 5 } as React.CSSProperties}>A</span>
          <span style={{ "--i": 6 } as React.CSSProperties}>L</span>
          <span style={{ "--i": 7 } as React.CSSProperties}>L</span>
          <span style={{ "--i": 8 } as React.CSSProperties}>Y</span>
        </div>
      </div>

      <div className="sesion">
        <p>Bienvenido a Mentally, una plataforma con juegos y diversión!</p>
      </div>

      <div className="Buttons">
        {/* Cambia <a> por <Link> para las rutas internas en React */}
        <Link to="/formulario-maestro"> {/* Usa la ruta relativa correcta */}
          <button className="btn">Iniciar Sesión Maestro</button>
        </Link>
        
        {/* Enlace al formulario de alumno */}
        <Link to="/FormularioAlum"> {/* Usa la ruta correcta aquí también */}
          <button className="btn">Iniciar sesión Alumno</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

