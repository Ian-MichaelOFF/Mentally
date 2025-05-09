import React, { useState, useEffect, useRef } from "react";
import "../CSS/juegos-frutas.css"; // Importar los estilos
import { ArrowLeft } from "lucide-react";

const FrutasMatematicas = () => {
  // Estados del juego
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<any>({});
  const [attempts, setAttempts] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameVisible, setGameVisible] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', className: 'feedback' });
  const [answerValue, setAnswerValue] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  // Referencias para elementos DOM
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Valores de las frutas
  const fruitValues = {
    '🍌': 4, '🍇': 3, '🍎': 5, '🍍': 6,
    '🍉': 2, '🍓': 7, '🍊': 1, '🍋': 8
  };
  const fruits = Object.keys(fruitValues);

  // Operadores por nivel
  const levelOperators = {
    easy: ['+', '-'],
    normal: ['+', '-', '*', '/'],
    hard: ['+', '-', '*', '/'],
  };

  // Límites de tiempo por nivel
  const timeLimits = {
    easy: 0, normal: 0, hard: 60, 
  };

  // Número de rondas por nivel
  const roundsPerLevel = {
    easy: 5,
    normal: 10,
    hard: 15,
  };

  // Función para obtener una fruta aleatoria
  const getRandomFruit = () => {
    return fruits[Math.floor(Math.random() * fruits.length)];
  };

  // Iniciar juego con nivel seleccionado
  const startGame = (level: string) => {
    setCurrentLevel(level);
    setGameVisible(true);
    setShowResults(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentRound(1);
    setTotalRounds(roundsPerLevel[level as keyof typeof roundsPerLevel]);
    generateProblem(level);
  };

  // Reiniciar feedback
  const resetFeedback = () => {
    setFeedback({ text: '', className: 'feedback' });
  };

  // Tiempo agotado
  const timeOut = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setFeedback({
      text: '¡Tiempo agotado! Prepárate para el siguiente reto.',
      className: 'feedback timeout'
    });

    setTimeout(() => {
      advanceToNextRound();
    }, 3000);
  };

  // Actualizar temporizador
  const updateTimer = (time: number) => {
    setTimeLeft(time);
    if (time <= 0) {
      timeOut();
    }
  };

  // Verificar si se han completado todas las rondas
  const checkGameCompletion = () => {
    if (currentRound > roundsPerLevel[currentLevel as keyof typeof roundsPerLevel]) {
      // Calcular puntaje final: aciertos * 3 - errores * 2
      const score = (correctCount * 3) - (incorrectCount * 2);
      setFinalScore(score);
      setShowResults(true);
      return true;
    }
    return false;
  };

  // Avanzar a la siguiente ronda
  const advanceToNextRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    
    // Verificar si el juego ha terminado
    if (nextRound > roundsPerLevel[currentLevel as keyof typeof roundsPerLevel]) {
      // Calcular puntaje final: aciertos * 3 - errores * 2
      const score = (correctCount * 3) - (incorrectCount * 2);
      setFinalScore(score);
      setShowResults(true);
    } else {
      generateProblem(currentLevel);
    }
  };

  // Generar nuevo problema
  const generateProblem = (level: string) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setAttempts(0);
    resetFeedback();
    setAnswerValue('');

    let numFruits;
    let operators;

    switch (level) {
      case 'easy':
        numFruits = 2;
        operators = levelOperators.easy;
        break;
      case 'normal':
        numFruits = 3;
        operators = levelOperators.normal;
        break;
      case 'hard':
        numFruits = 3;
        operators = levelOperators.hard;
        break;
      default:
        numFruits = 2;
        operators = levelOperators.easy;
    }

    // Seleccionar frutas únicas
    const selectedFruits: string[] = [];
    while (selectedFruits.length < numFruits) {
      const fruit = getRandomFruit();
      if (!selectedFruits.includes(fruit)) {
        selectedFruits.push(fruit);
      }
    }

    // Seleccionar operadores
    const selectedOperators: string[] = [];
    for (let i = 0; i < numFruits - 1; i++) {
      selectedOperators.push(operators[Math.floor(Math.random() * operators.length)]);
    }

    // Calcular respuesta
    let answer;
    try {
      // Crear expresión matemática
      let expression = '';
      for (let i = 0; i < numFruits; i++) {
        expression += fruitValues[selectedFruits[i] as keyof typeof fruitValues];
        if (i < numFruits - 1) {
          expression += selectedOperators[i];
        }
      }
      answer = eval(expression);
    } catch (e) {
      generateProblem(level);
      return;
    }

    const newProblem = {
      fruits: selectedFruits,
      operators: selectedOperators,
      answer: answer,
      values: selectedFruits.map(fruit => fruitValues[fruit as keyof typeof fruitValues])
    };

    setCurrentProblem(newProblem);

    // Iniciar temporizador solo para nivel difícil
    if (level === 'hard' || level === 'god') {
      const initialTime = timeLimits[level as keyof typeof timeLimits];
      setTimeLeft(initialTime);

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            timeOut();
          }
          return newTime;
        });
      }, 1000);
    }
  };

  // Verificar respuesta
  const verifyAnswer = () => {
    const userAnswer = parseFloat(answerValue);

    if (isNaN(userAnswer)) {
      setFeedback({
        text: '¡Ingresa un número válido!',
        className: 'feedback incorrect'
      });
      return;
    }

    // Para manejar decimales en divisiones
    const roundedAnswer = Math.round(currentProblem.answer * 10) / 10;
    const roundedUserAnswer = Math.round(userAnswer * 10) / 10;

    if (roundedUserAnswer === roundedAnswer) {
      setCorrectCount(prev => prev + 1);
      setFeedback({
        text: `¡Correcto! 🎉 La respuesta es ${currentProblem.answer}`,
        className: 'feedback correct'
      });

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTimeout(() => {
        advanceToNextRound();
      }, 1500);
    } else {
      setAttempts(prev => prev + 1);
      setIncorrectCount(prev => prev + 1);

      if (attempts + 1 >= 3) {
        setFeedback({
          text: `La respuesta correcta era: ${currentProblem.answer}`,
          className: 'feedback hint'
        });

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        setTimeout(() => {
          advanceToNextRound();
        }, 2500);
      } else {
        setFeedback({
          text: `Incorrecto. Intento ${attempts + 1} de 3.`,
          className: 'feedback incorrect'
        });
      }
    }
  };

  // Regresar a la selección de nivel
  const backToLevelSelection = () => {
    setGameVisible(false);
    setShowResults(false);
  };

  // Limpiar el temporizador cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Función para regresar a la página anterior
  const goBack = () => {
    window.history.back();
  };

  // Manejar el evento de tecla "Enter"
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyAnswer();
    }
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

        {!gameVisible && !showResults && (
          <div className="level-selector">
            <button onClick={() => startGame('easy')}>Sencillo</button>
            <button onClick={() => startGame('normal')}>Normal</button>
            <button onClick={() => startGame('hard')}>Difícil</button>
          </div>
        )}

        {gameVisible && !showResults && (
          <div className="game-area">
            <div className="round-indicator">
              Ronda: {currentRound} / {totalRounds}
            </div>

            <div className="timer">
              {timeLeft > 0 ? `Tiempo: ${timeLeft}s` : ''}
            </div>

            <div className="fruit-values">
              {currentProblem.fruits && (
                <>
                  <p><strong>Valores de las frutas:</strong></p>
                  {currentProblem.fruits.map((fruit: string, index: number) => (
                    <p key={index}>{fruit} = {currentProblem.values[index]}</p>
                  ))}
                </>
              )}
            </div>

            <div className="equation">
              {currentProblem.fruits && currentProblem.fruits.map((fruit: string, index: number) => (
                <React.Fragment key={index}>
                  <span className="fruit">{fruit}</span>
                  {index < currentProblem.operators.length && (
                    <span>{currentProblem.operators[index]}</span>
                  )}
                </React.Fragment>
              ))}
              {currentProblem.fruits && <span>= ?</span>}
            </div>

            <div className="controls">
              <input
                type="number"
                placeholder="Resultado"
                value={answerValue}
                onChange={(e) => setAnswerValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={verifyAnswer}>Verificar</button>
            </div>

            <div className={feedback.className}>{feedback.text}</div>

            <div className="score">
              <span>
                Aciertos: <span>{correctCount}</span>
              </span>
              <span>
                Errores: <span>{incorrectCount}</span>
              </span>
            </div>
          </div>
        )}

        {showResults && (
          <div className="results-screen">
            <h2>¡Juego Completado!</h2>
            <div className="results-content">
              <p>Nivel: <strong>{currentLevel === 'easy' ? 'Sencillo' : currentLevel === 'normal' ? 'Normal' : 'Difícil'}</strong></p>
              <p>Aciertos: <span className="correct-count">{correctCount}</span></p>
              <p>Errores: <span className="incorrect-count">{incorrectCount}</span></p>
              <p className="final-score">Puntaje Final: <strong>{finalScore}</strong></p>
              {finalScore <= 0 ? (
                <p className="encouragement">¡Sigue practicando! 💪</p>
              ) : finalScore < 5 ? (
                <p className="encouragement">¡Buen trabajo! 👍</p>
              ) : (
                <p className="encouragement">¡Excelente! ¡Eres un genio! 🏆</p>
              )}
            </div>
            <button className="play-again-btn" onClick={backToLevelSelection}>Jugar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrutasMatematicas;