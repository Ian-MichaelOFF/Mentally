import { useState } from "react";
import "../CSS/RegistroMaestro.css";
import { useNavigate } from "react-router-dom";

const RegistroMaestro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    confirmPassword: "",
    fechaNacimiento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/guardar-maestro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resultado = await response.json();
      alert(resultado.mensaje);

      navigate("/Formulario-Mast"); // Redirigir a la página de inicio de sesión o a otra página después del registro

    } catch (error) {
      alert("Error al enviar los datos: " + error);
    }
  };

  const handleNavigateToSesion = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("/Formulario-Mast");
  };

  return (
    <div className="formularioregistMast">
      <nav className="navegacionbarMast">
        <div className="logoregistMast">
          MENTALLY
          <img src="/logos/cerebro.png" alt="Logo del sitio" />
        </div>
        <div className="texto-bienvenida-Mast">BIENVENIDO MAESTRO!</div>
      </nav>
      <div className="formulario_registroMast">
        <form onSubmit={handleSubmit}>
          <h2>Registro Maestro</h2>

          <div className="campo-formulario">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              placeholder="Tu nombre"
              onChange={handleChange}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              required
              placeholder="Tu apellido"
              onChange={handleChange}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="correo">Correo electrónico:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              required
              placeholder="tucorreo@ejemplo.com"
              onChange={handleChange}
            />
          </div>

          <div className="crearcontraMast">
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              required
              placeholder="Crea una contraseña"
              onChange={handleChange}
            />
          </div>

          <div className="contraseña-confirmMast">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Repite tu contraseña"
              onChange={handleChange}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              required
              onChange={handleChange}
            />
          </div>

          <div className="boton-crearMast">
            <button className="BotocrearMast" type="submit">
              Registrarse
            </button>
          </div>
        </form>

        <div className="usuariosesionMast">
          <a href="usuariosesion" onClick={handleNavigateToSesion}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistroMaestro;
