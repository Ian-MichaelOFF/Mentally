
    // Elementos del DOM
    const gameArea = document.querySelector('.game-area');
    const fruitValuesElement = document.getElementById('fruit-values');
    const equationElement = document.getElementById('equation');
    const answerInput = document.getElementById('answer-input');
    const verifyBtn = document.getElementById('verify-btn');
    const feedbackElement = document.getElementById('feedback');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const timerElement = document.getElementById('timer');

    const easyBtn = document.getElementById('easy-btn');
    const normalBtn = document.getElementById('normal-btn');
    const hardBtn = document.getElementById('hard-btn');


    // Variables del juego
    let correctCount = 0;
    let incorrectCount = 0;
    let currentProblem = {};
    let attempts = 0;
    let currentLevel = '';
    let timerInterval;
    let timeLeft = 0;
    const timeLimits = { 
        easy: 0, normal: 0, hard: 60, 
        god: 30 // Nuevo: menos tiempo para God
    };
    
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
    
    // Inicializar el juego
    function init() {
        easyBtn.addEventListener('click', () => startGame('easy'));
        normalBtn.addEventListener('click', () => startGame('normal'));
        hardBtn.addEventListener('click', () => startGame('hard'));
    }
    
    // Comenzar juego con nivel seleccionado
    function startGame(level) {
        currentLevel = level;
        gameArea.style.display = 'block';
        correctCount = 0;
        incorrectCount = 0;
        correctCountElement.textContent = '0';
        incorrectCountElement.textContent = '0';
        generateProblem();
    }
    
    // Generar nuevo problema
    function generateProblem() {
        clearInterval(timerInterval);
        attempts = 0;
        resetFeedback();
        
        let numFruits;
        let operators;

        switch(currentLevel) {
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
        }
        
        // Seleccionar frutas únicas
        const selectedFruits = [];
        while (selectedFruits.length < numFruits) {
            const fruit = getRandomFruit();
            if (!selectedFruits.includes(fruit)) {
                selectedFruits.push(fruit);
            }
        }
        
        // Seleccionar operadores
        const selectedOperators = [];
        for (let i = 0; i < numFruits - 1; i++) {
            selectedOperators.push(operators[Math.floor(Math.random() * operators.length)]);
        }
        
        // Calcular respuesta
        let answer;
        try {
            // Crear expresion matematica
            let expression = '';
            for (let i = 0; i < numFruits; i++) {
                expression += fruitValues[selectedFruits[i]];
                if (i < numFruits - 1) {
                    expression += selectedOperators[i];
                }
            }
            answer = eval(expression);
        } catch (e) {
            generateProblem();
            return;
        }
        
        currentProblem = {
            fruits: selectedFruits,
            operators: selectedOperators,
            answer: answer,
            values: selectedFruits.map(fruit => fruitValues[fruit])
        };

        
        displayProblem();
        
        // Iniciar temporizador solo para nivel dificil
        if (currentLevel === 'hard' || currentLevel === 'god') {
            timeLeft = timeLimits[currentLevel];
            updateTimer();
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimer();
                if (timeLeft <= 0) {
                    timeOut();
                }
            }, 1000);
        } else {
            timerElement.textContent = '';
        }
        
    
    }//////////////////////////////////////////
    
    // Mostrar el problema
    function displayProblem() {
    // Mostrar valores con checkboxes
    let valuesHTML = '<p><strong>Valores de las frutas:</strong></p>';
    currentProblem.fruits.forEach((fruit, index) => {
        const value = currentProblem.values[index];
        valuesHTML += `<p>${fruit} = ${value}</p>`;
    });
    fruitValuesElement.innerHTML = valuesHTML;
    
    // Mostrar ecuacion con cajas
    let equationHTML = '';
    currentProblem.fruits.forEach((fruit, index) => {
        equationHTML += `<span class="fruit">${fruit}</span>`;
        if (index < currentProblem.operators.length) {
            equationHTML += `<span>${currentProblem.operators[index]}</span>`;
        }
    });
    equationHTML += '<span>= ?</span>';
    equationElement.innerHTML = equationHTML;
}
    
    // Actualizar temporizador con letra mas grande cuando <5seg
    function updateTimer() {
        timerElement.textContent = `Tiempo: ${timeLeft}s`;
        if (timeLeft <= 5) {
            timerElement.style.color = '#f44336';
            timerElement.style.fontWeight = 'bold';
        } else {
            timerElement.style.color = '#e91e63';
            timerElement.style.fontWeight = 'normal';
        }
    }
    
    // Tiempo agotado
    function timeOut() {
        clearInterval(timerInterval);
        feedbackElement.textContent = '¡Tiempo agotado! Prepárate para el siguiente reto.';
        feedbackElement.className = 'feedback timeout';
        
        setTimeout(() => {
            generateProblem();
        }, 3000);
    }
    
    // Reiniciar feedback
    function resetFeedback() {
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
    }
    
    // Verificar respuesta
    function verifyAnswer() {
        const userAnswer = parseFloat(answerInput.value);
        
        if (isNaN(userAnswer)) {
            feedbackElement.textContent = '¡Ingresa un número válido!';
            feedbackElement.className = 'feedback incorrect';
            return;
        }
        
        // Para manejar decimales en divisiones
        const roundedAnswer = Math.round(currentProblem.answer * 10) / 10;
        const roundedUserAnswer = Math.round(userAnswer * 10) / 10;
        
        if (roundedUserAnswer === roundedAnswer) {
            correctCount++;
            correctCountElement.textContent = correctCount;
            feedbackElement.textContent = `¡Correcto! 🎉 La respuesta es ${currentProblem.answer}`;
            feedbackElement.className = 'feedback correct';
            
            clearInterval(timerInterval);
            setTimeout(() => {
                generateProblem();
            }, 1500);
        } else {
            attempts++;
            incorrectCount++;
            incorrectCountElement.textContent = incorrectCount;
            
            if (attempts >= 3) {
                feedbackElement.textContent = `La respuesta correcta era: ${currentProblem.answer}`;
                feedbackElement.className = 'feedback hint';
                
                clearInterval(timerInterval);
                setTimeout(() => {
                    generateProblem();
                }, 2500);
            } else {
                feedbackElement.textContent = `Incorrecto. Intento ${attempts} de 3.`;
                feedbackElement.className = 'feedback incorrect';
            }
        }
    }
    
    // Funcion auxiliar
    function getRandomFruit() {
        return fruits[Math.floor(Math.random() * fruits.length)];
    }
    
    // Event listeners
    verifyBtn.addEventListener('click', verifyAnswer);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyAnswer();
        }
    });
    
    // Iniciar el juego
    init();
