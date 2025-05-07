import { useState, useEffect } from "react";
import "../CSS/Recuperar-ContraseñaAlum.css";
import { useNavigate, Link } from "react-router-dom";

interface FormData {
  Usuario: string;
  Pregunta_seguridad: string;
  Respuesta: string;
  nuevaContraseña: string;
  confirmarNuevaContraseña: string;
}

const RecuperarContraseñaAlumno = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    Usuario: "",
    Pregunta_seguridad: "",
    Respuesta: "",
    nuevaContraseña: "",
    confirmarNuevaContraseña: ""
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [preguntaObtenida, setPreguntaObtenida] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Si el usuario cambia después de haber obtenido una pregunta, reset el estado
    if (e.target.name === "Usuario" && preguntaObtenida) {
      setPreguntaObtenida(false);
      setFormData(prev => ({
        ...prev,
        Pregunta_seguridad: ""
      }));
    }
  };

  // Función para obtener la pregunta de seguridad cuando se pierde el foco del campo usuario
  const handleUsuarioBlur = async () => {
    if (formData.Usuario.trim() && !preguntaObtenida) {
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:5000/obtener-pregunta/${formData.Usuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        
        if (response.ok) {
          setPreguntaObtenida(true);
          setFormData(prev => ({
            ...prev,
            Pregunta_seguridad: data.pregunta
          }));
          setError("");
        } else {
          // No mostramos error si no encuentra el usuario, solo lo dejamos continuar
          console.log("No se encontró el usuario, pero permitimos continuar");
        }
      } catch (err) {
        console.error("Error al obtener pregunta:", err);
      } finally {
        setCargando(false);
      }
    }
  };

  const handleSubmitValidacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
  
    try {
      const response = await fetch("http://localhost:5000/validar-recuperacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Usuario: formData.Usuario,
          Pregunta_seguridad: formData.Pregunta_seguridad,
          Respuesta: formData.Respuesta
        })
      });
  
      const resultado = await response.json();
  
      if (!response.ok) {
        throw new Error(resultado.message || "Datos incorrectos");
      }
  
      // Verificación exitosa
      setMensaje("¡Datos validados correctamente! Ahora puedes cambiar tu contraseña.");
      setStep(2);
    } catch (error) {
      console.error("Error en validación:", error);
      setError(
        `Error: ${
          error instanceof Error ? error.message : "Datos incorrectos. Por favor verifica."
        }`
      );
    } finally {
      setCargando(false);
    }
  };

  const handleSubmitNuevaContraseña = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (formData.nuevaContraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setCargando(false);
      return;
    }

    if (formData.nuevaContraseña !== formData.confirmarNuevaContraseña) {
      setError("Las contraseñas no coinciden.");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/actualizar-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Usuario: formData.Usuario,
          nuevaContraseña: formData.nuevaContraseña
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar contraseña");
      }

      setMensaje(data.message || "¡Contraseña actualizada exitosamente!");
      
      // Esperar 2 segundos antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/FormularioAlum");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar contraseña");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="formularioregist">
      <nav className="navegacionbar">
        <div className="logoregist">
          MENTALLY
          <img src="/logos/cerebro.png" alt="Logo del sitio" />
        </div>
        <div className="texto-bienvenida">RECUPERA TU ACCESO!</div>
      </nav>

      <div className="formulario_registro">
        {error && <div className="error-message">{error}</div>}
        {mensaje && <div className="success-message">{mensaje}</div>}

        {step === 1 ? (
          <form onSubmit={handleSubmitValidacion}>
            <h2>Recuperar Contraseña</h2>

            <div className="CrearUsuario">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                name="Usuario"
                required
                placeholder="Tu usuario registrado"
                value={formData.Usuario}
                onChange={handleChange}
                onBlur={handleUsuarioBlur}
              />
            </div>

            <div className="preguntaseguridad">
              <label htmlFor="security-question">Pregunta de Seguridad:</label>
              <select
                id="security-question"
                name="Pregunta_seguridad"
                required
                value={formData.Pregunta_seguridad}
                onChange={handleChange}
                disabled={preguntaObtenida}
              >
                <option value="" disabled>
                  {cargando ? "Cargando pregunta..." : "Selecciona tu pregunta de seguridad"}
                </option>
                <option value="¿Cuál es el nombre de tu mascota?">
                  ¿Cuál es el nombre de tu mascota?
                </option>
                <option value="¿Cuál es el apellido de tu madre?">
                  ¿Cuál es el apellido de tu madre?
                </option>
                <option value="¿Cuál es tu color favorito?">
                  ¿Cuál es tu color favorito?
                </option>
              </select>

              <label htmlFor="security-answer">Respuesta:</label>
              <input
                type="text"
                id="security-answer"
                name="Respuesta"
                placeholder="Tu respuesta"
                required
                value={formData.Respuesta}
                onChange={handleChange}
              />
            </div>

            <div className="Crearboton">
              <button className="Botocrear" type="submit" disabled={cargando}>
                {cargando ? "Validando..." : "Validar Datos"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitNuevaContraseña}>
            <h2>Crear Nueva Contraseña</h2>

            <div className="info-usuario">
              <p><strong>Usuario:</strong> {formData.Usuario}</p>
            </div>

            <div className="CrearContraseña">
              <label htmlFor="nueva-contraseña">Nueva Contraseña:</label>
              <input
                type="password"
                id="nueva-contraseña"
                name="nuevaContraseña"
                required
                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                value={formData.nuevaContraseña}
                onChange={handleChange}
                minLength={6}
              />
            </div>

            <div className="ConfirmarContraseña">
              <label htmlFor="confirmar-nueva-contraseña">Confirmar Nueva Contraseña:</label>
              <input
                type="password"
                id="confirmar-nueva-contraseña"
                name="confirmarNuevaContraseña"
                required
                placeholder="Confirma tu nueva contraseña"
                value={formData.confirmarNuevaContraseña}
                onChange={handleChange}
              />
            </div>

            <div className="Crearboton">
              <button className="Botocrear" type="submit" disabled={cargando}>
                {cargando ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          </form>
        )}

        <div className="usuariosesion">
          <Link to="/FormularioAlum">Volver a Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContraseñaAlumno;