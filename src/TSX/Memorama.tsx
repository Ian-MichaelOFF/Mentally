import { useEffect } from "react";
import "../CSS/memorama_css.css"; // Asegúrate de tener este archivo CSS disponible

const Memorama: React.FC = () => {
  useEffect(() => {
    // Cargar el script original del juego después de que el componente se monte
    const script = document.createElement("script");
    script.src = "/public/memorama_script.js"; // Ruta del script original
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      document.body.removeChild(script);
      document.body.style.backgroundColor = "#54FF8F";
    };
  }, []);

  return (
  <div className="memorama-page">
        <div id="selector-dificultad">
          <p id="seleccion">Elige una dificultad:</p>
          <button
            className="boton boton-facil"
            onClick={() => window.iniciarJuego(4, 2, "facil")}
          >
            Fácil
          </button>
          <button
            className="boton boton-medio"
            onClick={() => window.iniciarJuego(4, 3, "medio")}
          >
            Medio
          </button>
          <button
            className="boton boton-dificil"
            onClick={() => window.iniciarJuego(5, 4, "dificil")}
          >
            Difícil
          </button>
        </div>

        <div id="informacionPartida">
          <div id="jugador">
            Jugador: <span id="nombreJugador">Jugador</span>
          </div>
          <div id="intentos_tiempo">
            <div id="intentos">
              Intentos: <span id="numeroIntentos">0</span>
            </div>
            <div id="tiempo">
              Tiempo: <span id="tiempoJuego">0:00</span>
            </div>
          </div>
          <div id="tablero"></div>
        </div>

        <div id="pantallaCompletado">
          <p id="completo">
            ¡Bien hecho! Has completado la dificultad en{" "}
            <span id="numeroIntentosFinal">0</span> clicks y en un tiempo de{" "}
            <span id="tiempoJuegoFinal">0:00</span> segundos
          </p>
          <button
            className="boton-jugar-again"
            onClick={() => window.reiniciarJuego()}
          >
            Jugar de nuevo
          </button>
        </div>

        <div id="pantallaFallido">
          <p id="fallo">Se terminó el tiempo, ¡inténtalo de nuevo!</p>
          <button
            className="boton-reiniciar"
            onClick={() => window.reiniciarJuego()}
          >
            Reiniciar
          </button>
        </div>
      </div>
  );
};

export default Memorama;
