import { useEffect } from "react";
import "../CSS/Juego_Anagramas.css"; // Importar estilos
import { ArrowLeft } from "lucide-react";

const Anagrama = () => {
  useEffect(() => {
    // Cargar la lógica del juego después de que el componente se monte
    const script = document.createElement("script");
    script.src = "/Juego_Anagramas.js"; // Ruta del script original
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
    <div className="Cuerpo_Anagramas">
      <button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="Logo_Anagramas">
      <h1>Anagramas</h1>
      </div>
      <div id="difficulty-container">
        <label htmlFor="difficulty">Elige la dificultad:</label>
        <select id="difficulty">
          <option value="easy">Baja</option>
          <option value="medium">Media</option>
          <option value="hard">Alta</option>
        </select>
      <div className="boton_iniciar_An">
        <button id="start-btn-Anagram">Iniciar Juego</button>
        </div>
      </div>

      <div id="game-container" style={{ display: "none" }}>
        <p id="round"></p>
        <p id="anagram"></p>
        <input className="input_anagramas"
          type="text"
          id="user-input"
          placeholder="Escribe la palabra..."
        />
        <button id="submit-btn">Comprobar</button>
        <p id="message"></p>
        <p id="timer"></p>
        <button id="exit-btn">Salir</button>
      </div>
    </div>
  );
};

export default Anagrama;
