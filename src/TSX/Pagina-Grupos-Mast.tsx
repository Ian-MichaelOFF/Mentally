import React, { useState, useEffect } from "react";
import Sidebar from "../TSX/sidebarmast";
import "../CSS/PaginaGruposMaestro.css";
import logoCerebro from "/logos/cerebro.png";
import { useNavigate } from "react-router-dom";

interface Grupo {
  id: number;
  nombre: string;
  token: string;
  total_alumnos: number;
  fecha_creacion: string;
}

interface Alumno {
  IDalumno: number;
  Usuario: string;
  nombre: string;
  apellido: string;
  Imagen: string;
}

interface Partida {
  IDpartida: number;
  juego: string;
  dificultad: string;
  puntuacion: number;
  fecha_partida: string;
}

const PaginaGruposMaestro: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalAgregarAlumno, setShowModalAgregarAlumno] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<Grupo | null>(null);
  const [idAlumno, setIdAlumno] = useState("");
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [alumnosEnGrupo, setAlumnosEnGrupo] = useState<Alumno[]>([]);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState<Alumno[]>([]);
  const [showDetallesGrupo, setShowDetallesGrupo] = useState(false);
  const [historialPartidas, setHistorialPartidas] = useState<Partida[]>([]);
  const [alumnoSeleccionadoId, setAlumnoSeleccionadoId] = useState<number | null>(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const navigate = useNavigate();

  // Cargar grupos del maestro
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grupos", {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login-maestro");
          }
          throw new Error("Error al cargar grupos");
        }

        const data = await response.json();
        setGrupos(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    cargarGrupos();
  }, [navigate]);

  // Cargar alumnos disponibles cuando se abre el modal
  useEffect(() => {
    if ((showModalAgregarAlumno || showDetallesGrupo) && grupoSeleccionado) {
      const cargarAlumnos = async () => {
        try {
          // Cargar alumnos en el grupo
          const responseGrupo = await fetch(
            `http://localhost:5000/api/grupos/${grupoSeleccionado.id}/alumnos`,
            { credentials: "include" }
          );
          const alumnosGrupo = await responseGrupo.json();
          setAlumnosEnGrupo(alumnosGrupo);

          // Cargar todos los alumnos (simplificado - en producción necesitarías paginación)
          const responseTodos = await fetch(
            "http://localhost:5000/api/alumnos",
            { credentials: "include" }
          );
          const todosAlumnos = await responseTodos.json();
          setAlumnosDisponibles(todosAlumnos);
        } catch (error) {
          console.error("Error al cargar alumnos:", error);
        }
      };

      cargarAlumnos();
    }
  }, [showModalAgregarAlumno, showDetallesGrupo, grupoSeleccionado]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const abrirDetallesGrupo = (grupo: Grupo) => {
    setGrupoSeleccionado(grupo);
    setShowDetallesGrupo(true);
    // Limpiar el historial y el alumno seleccionado al cambiar de grupo
    setHistorialPartidas([]);
    setAlumnoSeleccionadoId(null);
  };

  const crearNuevoGrupo = async () => {
    if (!nombreGrupo.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/grupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nombre: nombreGrupo }),
      });

      if (!response.ok) throw new Error("Error al crear grupo");

      const nuevoGrupo = await response.json();
      setGrupos([...grupos, nuevoGrupo.grupo]);
      setNombreGrupo("");
      setShowModalCrear(false);
    } catch (error) {
      console.error("Error al crear grupo:", error);
      alert("Error al crear grupo");
    }
  };

  const agregarAlumnoAGrupo = async () => {
    if (!idAlumno.trim() || !grupoSeleccionado) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/grupos/${grupoSeleccionado.id}/alumnos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ alumnoId: idAlumno }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar alumno");
      }

      // Actualizar la lista de grupos para reflejar el nuevo alumno
      const updatedGrupos = grupos.map((grupo) => {
        if (grupo.id === grupoSeleccionado.id) {
          return { ...grupo, total_alumnos: grupo.total_alumnos + 1 };
        }
        return grupo;
      });

      // Refrescar la lista de alumnos en grupo
      const responseGrupo = await fetch(
        `http://localhost:5000/api/grupos/${grupoSeleccionado.id}/alumnos`,
        { credentials: "include" }
      );
      const alumnosGrupo = await responseGrupo.json();
      setAlumnosEnGrupo(alumnosGrupo);

      setGrupos(updatedGrupos);
      setIdAlumno("");
      
      // Si estamos en el modal de agregar, cerrarlo
      if (showModalAgregarAlumno) {
        setShowModalAgregarAlumno(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };
  
  const eliminarAlumnoDeGrupo = async (alumnoId: number) => {
    if (!grupoSeleccionado) return;
    
    if (!window.confirm("¿Estás seguro de eliminar este alumno del grupo?")) return;
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/grupos/${grupoSeleccionado.id}/alumnos/${alumnoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Error al eliminar alumno del grupo");
      
      // Actualizar la lista de alumnos
      setAlumnosEnGrupo(alumnosEnGrupo.filter(alumno => alumno.IDalumno !== alumnoId));
      
      // Actualizar el contador de alumnos en el grupo
      const updatedGrupos = grupos.map((grupo) => {
        if (grupo.id === grupoSeleccionado.id) {
          return { ...grupo, total_alumnos: grupo.total_alumnos - 1 };
        }
        return grupo;
      });
      
      setGrupos(updatedGrupos);
      
      // Si el alumno eliminado es el que tiene el historial abierto, cerrar el historial
      if (alumnoSeleccionadoId === alumnoId) {
        setAlumnoSeleccionadoId(null);
        setHistorialPartidas([]);
      }
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar alumno del grupo");
    }
  };

  const eliminarGrupo = async (grupoId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este grupo?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/grupos/${grupoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Error al eliminar grupo");

      setGrupos(grupos.filter((grupo) => grupo.id !== grupoId));
      
      // Si estamos viendo los detalles del grupo eliminado, cerrar la vista
      if (grupoSeleccionado && grupoSeleccionado.id === grupoId) {
        setShowDetallesGrupo(false);
        setGrupoSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
      alert("Error al eliminar grupo");
    }
  };

  const copiarToken = (token: string) => {
    navigator.clipboard.writeText(token);
    alert("Token copiado al portapapeles");
  };

  // Nueva función para cargar el historial de partidas
  const cargarHistorialAlumno = async (alumnoId: number) => {
    // Si ya está seleccionado, deseleccionar (toggle)
    if (alumnoSeleccionadoId === alumnoId) {
      setAlumnoSeleccionadoId(null);
      setHistorialPartidas([]);
      return;
    }
    
    setAlumnoSeleccionadoId(alumnoId);
    setCargandoHistorial(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/historial/${alumnoId}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Error al cargar historial");
      }
      
      const data = await response.json();
      setHistorialPartidas(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      alert("Error al cargar historial del alumno");
      setHistorialPartidas([]);
    } finally {
      setCargandoHistorial(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar4">
        <div className="logos3">
          <span className="logos-text3">MENTALLY</span>
          <img src={logoCerebro} alt="Logo3" />
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <div className="Cuerpo3">
        <h1>Mis Grupos: ({grupos.length})</h1>

        {!showDetallesGrupo ? (
          <div className="grupos-container">
            {/* Card para crear nuevo grupo */}
            <div
              className="nuevo-grupo-card"
              onClick={() => setShowModalCrear(true)}
            >
              <div className="mas-sign">+</div>
              <p>Crear nuevo grupo</p>
            </div>

            {/* Lista de grupos existentes */}
            {grupos.map((grupo) => (
              <div key={grupo.id} className="grupo-card" onClick={() => abrirDetallesGrupo(grupo)}>
                <h3>{grupo.nombre}</h3>
                <p>
                  Token:{" "}
                  <strong
                    onClick={(e) => {
                      e.stopPropagation();
                      copiarToken(grupo.token);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {grupo.token}
                  </strong>
                </p>
                <p>Alumnos: {grupo.total_alumnos}</p>
                <p>
                  Creado: {new Date(grupo.fecha_creacion).toLocaleDateString()}
                </p>

                <div className="grupo-actions">
                  <button
                    className="btn-agregar-alumno"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGrupoSeleccionado(grupo);
                      setShowModalAgregarAlumno(true);
                    }}
                  >
                    Agregar alumno
                  </button>
                  <button
                    className="btn-eliminar-grupo"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarGrupo(grupo.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista detallada del grupo
          <div className="grupo-detalle">
            <div className="grupo-detalle-header">
              <button className="btn-volver" onClick={() => setShowDetallesGrupo(false)}>
                ← Volver a Grupos
              </button>
              <h2>{grupoSeleccionado?.nombre}</h2>
            </div>
            
            <div className="grupo-info">
              <div className="grupo-info-token">
                <p>
                  <strong>Token:</strong>{" "}
                  <span 
                    className="token-text"
                    onClick={() => grupoSeleccionado && copiarToken(grupoSeleccionado.token)}
                  >
                    {grupoSeleccionado?.token}
                  </span>
                  <button 
                    className="btn-copiar"
                    onClick={() => grupoSeleccionado && copiarToken(grupoSeleccionado.token)}
                  >
                    Copiar
                  </button>
                </p>
                <p><strong>Fecha de creación:</strong> {grupoSeleccionado ? new Date(grupoSeleccionado.fecha_creacion).toLocaleDateString() : ""}</p>
              </div>
              
              <div className="grupo-acciones">
                <button 
                  className="btn-agregar-alumno"
                  onClick={() => setShowModalAgregarAlumno(true)}
                >
                  Agregar alumno
                </button>
                <button 
                  className="btn-eliminar-grupo"
                  onClick={() => grupoSeleccionado && eliminarGrupo(grupoSeleccionado.id)}
                >
                  Eliminar grupo
                </button>
              </div>
            </div>
            
            <h3>Alumnos en el grupo ({alumnosEnGrupo.length})</h3>
            
            {alumnosEnGrupo.length === 0 ? (
              <p className="no-alumnos">No hay alumnos en este grupo.</p>
            ) : (
              <div className="alumnos-tabla">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosEnGrupo.map((alumno) => (
                      <React.Fragment key={alumno.IDalumno}>
                        <tr>
                          <td>{alumno.IDalumno}</td>
                          <td>{alumno.Usuario}</td>
                          <td>{alumno.nombre}</td>
                          <td>{alumno.apellido}</td>
                          <td>
                            <button 
                              className="btn-eliminar-alumno"
                              onClick={() => eliminarAlumnoDeGrupo(alumno.IDalumno)}
                            >
                              Eliminar
                            </button>
                            <button 
                              className={`btn-historial-alumno ${alumnoSeleccionadoId === alumno.IDalumno ? 'active' : ''}`}
                              onClick={() => cargarHistorialAlumno(alumno.IDalumno)}
                            >
                              {alumnoSeleccionadoId === alumno.IDalumno ? 'Ocultar historial' : 'Ver historial'}
                            </button>
                          </td>
                        </tr>
                        
                        {/* Panel desplegable para mostrar el historial */}
                        {alumnoSeleccionadoId === alumno.IDalumno && (
                          <tr className="historial-row">
                            <td colSpan={5}>
                              <div className="historial-panel">
                                <h4>Historial de partidas recientes</h4>
                                {cargandoHistorial ? (
                                  <p>Cargando historial...</p>
                                ) : historialPartidas.length > 0 ? (
                                  <table className="historial-table">
                                    <thead>
                                      <tr>
                                        <th>Juego</th>
                                        <th>Dificultad</th>
                                        <th>Puntuación</th>
                                        <th>Fecha</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {historialPartidas.map((partida) => (
                                        <tr key={partida.IDpartida}>
                                          <td>{partida.juego}</td>
                                          <td>{partida.dificultad}</td>
                                          <td>{partida.puntuacion}</td>
                                          <td>{new Date(partida.fecha_partida).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p>Este alumno no tiene partidas registradas.</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear nuevo grupo */}
      {showModalCrear && (
        <div className="modal-overlay">
          <div className="modal-grupo">
            <h2>Crear nuevo grupo</h2>
            <input
              type="text"
              placeholder="Nombre del grupo"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && crearNuevoGrupo()}
            />
            <div className="modal-buttons">
              <button onClick={crearNuevoGrupo}>Crear</button>
              <button onClick={() => setShowModalCrear(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar alumno */}
      {showModalAgregarAlumno && grupoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-grupo">
            <h2>Agregar alumno a {grupoSeleccionado.nombre}</h2>

            <div className="agregar-alumno-options">
              <div>
                <h4>Mediante ID de alumno</h4>
                <input
                  type="text"
                  placeholder="ID del alumno"
                  value={idAlumno}
                  onChange={(e) => setIdAlumno(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && agregarAlumnoAGrupo()}
                />
              </div>

              <div>
                <h4>Buscar alumno</h4>
                <input
                  type="text"
                  placeholder="Buscar por ID, nombre o apellido..."
                  value={busquedaAlumno}
                  onChange={(e) => setBusquedaAlumno(e.target.value)}
                />

                {/* Lista de alumnos disponibles */}
                <div className="alumnos-list">
                  {alumnosDisponibles
                    .filter(
                      (alumno) =>
                        alumno.IDalumno.toString().includes(busquedaAlumno) ||
                        alumno.nombre.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
                        alumno.apellido.toLowerCase().includes(busquedaAlumno.toLowerCase())
                    )
                    .filter(
                      (alumno) =>
                        !alumnosEnGrupo.some(
                          (a) => a.IDalumno === alumno.IDalumno
                        )
                    )
                    .map((alumno) => (
                      <div
                        key={alumno.IDalumno}
                        className="alumno-item"
                        onClick={() => {
                          setIdAlumno(alumno.IDalumno.toString());
                        }}
                      >
                        <span>
                          {alumno.nombre} {alumno.apellido} ({alumno.Usuario}) - ID: {alumno.IDalumno}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={agregarAlumnoAGrupo} disabled={!idAlumno.trim()}>
                Agregar
              </button>
              <button onClick={() => setShowModalAgregarAlumno(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaGruposMaestro;