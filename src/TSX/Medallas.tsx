import React from "react";
import "../CSS/medallas.css";
import medallaIcon from "/logos/medalla.png";
import medallasIcon from "/logos/medalla.png";

interface MedallasProps {
  isOpen: boolean;
  toggleMedallas: () => void;
}

const Medallas: React.FC<MedallasProps> = ({ isOpen, toggleMedallas }) => {
  // Datos de ejemplo para las medallas
  const medallas = [
    { id: 1, nombre: "Nivel Dificil Memorama", imagen: "/logos/medalla1.png", obtenida: false },
    { id: 2, nombre: "Nivel Medio Memorama", imagen: "/logos/medalla2.png", obtenida: true },
    { id: 3, nombre: "Nivel Facil Memorama", imagen: "/logos/medalla3.png", obtenida: true },
    // Agrega más medallas según necesites
  ];

  return (
    <>
      {/* Botón de abrir/cerrar con imagen - AHORA INTEGRADO EN EL COMPONENTE */}
      <button onClick={toggleMedallas} className="medallas-toggle-btn">
        <img 
          src={isOpen ? medallaIcon : medallasIcon} 
          alt={isOpen ? "Cerrar medallas" : "Ver medallas"} 
          className="medalla-icon"
        />
      </button>

      {/* Sidebar de medallas */}
      <div className={`medallas-sidebar ${isOpen ? "open" : ""}`}>
        <div className="medallas-header">
          <h2>Tus Medallas</h2>
        </div>
        
        <div className="medallas-container">
          {medallas.map((medalla) => (
            <div 
              key={medalla.id} 
              className={`medalla-item ${medalla.obtenida ? "" : "bloqueada"}`}
            >
              <img 
                src={medalla.imagen} 
                alt={medalla.nombre} 
                className="medalla-img"
              />
              <span className="medalla-nombre">{medalla.nombre}</span>
              {!medalla.obtenida && (
                <span className="medalla-bloqueada">(Bloqueada)</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto */}
      {isOpen && <div className="medallas-backdrop" onClick={toggleMedallas}></div>}
    </>
  );
};

export default Medallas;