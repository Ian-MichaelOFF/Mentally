import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../CSS/PerfilMast.css";
import SidebarM from "../TSX/sidebarmast";
import Medallas from "../TSX/Medallas";
import logoCerebro from "/logos/cerebro.png";

interface Maestro {
  IDmaestro: number;
  nombre: string;
  apellido: string;
  correo: string;
  Imagen: string;
}

Modal.setAppElement("#root");

const PerfilMaestro: React.FC = () => {
  const [maestro, setMaestro] = useState<Maestro | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Imágenes disponibles (asegúrate que existan en public/logos/)
  const imagenes = ["rana.png", "cartoon-capybara.png", "memoria.png"];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Cargar datos del maestro
  const fetchMaestroData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/maestro", {
        withCredentials: true,
      });
      setMaestro(response.data);
      setSelectedImage(response.data.Imagen || "default.png");
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaestroData();
  }, [fetchMaestroData]);

  const handleImageChange = (img: string) => {
    setSelectedImage(img);
  };

  const saveChanges = async () => {
    if (!maestro || !selectedImage) return;

    try {
      await axios.put(
        "http://localhost:5000/api/maestro",
        { imagen: selectedImage },
        { withCredentials: true }
      );
      setMaestro({ ...maestro, Imagen: selectedImage });
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
    <div className="app-containerM">
      {/* Navbar en la parte superior */}
      <nav className="navbar7M">
        <div className="logos7M">
          <span className="logos-text7M">MENTALLY</span>
          <img src={logoCerebro} alt="LogoM" />
        </div>
      </nav>

      {/* Sidebar */}
      <SidebarM isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="perfil-backgroundM">
        <div className="perfil-containerM">
          {maestro && (
            <div className="perfil-contentM">
              <div className="perfil-headerM">
                <div className="avatar-containerM">
                  <img
                    src={`/logos/${maestro.Imagen || "default.png"}`}
                    alt={`Perfil de ${maestro.nombre}`}
                    className="perfil-avatarM"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logos/default.png";
                    }}
                  />
                  <button
                    className="edit-buttonM"
                    onClick={() => setShowModal(true)}
                  >
                    ✏️
                  </button>
                </div>
                <h2 className="perfil-usernameM">
                  Nombre: <br /> {maestro.nombre} {maestro.apellido}
                </h2>
                <h2 className="perfil-idM">
                  ID: <br />
                  {maestro.IDmaestro}
                </h2>
                <h2 className="CorreoM">
                  Correo: <br /> {maestro.correo}
                </h2>
              </div>

              <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="modal-containerM"
                overlayClassName="modal-overlayM"
                closeTimeoutMS={200}
              >
                <div className="modal-contentM">
                  <h2>Cambiar imagen de perfil</h2>
                  <div className="current-imageM">
                    <img
                      src={`/logos/${selectedImage}`}
                      alt="Previsualización"
                      className="preview-imageM"
                    />
                  </div>

                  <div className="image-optionsM">
                    {imagenes.map((img) => (
                      <div
                        key={img}
                        className={`image-optionM ${
                          selectedImage === img ? "selected" : ""
                        }`}
                        onClick={() => handleImageChange(img)}
                      >
                        <img src={`/logos/${img}`} alt={`Opción ${img}`} />
                      </div>
                    ))}
                  </div>

                  <div className="modal-actionsM">
                    <button
                      className="cancel-buttonM"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button className="confirm-buttonM" onClick={saveChanges}>
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

export default PerfilMaestro;
