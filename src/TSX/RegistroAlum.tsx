import { useState } from "react";
import "../CSS/RegistAlum.css";
import { useNavigate } from "react-router-dom";

const RegistroAlumno = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    Usuario: "",
    contraseña: "",
    confirmPassword: "",
    fechaNacimiento: "",
    Pregunta_seguridad: "",
    Respuesta: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.fechaNacimiento) {
      alert("Por favor ingresa tu fecha de nacimiento.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          Usuario: formData.Usuario,
          contraseña: formData.contraseña,
          fechaNacimiento: formData.fechaNacimiento,
          Pregunta_seguridad: formData.Pregunta_seguridad,
          Respuesta: formData.Respuesta
        })
      });

      const resultado = await response.json();
      
      if (response.ok) {
        alert(resultado.mensaje);
        navigate("/FormularioAlum");
      } else {
        alert(resultado.error || "Error al registrar usuario");
      }
    } catch (error) {
      alert("Error al enviar los datos: " + error);
    }
  };

  const handleNavigateToSesion = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    navigate("/FormularioAlum");
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
          <h2>Registro Alumno</h2>
          
          <div className="campo_form_alumno">
            <label htmlFor="nombre">Nombre:</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              required 
              placeholder="Tu nombre" 
              onChange={handleChange}
              value={formData.nombre}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="apellido">Apellido:</label>
            <input 
              type="text" 
              id="apellido" 
              name="apellido" 
              required 
              placeholder="Tu apellido" 
              onChange={handleChange}
              value={formData.apellido}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="name">Crear Usuario:</label>
            <input 
              type="text" 
              id="name" 
              name="Usuario" 
              required 
              placeholder="Usuario123" 
              onChange={handleChange}
              value={formData.Usuario}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
            <input 
              type="date" 
              id="fechaNacimiento" 
              name="fechaNacimiento" 
              required 
              min="2010-01-01"
              max="2019-12-31"
              onChange={handleChange}
              value={formData.fechaNacimiento}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="password">Crear Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              name="contraseña" 
              required 
              minLength={6}
              placeholder="6 caracteres" 
              onChange={handleChange}
              value={formData.contraseña}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="confirm-password">Confirmar Contraseña:</label>
            <input 
              type="password" 
              id="confirm-password" 
              name="confirmPassword" 
              required 
              minLength={6}
              placeholder="Contraseña123" 
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>
          
          <div className="campo_form_alumno">
            <label htmlFor="security-question">Pregunta de Seguridad:</label>
            <select 
              id="security-question" 
              name="Pregunta_seguridad" 
              required 
              onChange={handleChange}
              value={formData.Pregunta_seguridad}
              style={{fontSize: '19px' }}
            >
              <option value="" disabled>Selecciona una pregunta</option>
              <option value="pet">¿Cuál es el nombre de tu mascota?</option>
              <option value="mother-maiden">¿Cuál es el apellido de tu madre?</option>
              <option value="school">¿Cuál es tu color favorito?</option>
            </select>
            
            <label htmlFor="security-answer">Respuesta:</label>
            <input 
              type="text" 
              id="security-answer" 
              name="Respuesta" 
              placeholder="Tu respuesta" 
              required 
              onChange={handleChange}
              value={formData.Respuesta}
            />
          </div>
          
          <div className="crear_alumno">
            <button className="boton_crear_alumno" type="submit">Crear cuenta</button>
          </div>
        </form>

        <div className="inicio_sesion_alumno">
          <a href="usuariosesion" onClick={handleNavigateToSesion}>Ya tienes usuario? inicia sesión aquí!</a>
        </div>
      </div>
    </div>
  );
};

export default RegistroAlumno;