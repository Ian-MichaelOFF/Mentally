import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import "../CSS/memorama_css.css";

const Memorama = () => {
  // Player info states
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  
  // Game control states
  const [showInfo, setShowInfo] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [difficulty, setDifficulty] = useState("facil");
  const [saveStatus, setSaveStatus] = useState("");
  
  // Refs for cards and timer
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const secondCardRef = useRef<HTMLDivElement | null>(null);
  const boardLockedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef(0);
  const saveAttemptedRef = useRef(false);
  const totalMatchesRef = useRef(0);


  // Función para guardar la partida en el backend
  const guardarPartida = async () => {
    // Evitar guardar partida si ya se intentó
    if (saveAttemptedRef.current) {
      console.log('Guardado ya intentado, evitando duplicado');
      return;
    }
    
    saveAttemptedRef.current = true;
    
    try {
      const IDjuego = 4; 
      const puntuacion = scoreRef.current;
      
      console.log('Enviando datos al servidor:', {
        IDjuego,
        dificultad: difficulty,
        puntuacion
      });
      
      const response = await fetch('http://localhost:5000/api/guardar-partida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IDjuego,
          dificultad: difficulty,
          puntuacion
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (response.ok) {
        setSaveStatus("Partida guardada correctamente");
      } else {
        setSaveStatus(`Error: ${data.message || 'No se pudo guardar la partida'}`);
        console.error('Error desde el servidor:', data);
      }
    } catch (error) {
      console.error('Error al guardar partida:', error);
      setSaveStatus("Error al conectar con el servidor");
    }
  };

  // Go back function
  const goBack = () => {
    window.history.back();
  };

  // Function to start the game
  const startGame = (columns: number, rows: number, difficultyLevel: string) => {
    saveAttemptedRef.current = false;
    
    const totalCards = columns * rows;
    const matchesNeeded = totalCards / 2;
    
    console.log(`Game started with ${columns}x${rows} grid (${totalCards} cards, ${matchesNeeded} matches needed)`);
    console.log(`Setting totalMatches to ${matchesNeeded}`);
    
    // Reset game state
    setDifficulty(difficultyLevel);
    setMatches(0);
    setAttempts(0);
    setTotalMatches(matchesNeeded);
    totalMatchesRef.current = matchesNeeded;
    setTime(0);
    setSaveStatus("");
    scoreRef.current = 0;
    
    setShowInfo(true);
    setShowBoard(true);
    setShowSelector(false);
    setShowCompleted(false);
    setShowFailed(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    firstCardRef.current = null;
    secondCardRef.current = null;
    boardLockedRef.current = false;

    setTimeout(() => {
      const boardElement = document.getElementById("game-board") as HTMLDivElement;
      boardRef.current = boardElement;
      
      if (boardElement) {
        boardElement.innerHTML = "";
        boardElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        boardElement.setAttribute("data-total-matches", matchesNeeded.toString());
        
        let numbers = Array.from({length: matchesNeeded}, (_, i) => i + 1);
        let cardValues = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
        
        console.log(`Creating ${cardValues.length} cards for ${matchesNeeded} matches`);
        
        cardValues.forEach(value => {
          let card = document.createElement("div");
          card.classList.add("card");
          card.dataset.value = value.toString();
          
          let front = document.createElement("div");
          front.classList.add("card-front");
          
          let back = document.createElement("div");
          back.classList.add("card-back");
          
          let img = document.createElement("img");
          img.src = `/logos/${value}.png`;
          img.alt = `Card ${value}`;
          
          back.appendChild(img);
          card.appendChild(front);
          card.appendChild(back);
          
          card.addEventListener("click", function() {
            flipCard(this as HTMLDivElement);
          });
          
          boardElement.appendChild(card);
        });
      }
    }, 100);

    if (difficultyLevel === "facil") {
      startChronometer();
    } else {
      startCountdownTimer(difficultyLevel);
    }
  };

  // Function to flip a card
  const flipCard = (card: HTMLDivElement) => {
    if (boardLockedRef.current || card.classList.contains("flipped")) {
      return;
    }

    card.classList.add("flipped");

    if (!firstCardRef.current) {
      firstCardRef.current = card;
      return;
    }

    secondCardRef.current = card;
    boardLockedRef.current = true;
    
    setAttempts(prevAttempts => prevAttempts + 1);
    
    checkForMatch();
  };

  // Function to check if cards match
  const checkForMatch = () => {
    if (!firstCardRef.current || !secondCardRef.current) return;
    
    const isMatch = firstCardRef.current.dataset.value === secondCardRef.current.dataset.value;
    
    if (isMatch) {
      disableCards();
      
      setMatches(prevMatches => {
        const newMatches = prevMatches + 1;
        console.log(`Matches found: ${newMatches} of ${totalMatches} needed`);
        
        if (newMatches >= totalMatchesRef.current) {
          console.log(`All matches found: ${newMatches}/${totalMatchesRef.current}, completing game`);
          setTimeout(() => {
            boardLockedRef.current = true;
            gameCompleted();
        }, 300);
      }
        
        return newMatches;
      });
    } else {
      unflipCards();
    }
  };

  // Function for game completion
  const gameCompleted = () => {
    console.log("Game completed called");
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const calculatedScore = Math.max(0, totalMatches * 10 - attempts * 3);
    
    setFinalScore(calculatedScore);
    scoreRef.current = calculatedScore;
    
    console.log("Puntaje calculado:", calculatedScore);
    
    guardarPartida();
    
    if (boardRef.current) {
      boardRef.current.innerHTML = "";
    }
    
    setShowInfo(false);
    setShowBoard(false);
    setShowCompleted(true);
    console.log("Game completion screen shown with score:", scoreRef.current);
  };

  // Function to disable matching cards
  const disableCards = () => {
    if (firstCardRef.current) {
      firstCardRef.current.style.pointerEvents = "none";
      firstCardRef.current.classList.add("matched");
    }
    
    if (secondCardRef.current) {
      secondCardRef.current.style.pointerEvents = "none";
      secondCardRef.current.classList.add("matched");
    }
    
    resetBoardState();
  };

  // Function to unflip non-matching cards
  const unflipCards = () => {
    setTimeout(() => {
      if (firstCardRef.current) firstCardRef.current.classList.remove("flipped");
      if (secondCardRef.current) secondCardRef.current.classList.remove("flipped");
      resetBoardState();
    }, 1000);
  };

  // Reset board state after a turn
  const resetBoardState = () => {
    firstCardRef.current = null;
    secondCardRef.current = null;
    boardLockedRef.current = false;
  };

  // Start chronometer (easy mode)
  const startChronometer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  // Start countdown timer (medium and hard modes)
  const startCountdownTimer = (difficultyLevel: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    let initialTime = difficultyLevel === "medio" ? 90 : 60;
    setTimeRemaining(initialTime);
    
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
      
      setTimeRemaining(prevTimeRemaining => {
        const newTimeRemaining = prevTimeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          gameOver();
        }
        
        return newTimeRemaining;
      });
    }, 1000);
  };

  // Game over function
  const gameOver = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const calculatedScore = Math.max(0, matches * 10 - attempts * 3);
    
    setFinalScore(calculatedScore);
    scoreRef.current = calculatedScore;
    
    setTimeout(() => {
      guardarPartida();
      
      if (boardRef.current) {
        boardRef.current.innerHTML = "";
      }
      
      setShowInfo(false);
      setShowBoard(false);
      setShowCompleted(false);
      setShowFailed(true);
    }, 300);
  };

  // Reset game function
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    saveAttemptedRef.current = false;
    
    setShowSelector(true);
    setShowInfo(false);
    setShowBoard(false);
    setShowCompleted(false);
    setShowFailed(false);
    setSaveStatus("");
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Get message based on score
  const getScoreMessage = () => {
    if (finalScore <= 0) {
      return "¡Sigue practicando! 💪";
    } else if (finalScore < 5) {
      return "¡Buen trabajo! 👍";
    } else if (finalScore < 10) {
      return "¡Muy bien hecho! 🌟";
    } else {
      return "¡Excelente! ¡Eres un genio! 🏆";
    }
  };

  return (
    <div className="memorama-container">
      <button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>      
      {showSelector && (
        <div className="difficulty-selector">
          <h1 className="game-title">Memorama</h1>
          <p className="instrucciones_mem">¡Haz clic en las cartas y descubre las parejas escondidas!</p>
          <img src="logos/m1.png" alt="Logo Memorama" />
          <p className="difficulty-title">Elige una dificultad:</p>
          <div className="difficulty-buttons">
            <button
              className="difficulty-button easy-button"
              onClick={() => startGame(4, 2, "facil")}
            >
              Fácil
            </button>
            <button
              className="difficulty-button medium-button"
              onClick={() => startGame(4, 3, "medio")}
            >
              Medio
            </button>
            <button
              className="difficulty-button hard-button"
              onClick={() => startGame(4, 3, "dificil")}
            >
              Difícil
            </button>
          </div>
        </div>
      )}

      {showInfo && (
        <div className="game-info">
          <div className="game-stats">
            <div>
              <span className="info-label">Intentos:</span> {attempts}
            </div>
            <div>
              <span className="info-label">Tiempo:</span> {timeRemaining > 0 ? formatTime(timeRemaining) : formatTime(time)}
            </div>
          </div>
        </div>
      )}
      
      {showBoard && (
        <div className="board-container">
          <div 
            id="game-board" 
            className="game-board"
            style={{ 
              gridTemplateColumns: difficulty === "dificil" ? "repeat(5, 1fr)" : "repeat(4, 1fr)" 
            }}
            data-total-matches={totalMatches}
          ></div>
        </div>
      )}

      {showCompleted && (
        <div className="result-panel">
          <h2 className="success-title">¡Felicidades!</h2>
          <p className="result-text">
            Has completado el juego en <strong>{attempts}</strong> intentos 
            y un tiempo de <strong>{formatTime(time)}</strong>
          </p>
          <p className="score-text">
            Puntaje final: {finalScore}
          </p>
          <p className="message-text">{getScoreMessage()}</p>
          {saveStatus && (
            <p className={saveStatus.includes("Error") ? "error-message" : "success-message"} 
               style={{ color: saveStatus.includes("Error") ? 'red' : 'green' }}>
              {saveStatus}
            </p>
          )}
          <button
            className="play-again-button"
            onClick={resetGame}
          >
            Jugar de nuevo
          </button>
        </div>
      )}

      {showFailed && (
        <div className="result-panel">
          <h2 className="fail-title">¡Tiempo agotado!</h2>
          <p className="result-text">
            Se terminó el tiempo, ¡inténtalo de nuevo!
          </p>
          <p className="score-text">
            Puntaje final: {finalScore}
          </p>
          {saveStatus && (
            <p className={saveStatus.includes("Error") ? "error-message" : "success-message"} 
               style={{ color: saveStatus.includes("Error") ? 'red' : 'green' }}>
              {saveStatus}
            </p>
          )}
          <button
            className="play-again-button"
            onClick={resetGame}
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};

export default Memorama;