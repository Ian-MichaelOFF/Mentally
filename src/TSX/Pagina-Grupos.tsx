import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../TSX/sidebar";
import "../CSS/PaginaGrupos.css";
import { ArrowLeft } from "lucide-react";

// Definición de tipos
interface Alumno {
  IDalumno: number;
  nombre: string;
  apellido: string;
  Usuario: string;
  Imagen: string;
}

interface Grupo {
  id: number;
  nombre: string;
  token: string;
  fecha_creacion: string;
  maestro_nombre: string;
  maestro_apellido: string;
}

interface GrupoDetalle {
  grupo: {
    id: number;
    nombre: string;
    token: string;
    fecha_creacion: string;
    IDmaestro: number;
    maestro_nombre: string;
    maestro_apellido: string;
  };
  alumnos: Alumno[];
}

const GruposAlumnos: React.FC = () => {
  // Estados
  const [token, setToken] = useState('');
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<GrupoDetalle | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goBack = () => {
    window.history.back();
  };

  // Cargar grupos al iniciar
  useEffect(() => {
    cargarGrupos();
  }, []);

  // Función para cargar los grupos del alumno
  const cargarGrupos = async () => {
    try {
      setCargando(true);
      const respuesta = await axios.get('http://localhost:5000/api/mis-grupos', { withCredentials: true });
      setGrupos(respuesta.data);
      setGrupoSeleccionado(null);
      setCargando(false);
    } catch (error) {
      setCargando(false);
      setError('Error al cargar los grupos');
      console.error('Error al cargar grupos:', error);
    }
  };

  // Función para unirse a un grupo
  const unirseAGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('El token es requerido');
      return;
    }

    try {
      setCargando(true);
      const respuesta = await axios.post(
        'http://localhost:5000/api/unirse-grupo',
        { token },
        { withCredentials: true }
      );
      
      setMensaje(respuesta.data.message);
      setToken('');
      setError('');
      cargarGrupos();
      setCargando(false);
    } catch (error: any) {
      setCargando(false);
      setError(error.response?.data?.message || 'Error al unirse al grupo');
      console.error('Error al unirse al grupo:', error);
    }
  };

  // Función para ver detalles de un grupo
  const verDetallesGrupo = async (grupoId: number) => {
    try {
      setCargando(true);
      const respuesta = await axios.get(`http://localhost:5000/api/grupo/${grupoId}`, { 
        withCredentials: true 
      });
      setGrupoSeleccionado(respuesta.data);
      setError('');
      setMensaje('');
      setCargando(false);
    } catch (error) {
      setCargando(false);
      setError('Error al cargar los detalles del grupo');
      console.error('Error al cargar detalles del grupo:', error);
    }
  };

  // Función para salir de un grupo
  const salirDeGrupo = async (grupoId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres salir de este grupo?')) {
      return;
    }

    try {
      setCargando(true);
      const respuesta = await axios.delete(`http://localhost:5000/api/salir-grupo/${grupoId}`, {
        withCredentials: true
      });
      
      setMensaje(respuesta.data.message);
      if (grupoSeleccionado?.grupo.id === grupoId) {
        setGrupoSeleccionado(null);
      }
      cargarGrupos();
      setCargando(false);
    } catch (error: any) {
      setCargando(false);
      setError(error.response?.data?.message || 'Error al salir del grupo');
      console.error('Error al salir del grupo:', error);
    }
  };

  // Función para volver a la lista de grupos
  const volverALista = () => {
    setGrupoSeleccionado(null);
    setError('');
    setMensaje('');
  };

  return (
    <div className="pagina-grupos-alumno-todo">
      {/* Navbar */}
      <nav className="navbarra">  
        <div className="logomentally">
          <img src="logos/mascota2.png" alt="Logo" />
          MENTALLY
        </div>
        <div className="letrero_alumno">ALUMNO</div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Fondo oscuro al abrir la sidebar */}
      {isSidebarOpen && (
        <div className="backdrop" onClick={toggleSidebar}></div>
      )}

      {/* Contenido principal */}
      <button
        onClick={goBack}
        className="back-buttonMemoryMst"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
      
      <div className="cuerpo-grupos-alumno">
        <h1>GRUPOS</h1>
        
        {/* Formulario para unirse a grupo */}
        <div className="contenedor-formulario-alumno">
          <h2>Unirse a un Grupo</h2>
          <form onSubmit={unirseAGrupo} className="form-unirse-alumno">
            <input
              type="text"
              placeholder="Ingresa el token del grupo"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input-token"
            />
            <button 
              type="submit" 
              className="btn-unirse-alumno"
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Unirse al Grupo'}
            </button>
          </form>
        </div>

        {/* Mensajes de error o éxito */}
        {error && <div className="mensaje-error">{error}</div>}
        {mensaje && <div className="mensaje-exito">{mensaje}</div>}

        {/* Vista de detalles de un grupo o lista de grupos */}
        <div className="contenedor-principal-grupo-alumno">
          {grupoSeleccionado ? (
            <div className="detalles-grupo-alumno">
              <div className="cabecera-detalles-grupo-alumno">
                <h2>Detalles del Grupo</h2>
                <button 
                  onClick={volverALista}
                  className="btn-volver-lista-grupos-alumno"
                >
                  Volver a la lista
                </button>
              </div>
              
              <div className="info-grupo-alumno">
                <p className="nombre-grupo-alumno">{grupoSeleccionado.grupo.nombre}</p>
                <p className="detalle-grupo-alumno">
                  <span className="etiqueta-alumno">Profesor:</span> {grupoSeleccionado.grupo.maestro_nombre} {grupoSeleccionado.grupo.maestro_apellido}
                </p>
                <p className="detalle-grupo-alumno">
                  <span className="etiqueta-alumno">Token:</span> {grupoSeleccionado.grupo.token}
                </p>
                <p className="detalle-grupo-alumno">
                  <span className="etiqueta-alumno">Fecha de creación:</span> {new Date(grupoSeleccionado.grupo.fecha_creacion).toLocaleDateString()}
                </p>
              </div>

              <div className="seccion-alumnos-alumno">
                <div className="cabecera-alumnos-alumno">
                  <h3>Alumnos en este grupo ({grupoSeleccionado.alumnos.length})</h3>
                  <button 
                    onClick={() => salirDeGrupo(grupoSeleccionado.grupo.id)}
                    className="btn-salir-grupo-alumno"
                    disabled={cargando}
                  >
                    {cargando ? 'Procesando...' : 'Salir del grupo'}
                  </button>
                </div>
                
                <div className="lista-alumnos-container-alumno">
                  {grupoSeleccionado.alumnos.length > 0 ? (
                    <ul className="lista-alumnos">
                      {grupoSeleccionado.alumnos.map(alumno => (
                        <li key={alumno.IDalumno} className="alumno-item">
                          <div className="avatar-alumno">
                            {alumno.Imagen ? (
                              <img 
                                src={`http://localhost:5000/uploads/${alumno.Imagen}`} 
                                alt={`${alumno.nombre} ${alumno.apellido}`}
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {alumno.nombre.charAt(0)}{alumno.apellido.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="info-alumno">
                            <p className="nombre-alumno">{alumno.nombre} {alumno.apellido}</p>
                            <p className="usuario-alumno">@{alumno.Usuario}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mensaje-vacio">No hay alumnos en este grupo</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="lista-grupos-container-alumno">
              <h2>Mis Grupos</h2>
              {cargando ? (
                <p className="mensaje-cargando">Cargando grupos...</p>
              ) : grupos.length > 0 ? (
                <div className="grupos-grid">
                  {grupos.map(grupo => (
                    <div key={grupo.id} className="tarjeta-grupo-alumno">
                      <h3 className="titulo-tarjeta-alumno">{grupo.nombre}</h3>
                      <p className="profesor-tarjeta-alumno">Profesor: {grupo.maestro_nombre} {grupo.maestro_apellido}</p>
                      <p className="fecha-tarjeta-alumno">
                        Creado: {new Date(grupo.fecha_creacion).toLocaleDateString()}
                      </p>
                      <div className="acciones-tarjeta-alumno">
                        <button 
                          onClick={() => verDetallesGrupo(grupo.id)}
                          className="btn-ver-alumno"
                        >
                          Ver detalles
                        </button>
                        <button 
                          onClick={() => salirDeGrupo(grupo.id)}
                          className="btn-salir-tarjeta-alumno"
                        >
                          Salir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mensaje-vacio">
                  No estás en ningún grupo. Únete a uno utilizando un token válido.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GruposAlumnos;