import { useEffect } from "react";
import "../CSS/juegos-frutas.css"; // Importar los estilos

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

  return (
<div className="Fondo">
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
