import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir después de enviar el formulario
import "../formalum/formalum.css";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Para la redirección

  // Función para manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Aquí iría la lógica para manejar el login, como validaciones o peticiones a una API
    console.log("Usuario:", name);
    console.log("Contraseña:", password);

    // Redirigir después de enviar el formulario
    navigate("/PaginaPrincipal"); // Ruta correcta para la página principal
  };

  return (
    <div className="formulario-page">
      <nav className="navbarform">
        <div className="logoform">MENTALLY
          <img src="./src/logos/cerebro.png" alt="img" />
        </div>
        <div className="textobienv">BIENVENIDO DE VUELTA! </div>
      </nav>

      <div className="formulario">
        <form onSubmit={handleSubmit}>
          <h2>
            Inicio de Sesión <br /> Alumno
          </h2>
          <label htmlFor="name">Usuario:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Maneja el cambio de valor
            required
            placeholder="Usuario123"
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Maneja el cambio de valor
            required
            placeholder="Contraseña123"
          />

          <a href="/form_recuperacion">¿Se te olvidó la contraseña?</a>
          <button type="submit">Iniciar Sesión</button> {/* Elimina el onClick */}
          <button type="button" onClick={() => navigate("/Registro_Alum")}>Registrarse</button>
        </form>

        <a href="/formulario-maestro">¿Eres Maestro?</a>
      </div>
    </div>
  );
};

export default Login;
