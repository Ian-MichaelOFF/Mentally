import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/formmaster.css"; // Puedes crear un CSS específico para maestros si lo prefieres

axios.defaults.withCredentials = true;

const LoginMaestro: React.FC = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToAlumno = () => {
    navigate("/FormularioAlum");
  };

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/session-maestro");
        if (res.data.loggedIn) {
          navigate("/Pagina-Principal-Mast"); // Asegúrate de tener esta ruta
        }
      } catch (error) {
        console.error("Error al verificar sesión", error);
      }
    };
    verificarSesion();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!correo || !contraseña) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login-maestro", {
        correo,
        contraseña,
      });

      if (response.data.message === "Inicio de sesión exitoso") {
        alert("Sesión iniciada correctamente");
        navigate("/Pagina-Principal-Mast");
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error("Error en el login:", error);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario_maestro">
      <nav className="navbarra">
        <div className="logomentally">
          <img src="logos/mascota2.png" alt="Logo del sitio" />
          MENTALLY
        </div>
        <div className="anuncio_maestro">¡BIENVENIDO MAESTRO!
          <img src="logos/tc3v2.png" alt="Logo del anuncio" />
        </div>
      </nav>

      <div className="forma_form_maestro">
        <form onSubmit={handleSubmit}>
          <div className="tituloform">
            <h2>Inicio de Sesión de Maestro</h2>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="campo_form_maestro">
            <label htmlFor="correo">Correo electrónico:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>

          <div className="campo_form_maestro">
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <div className="recuperar_contra_maestro">
            <a href="/Recuperar-ContraseñaMast">¿Se te olvidó la contraseña?</a>
          </div>

          <div className="buttons-form">
            <button className="boton_iniciar_sesion_maestro" type="submit" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
            <button className="boton_registrar_maestro" type="button" onClick={() => navigate("/RegistroMast")}>
              Registrarse
            </button>
          </div>

          <div className="eres_alumno">
            <a href="#" onClick={handleNavigateToAlumno}>¿Eres Alumno?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginMaestro;