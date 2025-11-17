import { useState } from "react";
import "../CSS/recuperacionMaster.css"; // Asumiendo que usamos los mismos estilos
import { useNavigate, Link } from "react-router-dom";

interface FormData {
  correo: string;
  fechaNacimiento: string;
  nuevaContraseña: string;
  confirmarNuevaContraseña: string;
}

const RecuperarContraseñaMaestro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    correo: "",
    fechaNacimiento: "",
    nuevaContraseña: "",
    confirmarNuevaContraseña: ""
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [correoVerificado, setCorreoVerificado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Si el correo cambia después de haber sido verificado, resetear el estado
    if (e.target.name === "correo" && correoVerificado) {
      setCorreoVerificado(false);
    }
  };

  // Función para verificar si el correo existe cuando pierde el foco
  const handleCorreoBlur = async () => {
    if (formData.correo.trim() && !correoVerificado) {
      try {
        setCargando(true);
        const response = await fetch(`http://localhost:5000/verificar-correo-maestro/${formData.correo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        
        if (response.ok && data.existe) {
          setCorreoVerificado(true);
          setError("");
          setMensaje("Correo electrónico verificado.");
        } else {
          setError("No hay una cuenta asociada a este correo.");
        }
      } catch (err) {
        console.error("Error al verificar correo:", err);
        setError("Error al verificar el correo.");
      } finally {
        setCargando(false);
      }
    }
  };

  const handleSubmitValidacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setCargando(true);
  
    try {
      const response = await fetch("http://localhost:5000/validar-recuperacion-maestro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: formData.correo,
          fechaNacimiento: formData.fechaNacimiento
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
    setMensaje("");
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
      const response = await fetch("http://localhost:5000/api/actualizar-password-maestro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: formData.correo,
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
        navigate("/FormularioMaestro");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error al actualizar contraseña");
    } finally {
      setCargando(false);
    }
  };

  const formatDateForInput = (date: string) => {
    // Asegurarse de que la fecha cumpla con el formato YYYY-MM-DD para input type="date"
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="formulario_maestro">
      <nav className="navbarra">
        <div className="logomentally">
          <img src="/logos/mascota2.png" alt="Logo del sitio" />
          MENTALLY
        </div>
        <div className="anuncio_maestro">RECUPERA TU ACCESO, MAESTRO
           <img src="/logos/tc3v2.png" alt="Logo del anuncio" />
        </div>
      </nav>

      <div className="forma_form_maestro">
        {error && <div className="error-message">{error}</div>}
        {mensaje && <div className="success-message">{mensaje}</div>}

        {step === 1 ? (
          <form onSubmit={handleSubmitValidacion}>
            <h2>Recuperar Contraseña - Maestros</h2>

            <div className="campo_form_maestro">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                required
                placeholder="Tu correo registrado"
                value={formData.correo}
                onChange={handleChange}
                onBlur={handleCorreoBlur}
              />
            </div>

            <div className="campo_form_maestro">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                required
                value={formatDateForInput(formData.fechaNacimiento)}
                onChange={handleChange}
              />
              <small><br></br>Debe coincidir con la fecha registrada en el sistema</small>
            </div>

            <div className="boton_validar">
              <button 
                className="boton_validar_datos_maestro" 
                type="submit" 
                disabled={cargando || !correoVerificado}
              >
                {cargando ? "Validando..." : "Validar Datos"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitNuevaContraseña}>
            <h2>Crear Nueva Contraseña</h2>

            <div className="info-usuario">
              <p><strong>Correo:</strong> {formData.correo}</p>
            </div>

            <div className="campo_form_maestro">
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

            <div className="campo_form_maestro">
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

            <div className="boton_actualizar">
              <button className="boton_actualizar_datos_maestro" type="submit" disabled={cargando}>
                {cargando ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          </form>
        )}

        <div className="inicio_sesion_maestro">
          <Link to="/Formulario-Mast">Volver a Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContraseñaMaestro;