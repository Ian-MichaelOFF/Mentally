import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import "../CSS/memorama_css.css";

const Memorama = () => {
  // Player info states
  const [playerName, setPlayerName] = useState("Rafael Anaya");
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
  
  // Refs for cards and timer
  const firstCardRef = useRef(null);
  const secondCardRef = useRef(null);
  const boardLockedRef = useRef(false);
  const timerRef = useRef(null);
  const boardRef = useRef(null);

  // Go back function
  const goBack = () => {
    window.history.back();
  };

  // Function to start the game
  const startGame = (columns, rows, difficultyLevel) => {
    // Calculate total number of matches needed
    const totalCards = columns * rows;
    const matchesNeeded = totalCards / 2;
    
    console.log(`Game started with ${columns}x${rows} grid (${totalCards} cards, ${matchesNeeded} matches needed)`);
    
    // Reset game state with all values
    setShowInfo(true);
    setShowBoard(true);
    setShowSelector(false);
    setShowCompleted(false);
    setShowFailed(false);
    setDifficulty(difficultyLevel);
    setMatches(0);
    setAttempts(0);
    setTotalMatches(matchesNeeded);
    setTime(0);
    
    // Clear previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    firstCardRef.current = null;
    secondCardRef.current = null;
    boardLockedRef.current = false;

    // Use setTimeout to ensure the board element is available after state updates
    setTimeout(() => {
      // Configure the board
      const boardElement = document.getElementById("game-board");
      boardRef.current = boardElement;
      
      if (boardElement) {
        boardElement.innerHTML = "";
        boardElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        // Set a data attribute to ensure total matches is accessible in DOM
        boardElement.setAttribute("data-total-matches", matchesNeeded);
        
        // Create array of values for cards
        let numbers = Array.from({length: matchesNeeded}, (_, i) => i + 1);
        let cardValues = [...numbers, ...numbers].sort(() => Math.random() - 0.5);
        
        console.log(`Creating ${cardValues.length} cards for ${matchesNeeded} matches`);
        
        // Create cards on the board
        cardValues.forEach(value => {
          let card = document.createElement("div");
          card.classList.add("card");
          card.dataset.value = value;
          
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
          
          // Use a closure to capture the card element
          card.addEventListener("click", function() {
            flipCard(this);
          });
          
          boardElement.appendChild(card);
        });
      }
    }, 100);

    // Start timer based on difficulty
    if (difficultyLevel === "facil") {
      startChronometer();
    } else {
      startCountdownTimer(difficultyLevel);
    }
  };

  // Function to flip a card
  const flipCard = (card) => {
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
      
      // Increment matches counter and check for game completion
      setMatches(prevMatches => {
        const newMatches = prevMatches + 1;
        console.log(`Matches found: ${newMatches} of ${totalMatches} needed`);
        
        // Check if all matches have been found
        if (newMatches >= totalMatches) {
          console.log("All matches found, completing game");
          setTimeout(() => {
            gameCompleted();
          }, 500);
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
    }
    
    // Calculate final score - lower attempts is better
    const calculatedScore = Math.max(0, totalMatches * 10 - attempts * 3);
    setFinalScore(calculatedScore);
    
    // Using setTimeout to ensure state updates properly before showing completion screen
    setTimeout(() => {
      if (boardRef.current) {
        boardRef.current.innerHTML = "";
      }
      
      setShowInfo(false);
      setShowBoard(false);
      setShowCompleted(true);
      console.log("Game completion screen shown");
    }, 300);
  };

  // Function to disable matching cards
  const disableCards = () => {
    if (firstCardRef.current) {
      // We need to use a different approach since we're using function() { flipCard(this) }
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
  const startCountdownTimer = (difficultyLevel) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    let initialTime = difficultyLevel === "medio" ? 60 : 30;
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
    
    if (boardRef.current) {
      boardRef.current.innerHTML = "";
    }
    
    setShowInfo(false);
    setShowBoard(false);
    setShowCompleted(false);
    setShowFailed(true);
  };

  // Reset game function
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setShowSelector(true);
    setShowInfo(false);
    setShowBoard(false);
    setShowCompleted(false);
    setShowFailed(false);
  };

  // Format time
  const formatTime = (seconds) => {
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
  
  // Debug useEffect to monitor critical state changes
  useEffect(() => {
    console.log(`State update - Matches: ${matches}/${totalMatches}, ShowCompleted: ${showCompleted}`);
    // Add additional debug information
    if (matches === totalMatches && totalMatches > 0) {
      console.log("Match condition met for game completion");
    }
  }, [matches, totalMatches, showCompleted]);
  
  // Monitor totalMatches specifically to debug issues
  useEffect(() => {
    console.log(`Total matches required updated to: ${totalMatches}`);
  }, [totalMatches]);

  return (
    <div className="memorama-container">
      <button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
      
      <h1 className="game-title">Memorama</h1>
      
      {showSelector && (
        <div className="difficulty-selector">
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
              onClick={() => startGame(5, 4, "dificil")}
            >
              Difícil
            </button>
          </div>
        </div>
      )}

      {showInfo && (
        <div className="game-info">
          <div className="player-info">
            <span className="info-label">Jugador:</span> {playerName}
          </div>
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
            data-total-matches={totalMatches} // Add data attribute for debugging
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