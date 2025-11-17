import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/formalum.css";

axios.defaults.withCredentials = true;

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToMaestro = () => {
    navigate("/Formulario-Mast");
  };

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/session");
        if (res.data.loggedIn) {
          navigate("/Pagina-Principal");
        }
      } catch (error) {
        console.error("Error al verificar sesión", error);
      }
    };
    verificarSesion();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !password) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", {
        name,
        password,
      });

      if (response.data.message === "Inicio de sesión exitoso") {
        alert("Sesión iniciada correctamente");
        navigate("/Pagina-Principal");
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
    <div className="formulario_alumno">
      <nav className="navbarra">
        <div className="logomentally">
          <img src="/logos/mascota2.png" alt="Logo del sitio" />
          MENTALLY
        </div>
        <div className="anuncio_alumno">¡BIENVENIDO ALUMNO!
          <img src="/logos/std2v2.png" alt="Logo del anuncio" />
        </div>
      </nav>

      <div className="forma_form_alumno">
        <form onSubmit={handleSubmit}>
            <h2>Inicio de Sesión de Alumno</h2>

          {error && <p className="error-message">{error}</p>}

          <div className="campo_form_alumno">
            <label htmlFor="name">Usuario:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Usuario123"
            />
          </div>

          <div className="campo_form_alumno">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña123"
            />
          </div>

          <div className="recuperar_contra_alumno">
            <a href="/Recuperar-ContraseñaAlum">¿Se te olvidó la contraseña?</a>
          </div>

          <div className="buttons-form">
            <button className="boton_iniciar_sesion_alumno" type="submit" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
            <button className="boton_registro_alumno" type="button" onClick={() => navigate("/RegistroAlum")}>
              Registrarse
            </button>
          </div>

          <div className="eres_maestro">
            <a href="#" onClick={handleNavigateToMaestro}>¿Eres Maestro?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
