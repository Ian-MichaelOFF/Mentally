// Lista de palabras para el juego
const words = ['gato', 'perro', 'elefante', 'tigre', 'murcielago', 'delfin', 'jirafa', 'raton', 'leon'];
let currentWord = '';
let scrambledWord = '';
let roundCounter = 0;  // Contador de rondas
const maxRounds = 5;   // Número máximo de rondas
let timer;
let timeRemaining = 0;
let difficulty = 'easy'; // Dificultad por defecto

// Función para mezclar las letras de una palabra
function shuffleWord(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Intercambiar elementos
    }
    return arr.join('');
}

// Función para iniciar un nuevo juego
function startGame() {
    // Ocultar la pantalla de selección de dificultad
    document.getElementById('difficulty-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Restablecer los elementos a su estado inicial
    roundCounter = 0;
    timeRemaining = 0;
    document.getElementById('round').textContent = `Ronda: ${roundCounter + 1} de ${maxRounds}`;
    document.getElementById('message').textContent = '';
    document.getElementById('timer').textContent = '';
    document.getElementById('user-input').disabled = false;  // Habilitar el input
    document.getElementById('submit-btn').disabled = false;  // Habilitar el botón de comprobar

    nextRound();  // Iniciar la primera ronda
}

// Función para iniciar la siguiente ronda
function nextRound() {
    if (roundCounter >= maxRounds) {
        document.getElementById('anagram').textContent = `¡Juego terminado! Has completado ${maxRounds} rondas.`;
        document.getElementById('user-input').disabled = true;  // Deshabilitar la entrada
        document.getElementById('submit-btn').disabled = true;  // Deshabilitar el botón
        clearInterval(timer);  // Detener el temporizador
        return;
    }

    // Elegir una palabra aleatoria de la lista
    currentWord = words[Math.floor(Math.random() * words.length)];
    // Mezclar la palabra y mostrar el anagrama
    scrambledWord = shuffleWord(currentWord);
    document.getElementById('anagram').textContent = `Anagrama: ${scrambledWord}`;
    document.getElementById('message').textContent = '';
    document.getElementById('user-input').value = '';
    roundCounter++;
    document.getElementById('round').textContent = `Ronda: ${roundCounter} de ${maxRounds}`;

    // Configurar temporizador según la dificultad
    if (difficulty === 'medium') {
        timeRemaining = 20;  // 20 segundos para dificultad media
        startTimer();  // Iniciar el temporizador
    } else if (difficulty === 'hard') {
        timeRemaining = 15;  // 15 segundos para dificultad alta
        startTimer();  // Iniciar el temporizador
    } else {
        timeRemaining = 30;  // 30 segundos para dificultad fácil
        startTimer();  // Iniciar el temporizador
    }
}

// Función para iniciar el temporizador
function startTimer() {
    document.getElementById('timer').textContent = `Tiempo: ${timeRemaining} segundos`;
    timer = setInterval(function() {
        timeRemaining--;
        document.getElementById('timer').textContent = `Tiempo: ${timeRemaining} segundos`;
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            document.getElementById('message').textContent = 'Se acabó el tiempo, intenta nuevamente.';
            document.getElementById('message').style.color = 'red';
            nextRound(); // Avanzar a la siguiente ronda
        }
    }, 1000);
}

// Comprobar si la respuesta es correcta
document.getElementById('submit-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    if (userInput === currentWord) {
        document.getElementById('message').textContent = '¡Correcto! Muy bien hecho.';
        document.getElementById('message').style.color = 'green';
        clearInterval(timer);  // Detener el temporizador
        nextRound(); // Avanzar a la siguiente ronda
    } else {
        document.getElementById('message').textContent = 'Intenta nuevamente.';
        document.getElementById('message').style.color = 'red';
    }
});

// Iniciar el juego al seleccionar la dificultad
document.getElementById('start-btn-Anagram').addEventListener('click', function() {
    difficulty = document.getElementById('difficulty').value;
    startGame();
});

// Función para salir del juego
document.getElementById('exit-btn').addEventListener('click', function() {
    // Restablecer el estado del juego y mostrar la pantalla de selección de dificultad
    document.getElementById('difficulty-container').style.display = 'block';  // Mostrar la pantalla de selección de dificultad
    document.getElementById('game-container').style.display = 'none';  // Ocultar el juego
    clearInterval(timer);  // Detener cualquier temporizador activo
    timeRemaining = 0;  // Restablecer el temporizador

    // Habilitar el campo de entrada y el botón de comprobar en caso de reiniciar el juego
    document.getElementById('user-input').disabled = false;  // Habilitar el input
    document.getElementById('submit-btn').disabled = false;  // Habilitar el botón
});
