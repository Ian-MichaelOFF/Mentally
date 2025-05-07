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
    <div className="formulario-page">
      <nav className="navbarform">
        <div className="logoform">
          MENTALLY
          <img src="logos/cerebro.png" alt="Logo del sitio" />
        </div>
        <div className="textobienv">BIENVENIDO DE VUELTA!</div>
      </nav>

      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <div className="tituloform">
            <h2>Inicio de Sesión <br /> Alumno</h2>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="usuarioform">
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

          <div className="contraseñaform">
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

          <div className="recuperar">
            <a href="/Recuperar-ContraseñaAlum">¿Se te olvidó la contraseña?</a>
          </div>

          <div className="buttons-form">
            <button className="button1" type="submit" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
            <button className="button2" type="button" onClick={() => navigate("/RegistroAlum")}>
              Registrarse
            </button>
          </div>

          <div className="mast">
            <a href="#" onClick={handleNavigateToMaestro}>¿Eres Maestro?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
