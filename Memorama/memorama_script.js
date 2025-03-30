let nombreJugador = "Rafael Anaya";
let noClicks = 0
let primeraCarta = null;
let segundaCarta = null;
let blockTablero = false;
let parejas = 0;
let totalParejas;
let temporizador;
let tiempo = 0;
let tiempo2 = 0;
let temporizadorCorriendo = false;
let tablero;
let cartasTotales;

document.getElementById("informacionPartida").classList.add("ocultar");
document.getElementById("tablero").classList.add("ocultar");
document.getElementById("pantallaCompletado").classList.add("ocultar");
document.getElementById("pantallaFallido").classList.add("ocultar");

document.getElementById("nombreJugador").textContent = nombreJugador;

function iniciarJuego(columnas, filas, dificultad)
{
    document.getElementById("informacionPartida").classList.remove("ocultar");
    document.getElementById("tablero").classList.remove("ocultar");
    document.getElementById("selector-dificultad").classList.add("ocultar");

    clearInterval(temporizador);
    tiempo = 0;
    temporizadorCorriendo = false;
    
    tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;

    cartasTotales = columnas * filas;
    totalParejas = cartasTotales / 2;
    parejas = 0;
    noClicks = 0;
    document.getElementById("numeroIntentos").textContent = noClicks;

    let numeros = Array.from({length: totalParejas}, (_, i) => i+1);
    let valoresCartas = [...numeros, ...numeros].sort(() => Math.random()-0.5);
    
    valoresCartas.forEach(valor =>
    {
        let carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.valor = valor;
        let img = document.createElement("img");
        img.src = `imagenes/${valor}.png`;
        img.classList.add("ocultar");
        carta.appendChild(img);
        carta.addEventListener("click", voltearCarta);
        tablero.appendChild(carta);
        
    }    
    );

    if (dificultad === "facil")
    {
        iniciarCronometro();
    }
    else
    {
        iniciarTemporizador(dificultad);
    }
}


function voltearCarta()
{
    if (blockTablero || this.classList.contains("volteada"))
        return;

    this.querySelector("img").classList.remove("ocultar");
    this.classList.add("volteada");

    if(!primeraCarta)
    {
        primeraCarta = this;
        return;
    }

    segundaCarta = this;
    blockTablero = true;
    noClicks++;
    document.getElementById("numeroIntentos").textContent = noClicks;

    verificarPar();
}

function verificarPar() {
    if (primeraCarta.dataset.valor === segundaCarta.dataset.valor) 
    {
        reiniciarCartas(true);
        parejas++;
        if (parejas === totalParejas)
        {
            tablero.innerHTML = "";
            document.getElementById("numeroIntentosFinal").textContent = noClicks;
            let minutos = String(Math.floor(tiempo / 60)).padStart(2, "0");
            let segundos = String(tiempo % 60).padStart(2, "0");
            document.getElementById("tiempoJuegoFinal").textContent = `${minutos}:${segundos}`;

            document.getElementById("informacionPartida").classList.add("ocultar");
            document.getElementById("tablero").classList.add("ocultar");
            document.getElementById("pantallaCompletado").classList.remove("ocultar");
        }
    } 
    else 
    {
        setTimeout(() => reiniciarCartas(false), 1000);
    }
}

function reiniciarCartas(esPareja) {
    if (!esPareja) 
    {
        primeraCarta.querySelector("img").classList.add("ocultar");
        segundaCarta.querySelector("img").classList.add("ocultar");
        primeraCarta.classList.remove("volteada");
        segundaCarta.classList.remove("volteada");
    }

    primeraCarta = null;
    segundaCarta = null;
    blockTablero = false;
}

function iniciarCronometro()
{
    temporizador = setInterval(() =>
    {
        tiempo++;
        let minutos = String(Math.floor(tiempo / 60)).padStart(2, "0");
        let segundos = String(tiempo % 60).padStart(2, "0");
        document.getElementById("tiempoJuego").textContent = `${minutos}:${segundos}`;
    }, 1000
    );
}

function iniciarTemporizador(dificultad)
{
    if(dificultad === "medio")
    {
        tiempo2 = 60;
        document.getElementById("tiempoJuego").textContent = "01:00";
    }
    else
    {
        tiempo2 = 45;
        document.getElementById("tiempoJuego").textContent = "00:45";
    }

    temporizador = setInterval(() =>
    {
        tiempo++;
        tiempo2--;
        let minutos = String(Math.floor(tiempo2 / 60)).padStart(2, "0");
        let segundos = String(tiempo2 % 60).padStart(2, "0");
        document.getElementById("tiempoJuego").textContent = `${minutos}:${segundos}`;

        if(tiempo2 <= 0)
        {
            clearInterval(temporizador);
            tablero.innerHTML = "";
            document.getElementById("informacionPartida").classList.add("ocultar");
            document.getElementById("tablero").classList.add("ocultar");
            document.getElementById("pantallaCompletado").classList.add("ocultar");
            document.getElementById("pantallaFallido").classList.remove("ocultar");
        }
    }, 1000
    );
}

function reiniciarJuego()
{
    document.getElementById("selector-dificultad").classList.remove("ocultar");
    document.getElementById("informacionPartida").classList.add("ocultar");
    document.getElementById("tablero").classList.add("ocultar");
    document.getElementById("pantallaCompletado").classList.add("ocultar");
    document.getElementById("pantallaFallido").classList.add("ocultar");
}