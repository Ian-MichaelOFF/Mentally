import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import api from "../api/config";
import "../CSS/Perfil.css";
import Sidebar from "../TSX/sidebar";


interface Alumno {
  IDalumno: number;
  nombre: string; // Añadido el campo nombre
  apellido: string; // Añadido el campo apellido
  Usuario: string;
  Respuesta: string;
  Imagen: string;
}

Modal.setAppElement("#root");

const PerfilAlumno: React.FC = () => {
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Imágenes disponibles (asegúrate que existan en public/logos/)
  const imagenes = ["rana.png", "cartoon-capybara.png", "memoria.png"];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cargar datos del alumno
  const fetchAlumnoData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/alumno");
      setAlumno(response.data);
      setSelectedImage(response.data.Imagen || "default.png");
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumnoData();
  }, [fetchAlumnoData]);

  const handleImageChange = (img: string) => {
    setSelectedImage(img);
  };

  const saveChanges = async () => {
    if (!alumno || !selectedImage) return;

    try {
      await api.put("/api/alumno", { imagen: selectedImage });
      setAlumno({ ...alumno, Imagen: selectedImage });
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil_alumno">
      {/* Navbar en la parte superior */}
      <nav className="navbarra">
        <div className="logomentally">
          <img src="/logos/mascota2.png" alt="Logo" />
          MENTALLY
        </div>
        <div className="letrero_alumno">
          ALUMNO
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="fondo_perfil_alumno">
        <div className="contenedor_perfil_alumno">
          {alumno && (
            <div className="perfil-content">
              <div className="perfil-header">
                <div className="avatar-container">
                  <img
                    src={`/logos/${alumno.Imagen || 'default.png'}`}
                    alt={`Perfil de ${alumno.Usuario}`}
                    className="perfil-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logos/default.png';
                    }}
                  />
                  <button 
                    className="edit-button"
                    onClick={() => setShowModal(true)}
                  >
                    ✏️
                  </button>
                </div>
                <h2 className="typo_perfil_alumno">Nombre: <span className="dato_perfil_alumno">{alumno.nombre} {alumno.apellido}</span></h2>
                <h2 className="typo_perfil_alumno">Usuario: <span className="dato_perfil_alumno">{alumno.Usuario}</span></h2>
                <h2 className="typo_perfil_alumno">ID: <span className="dato_perfil_alumno">{alumno.IDalumno}</span></h2>
                <h2 className="typo_perfil_alumno">Respuesta De Seguridad: <span className="dato_perfil_alumno">{alumno.Respuesta}</span></h2>
              </div>

              <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="modal-container"
                overlayClassName="modal-overlay"
                closeTimeoutMS={200}
              >
                <div className="modal-content">
                  <h2>Cambiar imagen de perfil</h2>
                  <div className="current-image">
                    <img
                      src={`/logos/${selectedImage}`}
                      alt="Previsualización"
                      className="preview-image"
                    />
                  </div>
                  
                  <div className="image-options">
                    {imagenes.map((img) => (
                      <div 
                        key={img}
                        className={`image-option ${selectedImage === img ? 'selected' : ''}`}
                        onClick={() => handleImageChange(img)}
                      >
                        <img
                          src={`/logos/${img}`}
                          alt={`Opción ${img}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="modal-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="confirm-button"
                      onClick={saveChanges}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilAlumno;
