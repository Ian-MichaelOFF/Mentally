import React, { useState, useEffect, useRef } from 'react';
import "../CSS/Juego_Anagramas.css";
import { ArrowLeft } from "lucide-react";
import cerebrin from "/public/logos/CEREBRITIN.png";

const Anagrama: React.FC = () => {
  // Definición de los conjuntos de palabras
  const wordSets = {
    facil: ["gato", "casa", "luna", "pan", "sol"],
    medio: ["ratón", "perro", "nieve", "pluma", "verde"],
    dificil: ["zorro", "bruja", "trueno", "glaciar", "murciélago"]
  };

  // Estados para el juego
  const [currentLevel, setCurrentLevel] = useState<string>("");
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [anagram, setAnagram] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);

  // Tiempos para cada nivel
  const times = {
    facil: 60,
    medio: 45,
    dificil: 30
  };

  // Función para guardar la partida en el backend
  const guardarPartida = async () => {
    try {
      const IDjuego = 2; // ID correcto para Anagramas
      const puntuacion = calculateScore();
      
      console.log("Guardando partida:", {
        IDjuego,
        dificultad: currentLevel,
        puntuacion
      });
      
      const response = await fetch('http://localhost:5000/api/guardar-partida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IDjuego,
          dificultad: currentLevel,
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

  // Función para calcular el puntaje
  const calculateScore = (): number => {
    const baseScore = correctAnswers * 100;
    const timeBonus = Math.floor(timer / 10) * 50;
    const accuracyBonus = incorrectAttempts === 0 ? 200 : 0;
    return baseScore + timeBonus + accuracyBonus;
  };

  // Funciones auxiliares
  const shuffleWord = (word: string): string => {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join("");
  };

  const shuffleArray = (arr: string[]): string[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const capitalize = (str: string): string => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Función para iniciar el juego
  const startGame = (level: string) => {
    const shuffledWords = shuffleArray([...wordSets[level as keyof typeof wordSets]]);
    
    setCurrentLevel(level);
    setCurrentWords(shuffledWords);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setIncorrectAttempts(0);
    setTotalTime(times[level as keyof typeof times]);
    setTimer(times[level as keyof typeof times]);
    setGameStarted(true);
    setGameEnded(false);
    setFeedback("");
    setAnswer("");
    
    // Establecer el anagrama inicial
    const firstWord = shuffledWords[0];
    setAnagram(shuffleWord(firstWord));
    
    // Enfocar el input
    setTimeout(() => {
      if (answerInputRef.current) {
        answerInputRef.current.focus();
      }
    }, 100);
  };

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (gameStarted && !gameEnded) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            // Se acabó el tiempo
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setGameEnded(true);
            setSuccess(false);
            // Guardar partida al acabarse el tiempo
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameEnded]);

  // Efecto para guardar partida cuando termina el juego
  useEffect(() => {
    if (gameEnded) {
      guardarPartida();
    }
  }, [gameEnded]);

  // Función para verificar la respuesta
  const checkAnswer = () => {
    const inputAnswer = answer.trim().toLowerCase();
    if (inputAnswer === currentWords[currentIndex]) {
      // Respuesta correcta
      setCorrectAnswers(prev => prev + 1);
      setFeedback("¡Correcto!");
      setAnswer("");
      
      if (currentIndex >= currentWords.length - 1) {
        // Completó todas las palabras
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setGameEnded(true);
        setSuccess(true);
      } else {
        // Pasar a la siguiente palabra
        setCurrentIndex(prev => prev + 1);
        const nextWord = currentWords[currentIndex + 1];
        setAnagram(shuffleWord(nextWord));
      }
    } else {
      // Respuesta incorrecta
      setIncorrectAttempts(prev => prev + 1);
      setFeedback("Intenta de nuevo.");
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  // Reiniciar el juego con el mismo nivel
  const restartGame = () => {
    startGame(currentLevel);
  };

  // Volver al menú principal
  const goToMenu = () => {
    setGameStarted(false);
    setGameEnded(false);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div id="main-wrapper">
      <button 
        onClick={goBack} 
        className="back-buttonMemoryMst"
        aria-label="Regresar"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="main-title">Anagramas</h1>

      <div id="game-container">
        {!gameStarted && !gameEnded && (
          <div id="start-menu" className="menu">
            <img 
              src={cerebrin}
              alt="Imagen de Anagramas" 
              className="game-image" 
            />
            <h2 className="welcome">¡Bienvenido!</h2>
            <p className="description">Un anagrama consiste en acomodar una palabra de manera correcta.</p>
            <p className="instructions">Elige una dificultad para comenzar:</p>
            <button className="menu-button" onClick={() => startGame('facil')}>Fácil</button>
            <button className="menu-button" onClick={() => startGame('medio')}>Medio</button>
            <button className="menu-button" onClick={() => startGame('dificil')}>Difícil</button>
          </div>
        )}

        {gameStarted && !gameEnded && (
          <div id="game" className="game-section">
            <h3 id="level-title" className="level-title">Nivel: {capitalize(currentLevel)}</h3>
            <div id="timer" className="timer-display">Tiempo: {formatTime(timer)}</div>
            <div id="anagram-container" className="anagram-box">Adivina: {anagram}</div>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                id="answer" 
                className="answer-input" 
                placeholder="Escribe la palabra..." 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                ref={answerInputRef}
              />
              <button type="submit" className="submit-button">Enviar</button>
            </form>
            <p id="feedback" className="feedback-text">{feedback}</p>
          </div>
        )}

        {gameEnded && (
          <div id="result" className="result-section">
            <h2 id="result-message" className="result-message">
              {success ? (
                <>
                  🎉 ¡Felicidades, completaste el nivel!<br/><br/>
                  ✔️ Aciertos: {correctAnswers}<br/>
                  ❌ Errores: {incorrectAttempts}<br/>
                  ⏱️ Tiempo usado: {formatTime(totalTime - timer)}<br/>
                  🏆 Puntuación: {calculateScore()}
                </>
              ) : (
                <>
                  ⏰ Se acabó el tiempo...<br/><br/>
                  ✔️ Aciertos: {correctAnswers}<br/>
                  ❌ Errores: {incorrectAttempts}<br/>
                  🏆 Puntuación: {calculateScore()}
                </>
              )}
            </h2>
            <button className="menu-button" onClick={restartGame}>Jugar de nuevo</button>
            <button className="menu-button" onClick={goToMenu}>Salir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anagrama;