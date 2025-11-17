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
    <div className="formulario_maestro">
      <nav className="navbarra">
        <div className="logomentally">
          <img src="/logos/mascota2.png" alt="Logo del sitio" />
          MENTALLY
        </div>
        <div className="anuncio_maestro">
          ¡BIENVENIDO MAESTRO!
          <img src="/logos/tc3v2.png" alt="Logo del anuncio" />
        </div>
      </nav>
      <div className="forma_form_maestro">
        <form onSubmit={handleSubmit}>
          <h2>Registro de Maestro</h2>

          <div className="campo_form_maestro">
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

          <div className="campo_form_maestro">
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

          <div className="campo_form_maestro">
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

          <div className="campo_form_maestro">
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              required
              minLength={6}
              placeholder="6 caracteres"
              onChange={handleChange}
            />
          </div>

          <div className="campo_form_maestro">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              placeholder="Repite tu contraseña"
              onChange={handleChange}
            />
          </div>

            <div className="campo_form_maestro  ">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento:</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                required
                min="1970-01-01"
                max="2005-12-31"
                onChange={handleChange}
              />
            </div>

          <div className="crear_maestro">
            <button className="boton_crear_maestro" type="submit">
              Registrarse
            </button>
          </div>
        </form>

        <div className="inicio_sesion_maestro">
          <a href="usuariosesion" onClick={handleNavigateToSesion}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistroMaestro;
