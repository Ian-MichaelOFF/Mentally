import { useEffect } from "react";
import "../CSS/juegos-frutas.css"; // Importar los estilos
import { ArrowLeft } from "lucide-react";

const FrutasMatematicas = () => {
  useEffect(() => {
    // Cargar la lógica del juego después de que el componente se monte
    const script = document.createElement("script");
    script.src = "/Frutas.js"; // Ruta del script original
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      document.body.removeChild(script);
    };
  }, []);
  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };

  return (
<div className="Fondo">
{/* Botón de retroceso */}
<button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
    <div className="game-container">
      <h1>Frutas Matemáticas</h1>

      <div className="level-selector">
        <button id="easy-btn">Sencillo</button>
        <button id="normal-btn">Normal</button>
        <button id="hard-btn">Difícil</button>
      </div>

      <div className="game-area">
        <div className="timer" id="timer">
          Tiempo: 0s
        </div>

        <div className="fruit-values" id="fruit-values"></div>

        <div className="equation" id="equation"></div>

        <div className="controls">
          <input type="number" id="answer-input" placeholder="Resultado" />
          <button id="verify-btn">Verificar</button>
        </div>

        <div className="feedback" id="feedback"></div>

        <div className="score">
          <span>
            Aciertos: <span id="correct-count">0</span>
          </span>
          <span>
            Errores: <span id="incorrect-count">0</span>
          </span>
        </div>
      </div>
    </div>
</div>
  );
};

export default FrutasMatematicas;
