import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/medallas.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../TSX/sidebar";
import logoCerebro from "/logos/cerebro.png";

interface Medalla {
  id: number;
  nombre: string;
  descripcion: string;
  juego: string;
  dificultad: string;
  imagen: string;
  obtenida: boolean;
}

const Medallas: React.FC = () => {
  const [medallas, setMedallas] = useState<Medalla[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtro, setFiltro] = useState<string>("todos"); // todos, obtenidas, bloqueadas
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<string>("todos");
  const [errorCarga, setErrorCarga] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000"; // Para facilitar cambios futuros
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    axios
      .get(`${backendUrl}/api/alumno`, { withCredentials: true })
      .then(() => {
        // El usuario está autenticado, obtener medallas
        obtenerMedallas();
      })
      .catch(() => {
        // El usuario no está autenticado, redirigir al login
        navigate("/");
      });
  }, [navigate]);

  const obtenerMedallas = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${backendUrl}/api/mis-medallas`, {
        withCredentials: true,
      });
      setMedallas(response.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener medallas:", error);
      setCargando(false);
    }
  };

  const manejarErrorImagen = (medallaId: number) => {
    setErrorCarga((prev) => ({
      ...prev,
      [medallaId]: true,
    }));
  };


  // Función para construir la URL de la imagen con diferentes estrategias
  const construirUrlImagen = (medalla: Medalla): string => {
    // Si la imagen ya tiene la ruta completa (comienza con http:// o https://)
    if (
      medalla.imagen.startsWith("http://") ||
      medalla.imagen.startsWith("https://")
    ) {
      return medalla.imagen;
    }

    // Extraer solo el nombre de archivo de la ruta actual
    const nombreArchivo = medalla.imagen.split("/").pop();

    // Construir la ruta correcta apuntando a /logos/ (corresponde a public/logos/)
    return `/logos/${nombreArchivo}`;
  };

  const filtrarMedallas = () => {
    let medallasFiltradas = [...medallas];

    // Filtrar por juego
    if (juegoSeleccionado !== "todos") {
      medallasFiltradas = medallasFiltradas.filter(
        (medalla) => medalla.juego === juegoSeleccionado
      );
    }

    // Filtrar por estado (obtenidas/bloqueadas)
    if (filtro === "obtenidas") {
      medallasFiltradas = medallasFiltradas.filter(
        (medalla) => medalla.obtenida
      );
    } else if (filtro === "bloqueadas") {
      medallasFiltradas = medallasFiltradas.filter(
        (medalla) => !medalla.obtenida
      );
    }

    return medallasFiltradas;
  };

  const getJuegos = () => {
    const juegos = new Set<string>();
    medallas.forEach((medalla) => juegos.add(medalla.juego));
    return Array.from(juegos);
  };

  // Estadísticas de progreso
  const totalMedallas = medallas.length;
  const medallasObtenidas = medallas.filter((m) => m.obtenida).length;
  const porcentajeProgreso =
    totalMedallas > 0 ? (medallasObtenidas / totalMedallas) * 100 : 0;

  if (cargando) {
    return (
      <div className="medallas-page loading">
        <div className="spinner"></div>
        <p>Cargando tus medallas...</p>
      </div>
    );
  }

  return (
    <div>
            <nav className="navbarMedallas">
        <div className="logosMed">
          <span className="logos-textMed">MENTALLY</span>
          <img src={logoCerebro} alt="LogoMed" />
        </div>
      </nav>
    <div className="medallas-page">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}
      <div className="medallas-header">
        <h1>Colección de Medallas</h1>
        <div className="medallas-stats">
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${porcentajeProgreso}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {medallasObtenidas} de {totalMedallas} (
              {Math.round(porcentajeProgreso)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="medallas-filters">
        <div className="filter-group">
          <label>Filtrar por juego:</label>
          <select
            value={juegoSeleccionado}
            onChange={(e) => setJuegoSeleccionado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los juegos</option>
            {getJuegos().map((juego) => (
              <option key={juego} value={juego}>
                {juego}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filtrar por estado:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filtro === "todos" ? "active" : ""}`}
              onClick={() => setFiltro("todos")}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filtro === "obtenidas" ? "active" : ""}`}
              onClick={() => setFiltro("obtenidas")}
            >
              Obtenidas
            </button>
            <button
              className={`filter-btn ${
                filtro === "bloqueadas" ? "active" : ""
              }`}
              onClick={() => setFiltro("bloqueadas")}
            >
              Bloqueadas
            </button>
          </div>
        </div>
      </div>

      <div className="medallas-grid">
        {filtrarMedallas().length > 0 ? (
          filtrarMedallas().map((medalla) => (
            <div
              key={medalla.id}
              className={`medalla-card ${
                medalla.obtenida ? "obtenida" : "bloqueada"
              }`}
            >
              <div className="medalla-imagen-container">
                <img
                  src={construirUrlImagen(medalla)}
                  alt={medalla.nombre}
                  className="medalla-imagen"
                  // Ya no necesitamos el manejo de errores complejo
                  onError={(e) => {
                    console.error(
                      `Error al cargar imagen para medalla: ${medalla.nombre}`
                    );
                    // Opcionalmente, mostrar una imagen por defecto
                    e.currentTarget.src = "/logos/default-medal.png";
                  }}
                />
                {!medalla.obtenida && (
                  <div className="medalla-lock">
                    <i className="fas fa-lock"></i>
                  </div>
                )}
              </div>
              <div className="medalla-info">
                <h3 className="medalla-nombre">{medalla.nombre}</h3>
                <p className="medalla-descripcion">{medalla.descripcion}</p>
                <div className="medalla-details">
                  <span className="medalla-juego">{medalla.juego}</span>
                  <span
                    className={`medalla-dificultad dificultad-${medalla.dificultad.toLowerCase()}`}
                  >
                    {medalla.dificultad}
                  </span>
                </div>
                {/*DEBUG: Mostrar ruta de la imagen - quitar en producción*/}
                {/*<small className="debug-info">{medalla.imagen}</small>*/}
              </div>
            </div>
          ))
        ) : (
          <div className="no-medallas">
            <p>No se encontraron medallas con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Medallas;
