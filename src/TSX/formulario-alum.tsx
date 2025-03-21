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

  // Verificar sesión activa al cargar la página
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/session"); // Asegúrate que la URL sea correcta
        if (res.data.loggedIn) {
          navigate("/PaginaPrincipal"); // Si ya está logueado, redirigir
        }
      } catch (error) {
        console.error("Error al verificar sesión", error);
      }
    };

    verificarSesion();
  }, [navigate]);

  // Manejar el envío del formulario de login
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Verificar si los campos están completos
    if (!name || !password) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    console.log("Usuario y contraseña enviados:", { name, password });

    setLoading(true);
    try {
      // Realizar la solicitud al backend para hacer login
      const response = await axios.post("http://localhost:5000/login", { // URL al backend
        name,
        password,
      });

      // Verificar la respuesta del backend
      if (response.data.message === "Inicio de sesión exitoso") {
        alert("Sesión iniciada correctamente");
        navigate("/PaginaPrincipal"); // Redirigir a la página principal
      } else {
        setError(response.data.message); // Mostrar error si el login no es exitoso
      }
    } catch (error: any) {
      console.error("Error en el login:", error);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false); // Dejar de mostrar "Iniciando..." cuando termine
    }
  };

  return (
    <div className="formulario-page">
      <nav className="navbarform">
        <div className="logoform">
          MENTALLY
          <img src="./src/logos/cerebro.png" alt="Logo del sitio" />
        </div>
        <div className="textobienv">BIENVENIDO DE VUELTA!</div>
      </nav>

      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <h2>Inicio de Sesión <br /> Alumno</h2>

          {/* Mostrar mensaje de error si lo hay */}
          {error && <p className="error-message">{error}</p>}

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

          <a href="/form_recuperacion">¿Se te olvidó la contraseña?</a>

          <button type="submit" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>

          <button type="button" onClick={() => navigate("/Registro_Alum")}>
            Registrarse
          </button>
        </form>

        <a href="/formulario-maestro">¿Eres Maestro?</a>
      </div>
    </div>
  );
};

export default Login;
