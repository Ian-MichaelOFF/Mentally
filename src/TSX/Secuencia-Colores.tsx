import React, { useState, useEffect, useRef } from 'react';
import '../CSS/SecuenciaColores.css';
import BrainImage from "/logos/Cerebrin.png";
import { ArrowLeft } from 'lucide-react';

// Tipo para los items de la secuencia
type SequenceItem = {
  index: number;
  color: number;
};

const SecuenciaColores: React.FC = () => {
  const [currentDifficulty, setCurrentDifficulty] = useState<string>("facil");
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [correct, setCorrect] = useState<number>(0);
  const [incorrect, setIncorrect] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(3);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>("waiting");
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const maxSequenceLength = 4;
  
  const difficultySettings: {[key: string]: number} = {
    facil: 3,
    normal: 4,
    dificil: 6,
  };
  
  const roundsPerDifficulty: {[key: string]: number} = {
    facil: 5,
    normal: 10,
    dificil: 3,
  };

  // Función para guardar la partida en el backend
  const guardarPartida = async () => {
    try {
      const IDjuego = 6;
      const puntuacion = finalScore;
      const dificultad = currentDifficulty;
      
      console.log('Guardando partida:', {
        IDjuego,
        dificultad,
        puntuacion
      });
      
      const response = await fetch('http://localhost:5000/api/guardar-partida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IDjuego,
          dificultad,
          puntuacion
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al guardar partida');
      console.log('Partida guardada:', data);
    } catch (error) {
      console.error('Error al guardar partida:', error);
    }
  };
  
  const startGame = () => {
    const newGridSize = difficultySettings[currentDifficulty];
    setGridSize(newGridSize);
    setShowGame(true);
    setCorrect(0);
    setIncorrect(0);
    setCurrentRound(1);
    setShowResults(false);
    setGameStatus("waiting");
  };
  
  const goBackToMenu = () => {
    setShowGame(false);
    setGameStatus("waiting");
    setShowResults(false);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDifficulty(e.target.value);
  };
  
  const renderGrid = () => {
    const cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      cells.push(
        <div 
          key={i}
          className="cell"
          data-index={i}
          onClick={() => gameStatus === "userTurn" && handleCellClick(i)}
        />
      );
    }
    return cells;
  };
  
  const generateSequence = () => {
    setGameStatus("waiting");
    const newSequence: SequenceItem[] = [];
    for (let i = 0; i < maxSequenceLength; i++) {
      const index = Math.floor(Math.random() * (gridSize * gridSize));
      const color = Math.floor(Math.random() * 4);
      newSequence.push({ index, color });
    }
    setSequence(newSequence);
    setUserSequence([]);
    
    setTimeout(() => {
      setGameStatus("showing");
      showSequence(newSequence);
    }, 1000);
  };
  
  const showSequence = (seq: SequenceItem[]) => {
    let delay = 0;
    
    seq.forEach(({ index, color }, i) => {
      setTimeout(() => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell) {
          cell.classList.add(`color-${color}`);
        }
      }, delay);
      
      setTimeout(() => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell) {
          cell.classList.remove(`color-${color}`);
        }
        
        if (i === seq.length - 1) {
          setTimeout(() => {
            setGameStatus("userTurn");
          }, 300);
        }
      }, delay + 500);
      
      delay += 800;
    });
  };
  
  const handleCellClick = (idx: number) => {
    if (gameStatus !== "userTurn") return;
    
    const newUserSequence = [...userSequence, idx];
    setUserSequence(newUserSequence);
    
    const currentStep = newUserSequence.length - 1;
    const currentSequenceItem = sequence[currentStep];
    
    const cell = document.querySelector(`.cell[data-index="${idx}"]`);
    if (cell) {
      cell.classList.add(`color-${currentSequenceItem.color}`, 'active');
      
      setTimeout(() => {
        cell.classList.remove(`color-${currentSequenceItem.color}`, 'active');
        
        if (newUserSequence.length === sequence.length) {
          setGameStatus("waiting");
          
          const allCorrect = newUserSequence.every(
            (clickedIndex, i) => clickedIndex === sequence[i].index
          );
          
          if (allCorrect) {
            setCorrect(prev => prev + 1);
          } else {
            setIncorrect(prev => prev + 1);
          }
          
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          
          if (nextRound > roundsPerDifficulty[currentDifficulty]) {
            const updatedCorrect = allCorrect ? correct + 1 : correct;
            const updatedIncorrect = allCorrect ? incorrect : incorrect + 1;
            const score = (updatedCorrect * 3) - (updatedIncorrect * 2);
            
            setFinalScore(score);
            setShowResults(true);
            
            setTimeout(() => {
              guardarPartida();
            }, 500);
          } else {
            setTimeout(() => {
              generateSequence();
            }, 1500);
          }
        }
      }, 300);
    }
  };
  
  useEffect(() => {
    if (showResults && finalScore !== 0) {
      guardarPartida();
    }
  }, [showResults, finalScore]);
  
  useEffect(() => {
    if (showGame && !showResults) {
      setTimeout(() => {
        generateSequence();
      }, 500);
    }
  }, [showGame, gridSize]);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="cuerpoJuegoColores">
      <button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>

      <div id="game-container">
        <h1>Secuencia de Colores</h1>
        <p>¡Recuerda la secuencia de colores y replícala cuando sea tu turno!</p>
        <img src={BrainImage} alt="Mascota Mentally" className="mascot" />
        
        {!showGame && !showResults ? (
          <div id="menu">
            <label htmlFor="difficulty">Dificultad:</label>
            <select 
              id="difficulty" 
              value={currentDifficulty}
              onChange={handleDifficultyChange}
            >
              <option value="facil">Fácil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
            </select>
            <button id="start-btn" onClick={startGame}>Iniciar Juego</button>
          </div>
        ) : showResults ? (
          <div className="results-screen">
            <h2>¡Juego Completado!</h2>
            <div className="results-content">
              <p>Nivel: <strong>
                {currentDifficulty === 'facil' ? 'Fácil' : 
                 currentDifficulty === 'normal' ? 'Normal' : 'Difícil'}
              </strong></p>
              <p>Aciertos: <span className="correct-count">{correct}</span></p>
              <p>Errores: <span className="incorrect-count">{incorrect}</span></p>
              <p className="final-score">Puntaje Final: <strong>{finalScore}</strong></p>
              {finalScore <= 0 ? (
                <p className="encouragement">¡Sigue practicando! 💪</p>
              ) : finalScore < 5 ? (
                <p className="encouragement">¡Buen trabajo! 👍</p>
              ) : (
                <p className="encouragement">¡Excelente! ¡Eres un genio! 🏆</p>
              )}
            </div>
            <button className="play-again-btn" onClick={goBackToMenu}>Jugar de nuevo</button>
          </div>
        ) : (
          <>
            <div id="back-arrow" className="visible">
              <i className="fa-solid fa-arrow-left" onClick={goBackToMenu}></i>
            </div>
            <div id="game">
              <div className="round-indicator">
                Ronda: {currentRound} / {roundsPerDifficulty[currentDifficulty]}
              </div>
              
              <div 
                id="grid" 
                ref={gridRef}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${gridSize}, 60px)` 
                }}
              >
                {renderGrid()}
              </div>
              
              <div id="score">
                <span id="correct">Aciertos: {correct}</span>
                <span id="incorrect">Errores: {incorrect}</span>
              </div>
              
              <div className="status-message">
                {gameStatus === "showing" && "Observa la secuencia..."}
                {gameStatus === "userTurn" && "¡Tu turno!"}
                {gameStatus === "waiting" && "Preparando..."}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SecuenciaColores;