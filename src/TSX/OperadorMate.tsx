import { useState, useEffect } from "react";
import "../CSS/OperadorMisterioso.css";
import { ArrowLeft } from "lucide-react";

interface Equation {
  text: string;
  answer: string | string[];
}

export default function OperadorMisterioso() {
  const [currentDifficulty, setCurrentDifficulty] = useState("facil");
  const [currentEquation, setCurrentEquation] = useState<Equation>({ text: "", answer: "" });
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultText, setResultText] = useState("");
  const [equationDisplay, setEquationDisplay] = useState("");
  const [showBackArrow, setShowBackArrow] = useState(false);
  const [round, setRound] = useState(1);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Define el número de rondas por dificultad
  const roundsPerDifficulty = {
    facil: 5,
    medio: 10,
    dificil: 15
  };

  const validOperators = {
    facil: ["+", "-"],
    medio: ["+", "-"],
    dificil: ["+", "-", "x"]
  };

  // Función para guardar la partida en el backend
  const guardarPartida = async () => {
    try {
      const IDjuego = 5; // ID para Operador Misterioso
      const puntuacion = finalScore;
      
      const response = await fetch('http://localhost:5000/api/guardar-partida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IDjuego,
          dificultad: currentDifficulty,
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

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomFrom = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const computeWithOperators = (n1: number, n2: number, n3: number, op1: string, op2: string) => {
    let res1 = op1 === "x" ? n1 * n2 : eval(`${n1} ${op1} ${n2}`);
    return op2 === "x" ? res1 * n3 : eval(`${res1} ${op2} ${n3}`);
  };

  const generateEquation = () => {
    resetGameDisplay();

    const [n1, n2, n3] = [getRandomInt(1, 10), getRandomInt(1, 10), getRandomInt(1, 10)];
    let op1: string, op2: string, result: number;
    let newEquation: Equation;

    if (currentDifficulty === "facil") {
      op1 = randomFrom(validOperators.facil);
      result = eval(`${n1} ${op1} ${n2}`);
      newEquation = { text: `${n1}_${n2}=${result}`, answer: op1 };
    } else if (currentDifficulty === "medio") {
      op1 = randomFrom(validOperators.medio);
      result = eval(`${n1} ${op1} ${n2} ${op1} ${n3}`);
      newEquation = { text: `${n1}_${n2}_${n3}=${result}`, answer: op1 };
    } else {
      op1 = randomFrom(validOperators.dificil);
      op2 = randomFrom(validOperators.dificil);
      result = computeWithOperators(n1, n2, n3, op1, op2);
      newEquation = { text: `${n1}_${n2}_${n3}=${result}`, answer: [op1, op2] };
    }

    setCurrentEquation(newEquation);
    setEquationDisplay(convertEquationToIcons(newEquation.text));
  };

  const startGame = () => {
    setIsPlaying(true);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setRound(1);
    setShowFinalScore(false);
    generateEquation();
  };

  const checkAnswer = (userInput: string) => {
    const userResult = currentDifficulty === "dificil" 
      ? validateDifficultAnswer(userInput) 
      : userInput === currentEquation.answer;

    if (userResult) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    showResult(userResult);
  };

  const validateDifficultAnswer = (userInput: string) => {
    const [op1, op2] = userInput.split("");
    const [n1, n2, n3] = currentEquation.text.match(/\d+/g)!.map(Number);
    const userResult = computeWithOperators(n1, n2, n3, op1, op2);
    // Asegurarse de que answer es un array
    const answerArray = Array.isArray(currentEquation.answer) ? currentEquation.answer : [currentEquation.answer];
    const correctResult = computeWithOperators(n1, n2, n3, answerArray[0], answerArray[1]);
    return userResult === correctResult;
  };

  const showResult = (isCorrect: boolean) => {
    const text = isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto";
    setResultText(text);
    setShowBackArrow(true);
  };

  const getOperatorIcon = (op: string) => {
    const icons: {[key: string]: string} = {
      "+": '<i class="fa-solid fa-plus"></i>',
      "-": '<i class="fa-solid fa-minus"></i>',
      "x": '<i class="fa-solid fa-xmark"></i>',
    };
    return icons[op] || op;
  };

  const convertEquationToIcons = (equationText: string) => {
    return equationText
      .replace(/\+/g, getOperatorIcon("+"))
      .replace(/-/g, getOperatorIcon("-"))
      .replace(/x/g, getOperatorIcon("x"))
      .replace(/_/g, "<u>_</u>");
  };

  const renderOperatorButtons = () => {
    const operators = validOperators[currentDifficulty as keyof typeof validOperators];
    
    if (currentDifficulty === "dificil") {
      return operators.flatMap((op1) => 
        operators.map((op2) => (
          <button 
            key={`${op1}${op2}`} 
            className="operator-button"
            onClick={() => checkAnswer(`${op1}${op2}`)}
          >
            <span dangerouslySetInnerHTML={{ __html: getOperatorIcon(op1) + getOperatorIcon(op2) }} />
          </button>
        ))
      );
    } else {
      return operators.map((op) => (
        <button 
          key={op} 
          className="operator-button"
          onClick={() => checkAnswer(op)}
        >
          <span dangerouslySetInnerHTML={{ __html: getOperatorIcon(op) }} />
        </button>
      ));
    }
  };

  const goBackToMenu = () => {
    setIsPlaying(false);
    resetGameDisplay();
    setShowFinalScore(false);
  };

  const resetGameDisplay = () => {
    setResultText("");
    setEquationDisplay("");
    setShowBackArrow(false);
  };

  const nextRound = () => {
    const maxRounds = roundsPerDifficulty[currentDifficulty as keyof typeof roundsPerDifficulty];
    
    if (round < maxRounds) {
      setRound(prevRound => prevRound + 1);
      generateEquation();
    } else {
      // Finalizar el juego y mostrar puntaje
      const totalScore = (correctAnswers * 3) - (incorrectAnswers * 2);
      setFinalScore(totalScore);
      setShowFinalScore(true);
      setTimeout(() => guardarPartida(), 300);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      generateEquation();
    }
  }, [currentDifficulty, isPlaying]);

  useEffect(() => {
    if (showFinalScore && finalScore !== 0) {
      guardarPartida();
    }
  }, [showFinalScore, finalScore]);
  
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="cuerpoJuego">
      <button 
        onClick={goBack} 
        className="back-button"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
      <h1>Operador Misterioso</h1>
      <p>¡Adivina el operador que cumpla con la logica!</p>
      <img src="/public/logos/Cerebrin.png" alt="Mascota Mentally" className="mascot" />

      {!isPlaying ? (
        <div id="difficulty1-select1" className="difficulty1-select1">
          <label htmlFor="difficulty">Selecciona dificultad:</label>
          <select 
            id="difficulty1" 
            value={currentDifficulty}
            onChange={(e) => setCurrentDifficulty(e.target.value)}
          >
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
          </select>
          <button onClick={startGame}>Comenzar</button>
        </div>
      ) : showFinalScore ? (
        <div className="final-score-container">
          <h2>¡Juego terminado!</h2>
          <p>Total de rondas: {roundsPerDifficulty[currentDifficulty as keyof typeof roundsPerDifficulty]}</p>
          <p className="correct-count">Aciertos: {correctAnswers}</p>
          <p className="incorrect-count">Errores: {incorrectAnswers}</p>
          <p className="final-score">Puntaje Final: <strong>{finalScore}</strong></p>
          {finalScore <= 0 ? (
            <p className="encouragement">¡Sigue practicando! 💪</p>
          ) : finalScore < 5 ? (
            <p className="encouragement">¡Buen trabajo! 👍</p>
          ) : (
            <p className="encouragement">¡Excelente! ¡Eres un genio! 🏆</p>
          )}
          <button onClick={goBackToMenu}>Volver a jugar</button>
        </div>
      ) : (
        <>
          {showBackArrow && (
            <div className="back-arrow">
              <i className="fa-solid fa-arrow-left" onClick={goBackToMenu}></i>
            </div>
          )}
          
          <div className="score-display">
            <p className="round-info">Ronda {round} de {roundsPerDifficulty[currentDifficulty as keyof typeof roundsPerDifficulty]}</p>
            <p className="correct-count">Aciertos: {correctAnswers}</p>
            <p className="incorrect-count">Errores: {incorrectAnswers}</p>
          </div>
          
          <div className="game">
            <p 
              className="equation" 
              dangerouslySetInnerHTML={{ __html: equationDisplay }}
            ></p>
            <div className="operator-buttons">
              {renderOperatorButtons()}
            </div>
            <p className="result">{resultText}</p>
            <button className="next-button" onClick={nextRound}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}