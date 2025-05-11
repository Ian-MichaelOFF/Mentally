import React, { useState, useEffect, useRef } from "react";
import "../CSS/SopaDeLetras.css"; // Asegúrate de que la ruta sea correcta
import cerebrin from "/logos/CEREBRITIN.png"; // Asegúrate de que la ruta sea correcta
import { ArrowLeft } from "lucide-react";

const SopaDeLetras: React.FC = () => {
  // Configuración inicial
  const gridSize = 10;

  // Palabras por nivel
  const words = {
    easy: ["gato", "perro", "sol"],
    medium: ["avion", "luna", "agua", "flor", "puerta"],
    hard: ["tecla", "codigo", "luz", "redes", "serpiente"],
  };

  // Mapeo de niveles de dificultad para la base de datos
  const dificultadMapping = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  // Estados
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<string>("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [grid, setGrid] = useState<string[][]>([]);
  const [filledGrid, setFilledGrid] = useState<string[][]>([]);
  const [currentSelection, setCurrentSelection] = useState<
    { row: number; col: number; letter: string }[]
  >([]);
  const [direction, setDirection] = useState<{
    dRow: number;
    dCol: number;
  } | null>(null);
  const [message, setMessage] = useState<string>("");
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [partidaGuardada, setPartidaGuardada] = useState<boolean>(false);

  // Referencias
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Función para guardar la partida en el backend
  const guardarPartida = async () => {
    try {
      // Evitar guardar múltiples veces la misma partida
      if (partidaGuardada) {
        console.log("La partida ya ha sido guardada");
        return;
      }

      const IDjuego = 1; // ID para Sopa de Letras
      const puntuacion = score;
      // Convertir la dificultad a formato español para la base de datos
      const dificultad =
        dificultadMapping[currentLevel as keyof typeof dificultadMapping];

      console.log("Guardando partida Sopa de Letras:", {
        IDjuego,
        dificultad,
        puntuacion,
      });

      const response = await fetch(
        "http://localhost:5000/api/guardar-partida",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IDjuego,
            dificultad,
            puntuacion,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error al guardar partida");
      console.log("Partida guardada exitosamente:", data);
      setPartidaGuardada(true);
    } catch (error) {
      console.error("Error al guardar partida:", error);
    }
  };

  // Función para iniciar el juego con un nivel de dificultad
  const setDifficulty = (level: string) => {
    console.log("Configurando nivel:", level);

    // Limpiar el temporizador anterior si existe
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setCurrentLevel(level);
    setSelectedWords([...words[level as keyof typeof words]]);
    setCurrentSelection([]);
    setDirection(null);
    setMessage("");
    setGameEnded(false);
    setFoundWords(new Set()); // Reiniciar palabras encontradas
    setScore(0); // Reiniciar puntaje
    setPartidaGuardada(false); // Reiniciar estado de guardado

    // Establecer tiempo según el nivel antes de iniciar el juego
    let initialTime = 60; // valor por defecto
    if (level === "easy") initialTime = 60;
    else if (level === "medium") initialTime = 45;
    else if (level === "hard") initialTime = 35;

    setTimeLeft(initialTime);
    console.log("Tiempo inicial establecido:", initialTime);

    // Iniciar el juego después de un pequeño retraso para asegurar que el tiempo se ha actualizado
    setTimeout(() => {
      setGameStarted(true);
    }, 50);
  };

  // Efecto para iniciar el juego cuando cambia el nivel
  useEffect(() => {
    if (gameStarted) {
      console.log("Iniciando nuevo juego con nivel:", currentLevel);

      const newGrid = createGrid(gridSize);
      const levelWords = words[currentLevel as keyof typeof words];
      levelWords.forEach((word) => placeWordInGrid(newGrid, word));
      setGrid(newGrid);

      // Completar la cuadrícula con letras aleatorias una sola vez
      const completedGrid = fillEmptyCells(newGrid);
      setFilledGrid(completedGrid);

      // Limpiar las clases en las celdas si existen (para reiniciar el juego)
      if (gridContainerRef.current) {
        const cells = gridContainerRef.current.children;
        for (let i = 0; i < cells.length; i++) {
          (cells[i] as HTMLElement).classList.remove("selected", "found");
        }
      }

      // Reiniciar el temporizador con el tiempo adecuado según el nivel
      if (currentLevel === "easy") setTimeLeft(60);
      else if (currentLevel === "medium") setTimeLeft(45);
      else if (currentLevel === "hard") setTimeLeft(35);

      // Iniciar el timer con un pequeño retraso para asegurar que el estado se ha actualizado
      setTimeout(() => {
        startTimer();
      }, 100);
    }
  }, [gameStarted, currentLevel]); // Cambiar dependencia de selectedWords a currentLevel

  // Función para crear una cuadrícula vacía
  const createGrid = (size: number): string[][] => {
    const newGrid: string[][] = [];
    for (let i = 0; i < size; i++) {
      newGrid[i] = [];
      for (let j = 0; j < size; j++) {
        newGrid[i][j] = "";
      }
    }
    return newGrid;
  };

  // Función para llenar las celdas vacías con letras aleatorias
  const fillEmptyCells = (grid: string[][]): string[][] => {
    const filledGrid = JSON.parse(JSON.stringify(grid)); // Copia profunda de la cuadrícula

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (filledGrid[i][j] === "") {
          // Generar una letra aleatoria (A-Z)
          filledGrid[i][j] = String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          );
        }
      }
    }

    return filledGrid;
  };

  // Función para colocar una palabra en la cuadrícula
  const placeWordInGrid = (grid: string[][], word: string): void => {
    const directions = ["horizontal", "vertical", "diagonal"];
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      let startRow: number, startCol: number;

      if (direction === "horizontal") {
        startRow = Math.floor(Math.random() * gridSize);
        startCol = Math.floor(Math.random() * (gridSize - word.length));
        let canPlace = true;

        for (let i = 0; i < word.length; i++) {
          // Comprobar si la celda está vacía o ya tiene la misma letra
          if (
            grid[startRow][startCol + i] !== "" &&
            grid[startRow][startCol + i] !== word[i].toLowerCase()
          ) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow][startCol + i] = word[i].toLowerCase();
          }
          placed = true;
        }
      } else if (direction === "vertical") {
        startRow = Math.floor(Math.random() * (gridSize - word.length));
        startCol = Math.floor(Math.random() * gridSize);
        let canPlace = true;

        for (let i = 0; i < word.length; i++) {
          // Comprobar si la celda está vacía o ya tiene la misma letra
          if (
            grid[startRow + i][startCol] !== "" &&
            grid[startRow + i][startCol] !== word[i].toLowerCase()
          ) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol] = word[i].toLowerCase();
          }
          placed = true;
        }
      } else if (direction === "diagonal") {
        startRow = Math.floor(Math.random() * (gridSize - word.length));
        startCol = Math.floor(Math.random() * (gridSize - word.length));
        let canPlace = true;

        for (let i = 0; i < word.length; i++) {
          // Comprobar si la celda está vacía o ya tiene la misma letra
          if (
            grid[startRow + i][startCol + i] !== "" &&
            grid[startRow + i][startCol + i] !== word[i].toLowerCase()
          ) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[startRow + i][startCol + i] = word[i].toLowerCase();
          }
          placed = true;
        }
      }

      attempts++;
    }

    if (!placed) {
      console.log(`No se pudo colocar la palabra: ${word}`);
    }
  };

  // Función para iniciar el temporizador
  const startTimer = () => {
    console.log("Iniciando temporizador con tiempo:", timeLeft);

    // Asegurarse de limpiar cualquier temporizador existente antes de iniciar uno nuevo
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Asegurarse de que el tiempo inicial sea correcto según el nivel
    let initialTime;
    if (currentLevel === "easy") initialTime = 60;
    else if (currentLevel === "medium") initialTime = 45;
    else if (currentLevel === "hard") initialTime = 35;

    // Actualizar el tiempo si es diferente del que debería ser
    if (timeLeft !== initialTime) {
      setTimeLeft(initialTime);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        console.log("Tiempo restante:", prevTime - 1);
        if (prevTime <= 1) {
          // Se acabó el tiempo
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setMessage("⏰ ¡Se acabó el tiempo!");
          setGameEnded(true);

          // Calcular puntuación basada en palabras encontradas
          const finalScore = foundWords.size * 10;
          setScore(finalScore);

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Función para seleccionar una celda
  const selectCell = (row: number, col: number, letter: string) => {
    // Si el juego ha terminado, no hacer nada
    if (gameEnded) return;

    // Obtener todas las celdas de la cuadrícula
    const cells = gridContainerRef.current?.children;
    if (!cells) return;

    const cellIndex = row * gridSize + col;
    const cell = cells[cellIndex] as HTMLElement;

    // Si la celda ya está seleccionada, no hacer nada
    if (cell.classList.contains("selected")) return;

    // Si es la segunda celda seleccionada, establecer la dirección
    if (currentSelection.length === 1) {
      setDirection({
        dRow: row - currentSelection[0].row,
        dCol: col - currentSelection[0].col,
      });
    }

    // Si ya hay más de una celda seleccionada, verificar que la nueva celda siga la dirección
    if (currentSelection.length > 1 && direction) {
      const last = currentSelection[currentSelection.length - 1];
      if (
        row - last.row !== direction.dRow ||
        col - last.col !== direction.dCol
      ) {
        clearSelection();
        return;
      }
    }

    // Añadir la celda a la selección actual
    const newSelection = [...currentSelection, { row, col, letter }];
    setCurrentSelection(newSelection);
    cell.classList.add("selected");

    // Verificar si la selección forma una palabra
    const formedWord = newSelection.map((c) => c.letter.toLowerCase()).join("");
    const reversed = formedWord.split("").reverse().join("");

    // Verificar si la palabra está en la lista de palabras seleccionadas (no encontradas aún)
    const wordToFind = selectedWords.find(
      (word) => word === formedWord || word === reversed
    );

    if (wordToFind && !foundWords.has(wordToFind)) {
      // Actualizar conjunto de palabras encontradas
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(wordToFind);
      setFoundWords(newFoundWords);

      setMessage(`🎉 ¡Encontraste: ${wordToFind}!`);

      // Actualizar la lista de palabras restantes
      const updatedWords = selectedWords.filter((w) => w !== wordToFind);
      setSelectedWords(updatedWords);

      // Marcar las celdas como encontradas
      newSelection.forEach((sel) => {
        const index = sel.row * gridSize + sel.col;
        cells[index].classList.add("found");
      });

      // Limpiar la selección
      clearSelection(true);

      // Verificar si se encontraron todas las palabras
      if (updatedWords.length === 0) {
        // Calcular el puntaje (tiempo restante * 2 + palabras encontradas * 10)
        const finalScore = timeLeft * 2 + newFoundWords.size * 10;
        setScore(finalScore);

        setMessage(`🎉 ¡Todas las palabras encontradas!`);
        setGameEnded(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  // Función para limpiar la selección actual
  const clearSelection = (preserveFound = false) => {
    const cells = gridContainerRef.current?.children;
    if (!cells) return;

    currentSelection.forEach(({ row, col }) => {
      const index = row * gridSize + col;
      const cell = cells[index] as HTMLElement;
      cell.classList.remove("selected");
    });

    setCurrentSelection([]);
    setDirection(null);
  };

  // Función para mostrar las opciones de fin de juego
  const showEndOptions = () => {
    const totalWords = words[currentLevel as keyof typeof words].length;
    const foundWordsCount = foundWords.size;

    // Calcular el tiempo utilizado
    const maxTime =
      currentLevel === "easy" ? 60 : currentLevel === "medium" ? 45 : 35;
    const timeUsed = maxTime - timeLeft;

    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;
    const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (foundWordsCount === totalWords) {
      setMessage(
        `🎉 **¡Encontraste todas las palabras en ${formattedTime}!** tu puntaje fue: ${score}`
      );
    } else {
      setMessage(
        `🔍 Encontraste ${foundWordsCount} de ${totalWords} palabras. Te faltaron ${
          totalWords - foundWordsCount
        }. Tiempo transcurrido: ${formattedTime}`
      );
    }
  };

  // Efecto para mostrar las opciones de fin de juego cuando termina el juego
  useEffect(() => {
    if (gameEnded) {
      showEndOptions();
    }
  }, [gameEnded]);

  // Efecto para guardar la partida cuando el juego termina y hay un puntaje
  useEffect(() => {
    if (gameEnded && score > 0 && !partidaGuardada) {
      console.log("Juego terminado, guardando partida con puntaje:", score);
      setTimeout(() => {
        guardarPartida();
      }, 500);
    }
  }, [gameEnded, score, partidaGuardada]);

  // Efecto para limpiar el temporizador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Función para volver a jugar
  const playAgain = () => {
    // Limpiar explícitamente todas las celdas
    if (gridContainerRef.current) {
      const cells = gridContainerRef.current.children;
      for (let i = 0; i < cells.length; i++) {
        (cells[i] as HTMLElement).classList.remove("selected", "found");
      }
    }

    // Limpiar explícitamente el temporizador antes de reiniciar
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reiniciar el juego con la misma dificultad
    setGameEnded(false);
    setPartidaGuardada(false);

    // Primero reseteamos a un juego no iniciado para forzar una reconfiguración completa
    setGameStarted(false);

    // Usamos setTimeout para asegurar que el estado se actualice antes de iniciar un nuevo juego
    setTimeout(() => {
      setDifficulty(currentLevel);
    }, 50);
  };

  // Función para salir del juego
  const exitGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameStarted(false);
    setMessage("👋 ¡Gracias por jugar!");
    setSelectedWords([]);
    setCurrentSelection([]);
    setDirection(null);
    setGameEnded(false);
    setFoundWords(new Set());
    setScore(0);
    setPartidaGuardada(false);
  };

  // Formatear el tiempo para mostrarlo
  const formatTimeDisplay = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  // Renderizar las celdas de la cuadrícula
  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const letter = filledGrid[i]?.[j] || "";
        cells.push(
          <div key={`${i}-${j}`} onClick={() => selectCell(i, j, letter)}>
            {letter}
          </div>
        );
      }
    }
    return cells;
  };
  const goBack = () => {
    window.history.back(); // Función para regresar a la página anterior
  };

  return (
    <div id="game-wrapper">
      <button
        onClick={goBack}
        className="back-buttonMemoryMst"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
      <div id="game-container">
        <h1>Sopa de Letras</h1>
        <img src={cerebrin} alt="Logo del juego" id="game-logo" />

        {/* Mensaje de bienvenida */}
        {!gameStarted && (
          <div id="welcome-description">
            <p>
              👋 <strong>Bienvenido</strong>, elige un nivel de dificultad y
              encuentra todas las palabras escondidas en la sopa de letras.
            </p>
          </div>
        )}

        {/* Botones de dificultad */}
        {!gameStarted && (
          <div id="difficulty">
            <button onClick={() => setDifficulty("easy")}>Fácil</button>
            <button onClick={() => setDifficulty("medium")}>Medio</button>
            <button onClick={() => setDifficulty("hard")}>Difícil</button>
          </div>
        )}

        {/* Temporizador */}
        {gameStarted && !gameEnded && (
          <div id="timer">
            <p>
              Tiempo restante:{" "}
              <span id="time-left">{formatTimeDisplay(timeLeft)}</span>
            </p>
          </div>
        )}

        {/* Cuadrícula de juego */}
        {gameStarted && filledGrid.length > 0 && (
          <div id="grid-container" ref={gridContainerRef}>
            {renderGrid()}
          </div>
        )}

        {/* Lista de palabras a encontrar */}
        {gameStarted && (
          <div
            id="words-to-find"
            style={{ display: gameStarted ? "block" : "none" }}
          >
            <h3>Palabras a Buscar:</h3>
            <ul id="word-list">
              {selectedWords.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Mensaje de feedback */}
        <div id="message" dangerouslySetInnerHTML={{ __html: message }}></div>

        {/* Opciones de fin de juego */}
        {gameEnded && (
          <div id="end-options">
            <button id="play-again-button" onClick={playAgain}>
              Jugar de nuevo
            </button>
            <button id="exit-button" onClick={exitGame}>
              Salir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SopaDeLetras;
