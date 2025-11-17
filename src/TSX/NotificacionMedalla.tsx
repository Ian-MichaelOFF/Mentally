import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/notificacion-medalla.css";

interface NotificacionMedallaProps {
  medallaId: number | null;
  onClose: () => void;
}

interface DatosMedalla {
  nombre: string;
  descripcion: string;
  imagen: string;
}

const NotificacionMedalla: React.FC<NotificacionMedallaProps> = ({ medallaId, onClose }) => {
  const [medalla, setMedalla] = useState<DatosMedalla | null>(null);
  const [animacion, setAnimacion] = useState<boolean>(false);

  useEffect(() => {
    if (medallaId) {
      obtenerDetallesMedalla(medallaId);
      setAnimacion(true);
      // Cerrar automáticamente después de 7 segundos
      const timer = setTimeout(() => {
        setAnimacion(false);
        // Esperar a que termine la animación de salida
        setTimeout(onClose, 500);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [medallaId, onClose]);

  const obtenerDetallesMedalla = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medalla/${id}`, { withCredentials: true });
      setMedalla(response.data);
    } catch (error) {
      console.error("Error al obtener detalles de medalla:", error);
    }
  };

  const handleCerrar = () => {
    setAnimacion(false);
    // Esperar a que termine la animación de salida
    setTimeout(onClose, 500);
  };

  if (!medallaId || !medalla) return null;

  return (
    <div className={`notificacion-medalla-overlay ${animacion ? 'visible' : 'oculto'}`}>
      <div className="notificacion-medalla-container">
        <button className="cerrar-btn" onClick={handleCerrar}>×</button>
        <div className="notificacion-contenido">
          <div className="medalla-animacion">
            <img src={medalla.imagen} alt={medalla.nombre} className="medalla-imagen" />
            <div className="resplandor"></div>
          </div>
          <div className="texto-medalla">
            <h2>¡Nueva Medalla Obtenida!</h2>
            <h3>{medalla.nombre}</h3>
            <p>{medalla.descripcion}</p>
          </div>
        </div>
        <div className="confeti-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`confeti confeti-${i % 5}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificacionMedalla;