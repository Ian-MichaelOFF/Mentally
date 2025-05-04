let currentDifficulty = "facil";
let currentEquation = {};

let correctAnswers = 0;
let incorrectAnswers = 0;

const validOperators = {
    facil: ["+", "-"],
    medio: ["+", "-"],
    dificil: ["+", "-", "x"]
};

function startGame() {
    currentDifficulty = document.getElementById("difficulty").value;
    
    toggleGameVisibility(true);
    generateEquation();
    renderOperatorButtons();
    resetCounters();
    document.getElementById('score-display').style.display = 'block'; // Show score display
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function computeWithOperators(n1, n2, n3, op1, op2) {
  let res1 = op1 === "x" ? n1 * n2 : eval(`${n1} ${op1} ${n2}`);
  return op2 === "x" ? res1 * n3 : eval(`${res1} ${op2} ${n3}`);
}

function generateEquation() {
    resetGameDisplay();

    const [n1, n2, n3] = [getRandomInt(1, 10), getRandomInt(1, 10), getRandomInt(1, 10)];
    let op1, op2, result;

    if (currentDifficulty === "facil") {
        op1 = randomFrom(validOperators.facil); //operador
        result = eval(`${n1} ${op1} ${n2}`);  //resultado
        currentEquation = { text: `${n1}_${n2}=${result}`, answer: op1 };
    } else if (currentDifficulty === "medio") {
        op1 = randomFrom(validOperators.medio);
        result = eval(`${n1} ${op1} ${n2} ${op1} ${n3}`);
        currentEquation = { text: `${n1}_${n2}_${n3}=${result}`, answer: op1 };
    } else if (currentDifficulty === "dificil") {
        op1 = randomFrom(validOperators.dificil);
        op2 = randomFrom(validOperators.dificil);
        result = computeWithOperators(n1, n2, n3, op1, op2);
        currentEquation = { text: `${n1}_${n2}_${n3}=${result}`, answer: [op1, op2] };
    }

    document.getElementById("equation").innerHTML = convertEquationToIcons(currentEquation.text);
    renderOperatorButtons();
}

function checkAnswer(userInput) {
    const userResult = currentDifficulty === "dificil" 
        ? validateDifficultAnswer(userInput) 
        : userInput === currentEquation.answer;

    if (userResult) {
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }

    updateCounters();
    showResult(userResult);
}

function validateDifficultAnswer(userInput) {
    const [op1, op2] = userInput.split("");
    const [n1, n2, n3] = currentEquation.text.match(/\d+/g).map(Number);
    const userResult = computeWithOperators(n1, n2, n3, op1, op2);
    const correctResult = computeWithOperators(n1, n2, n3, ...currentEquation.answer);
    return userResult === correctResult;
}

function showResult(isCorrect) {
    const resultText = isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto";
    document.getElementById("result").textContent = resultText;
    
    document.getElementById("back-arrow").style.display = "block"; // Show back arrow
}
  

function getOperatorIcon(op) {
    const icons = {
        "+": '<i class="fa-solid fa-plus"></i>',
        "-": '<i class="fa-solid fa-minus"></i>',
        "x": '<i class="fa-solid fa-xmark"></i>',
    };
    return icons[op] || op;
}

function convertEquationToIcons(equationText) {
    return equationText
    .replaceAll("+", getOperatorIcon("+"))
    .replaceAll("-", getOperatorIcon("-"))
    .replaceAll("x", getOperatorIcon("x"))
    .replaceAll("_", "<u>_</u>");
}

function renderOperatorButtons() {
    const container = document.getElementById("operator-buttons");
    container.innerHTML = "";
    const operators = validOperators[currentDifficulty];

    if (currentDifficulty === "dificil") {
        operators.forEach(op1 => {
        operators.forEach(op2 => {
            const btn = createOperatorButton(`${op1}${op2}`);
            container.appendChild(btn);
        });
        });
    } else {
        operators.forEach(op => {
        const btn = createOperatorButton(op);
        container.appendChild(btn);
        });
    }
}

function createOperatorButton(op) {
    const btn = document.createElement("button");
    btn.innerHTML = getOperatorIcon(op);
    btn.onclick = () => checkAnswer(op);
    return btn;
}

function goBackToMenu() {
    toggleGameVisibility(false);
    resetGameDisplay();
    document.getElementById("back-arrow").style.display = "none"; // Hide back arrow
    document.getElementById('score-display').style.display = 'none'; // Hide score display
}

function resetGameDisplay() {
    document.getElementById("result").textContent = "";
    document.getElementById("equation").innerHTML = "";
    document.getElementById("operator-buttons").innerHTML = "";
    document.getElementById("back-arrow").style.display = "none"; // Ensure it's hidden when resetting
}

function toggleGameVisibility(isPlaying) {
    document.getElementById("difficulty-select").style.display = isPlaying ? "none" : "block";
    document.getElementById("game").style.display = isPlaying ? "block" : "none";
}

function resetCounters() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    updateCounters();
}

function updateCounters() {
    document.getElementById("correct-count").textContent = `Aciertos: ${correctAnswers}`;
    document.getElementById("incorrect-count").textContent = `Errores: ${incorrectAnswers}`;
}
