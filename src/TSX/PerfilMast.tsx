import React, { useState, useEffect, useCallback, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import "../CSS/PerfilMast.css";
import SidebarM from "../TSX/sidebarmast";

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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Limpiar preview URL cuando se cierra el modal
  useEffect(() => {
    if (!showModal) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [showModal]);

  const handleImageChange = (img: string) => {
    setSelectedImage(img);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedImage(''); // Deseleccionar imágenes de stock
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadCustomPhoto = async () => {
    if (!selectedFile) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('foto', selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/maestro/upload-foto",
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (maestro) {
        setMaestro({ ...maestro, Imagen: response.data.imagen });
        setSelectedImage(response.data.imagen);
      }
      
      setShowModal(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error al subir foto:", error);
      alert("Error al subir la foto. Por favor intenta nuevamente.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveChanges = async () => {
    // Si hay un archivo seleccionado, subirlo
    if (selectedFile) {
      await uploadCustomPhoto();
      return;
    }

    // Si no hay archivo pero hay imagen de stock seleccionada
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
      alert("Error al actualizar el perfil. Por favor intenta nuevamente.");
    }
  };

  const deleteCustomPhoto = async () => {
    if (!maestro?.Imagen?.startsWith('uploads/')) {
      alert('No hay una foto personalizada para eliminar');
      return;
    }

    if (!window.confirm('¿Estás seguro de que deseas eliminar tu foto personalizada?')) {
      return;
    }

    try {
      await axios.delete("http://localhost:5000/api/maestro/foto", {
        withCredentials: true,
      });

      setMaestro({ ...maestro, Imagen: 'default.png' });
      setSelectedImage('default.png');
      setShowModal(false);
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      alert("Error al eliminar la foto. Por favor intenta nuevamente.");
    }
  };

  // Función auxiliar para obtener la URL correcta de la imagen
  const getImageUrl = (imagen: string) => {
    if (!imagen) return '/logos/default.png';
    
    // Si es una imagen subida (contiene 'uploads/')
    if (imagen.includes('uploads/maestros/')) {
      // Asegurarse de que la ruta no tenga barras duplicadas
      const cleanPath = imagen.startsWith('/') ? imagen : `/${imagen}`;
      return `http://localhost:5000${cleanPath}`;
    }
    
    // Si es una imagen de stock
    return `/logos/${imagen}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil_maestro">
      {/* Navbar en la parte superior */}
      <nav className="navbarra">
        <div className="logomentally">
          <img src="/logos/mascota2.png" alt="Logo" />
          MENTALLY
        </div>
        <div className="letrero_maestro">MAESTRO</div>
      </nav>

      {/* Sidebar */}
      <SidebarM isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="fondo_perfil_maestro">
        <div className="contenedor_perfil_maestro">
          {maestro && (
            <div className="perfil-contentM">
              <div className="perfil-headerM">
                <div className="avatar-containerM">
                  <img
                    src={getImageUrl(maestro.Imagen || 'default.png')}
                    alt={`Perfil de ${maestro.nombre}`}
                    className="perfil-avatarM"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logos/default.png';
                    }}
                  />
                  <button 
                    className="edit-buttonM"
                    onClick={() => setShowModal(true)}
                  >
                    ✏️
                  </button>
                </div>
                <h2 className="typo_perfil_maestro">
                  Nombre: <span className="dato_perfil_maestro">{maestro.nombre} {maestro.apellido}</span>
                </h2>
                <h2 className="typo_perfil_maestro">
                  ID: <span className="dato_perfil_maestro">{maestro.IDmaestro}</span>
                </h2>
                <h2 className="typo_perfil_maestro">
                  Correo: <span className="dato_perfil_maestro">{maestro.correo}</span>
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
                      src={previewUrl || getImageUrl(selectedImage || maestro.Imagen)}
                      alt="Previsualización"
                      className="preview-imageM"
                    />
                  </div>

                  {/* Botón para subir foto personalizada */}
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={triggerFileInput}
                      className="upload-buttonM"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginRight: '10px'
                      }}
                    >
                      📷 Subir mi foto
                    </button>
                    
                    {maestro.Imagen.startsWith('uploads/') && (
                      <button
                        onClick={deleteCustomPhoto}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Eliminar foto
                      </button>
                    )}
                  </div>

                  {selectedFile && (
                    <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}

                  <h3 style={{ textAlign: 'center', margin: '20px 0 10px 0' }}>
                    O elige un avatar:
                  </h3>
                  
                  <div className="image-optionsM">
                    {imagenes.map((img) => (
                      <div 
                        key={img}
                        className={`image-optionM ${selectedImage === img && !previewUrl ? 'selected' : ''}`}
                        onClick={() => handleImageChange(img)}
                      >
                        <img
                          src={`/logos/${img}`}
                          alt={`Opción ${img}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="modal-actionsM">
                    <button 
                      className="cancel-buttonM"
                      onClick={() => setShowModal(false)}
                      disabled={uploadingPhoto}
                    >
                      Cancelar
                    </button>
                    <button
                      className="confirm-buttonM"
                      onClick={saveChanges}
                      disabled={uploadingPhoto || (!selectedImage && !selectedFile)}
                    >
                      {uploadingPhoto ? 'Subiendo...' : 'Guardar Cambios'}
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