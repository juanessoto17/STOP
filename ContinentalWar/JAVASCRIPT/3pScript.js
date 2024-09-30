//----- LOOP -----//

var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}


function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//---- variables ----//

//Obtenemos los "Paises / Persnajes"
const pais1 = document.getElementById("pais-1");
const pais2 = document.getElementById("pais-2");
const pais3 = document.getElementById("pais-3");

var p1Die = false;
var p2Die = false;
var p3Die = false;

//Obtenemos tamaño de los paises
const paisHeight = pais1.clientHeight;
const paisWidth = pais1.clientWidth;

//Obtenemos la zona jugable (El mapa)
const map = document.getElementById("mapa");
const mapHeight = map.clientHeight;
const mapWidth = map.clientWidth;//bordes

const selectWindow = document.getElementById("elegir-pais");
const stopZ = document.getElementById("sZone");
const choosingWindow = document.getElementById("elegir-turno");
const goodMessage = document.getElementById("good-message");
const goodText = document.getElementById("good-text");
const badMessage = document.getElementById("bad-message");
const badText = document.getElementById("bad-text");

const bomba = document.getElementById("bomba");
const contBomba = document.getElementById("cont-bomba");

//verificamos la eleccion de paises.
var p1Seleccion = 0;
var p2Seleccion = 0;
var p3Seleccion = 0;

var Impulso = -1500; //Velcidad de desplazamiento.
var shootForce = -200; // fuerza de disparo para la bomba.

var paisPosY = 0; //Locación de los paises//
var paisPosX = 0; //----------------------//

var bombaPosX = 0;
var bombaPosY = 0;

const decidir = [1, 2, 3]; //Decidimos quien tiene el turno
var move1 = false;//------------------------------------------------------------------------------------------------------------------------------------
var move2 = false;//verificamos cual de los jugadores puede moverse (Los numeros siguen la nomenclatura de los paises, es decir, move1 equivale a pais1)
var move3 = false;//------------------------------------------------------------------------------------------------------------------------------------

var inGame = false;
var inStop = false; 
var shooting = false;
var canResume = false;
var win = false;
var quienDispara = 0;

//pistas----
const pista1 = document.getElementById("pista-1");
const pista2 = document.getElementById("pista-2");

function Start() {
    document.addEventListener("keydown", HandleKeyDown);
    stopZ.style.display = "none";
    pista1.style.display = "none";
    pista2.style.display = "none";
    bomba.style.display = "none";
    choosingWindow.style.display = "none";
    goodMessage.style.display = "none";
    badMessage.style.display = "none";
    ElegirTurno();
}

function Update() {
    moverPais();
    moverBomba();
    mostrarPista();
    detectarColision();
    dispararBomba();
    ganarPartida();
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32 && inGame) {
        detenerMovimiento();
    }
    if (ev.keyCode == 13 && !inGame) {//para que no se repitan
        if (p1Seleccion > 0 && p2Seleccion > 0 && p3Seleccion > 0){
            if (p1Seleccion !== p2Seleccion && p1Seleccion !== p3Seleccion && p3Seleccion !== p2Seleccion) {
                selectWindow.style.display = "none";//oculta
                choosingWindow.style.display = "grid";//muestra
                setTimeout(() => {IniciarPartida(); choosingWindow.style.display = "none";}, 5000);//la carga
            }
            else {
                alert("Hay algunos países repetidos. Asegúrate de no atacarte a ti mismo…");
                location.reload();//recarga
            }
        }
        else {
            alert("Asegúrate de que todos hayan elegido un país.");
            location.reload();
        }
    }
}

function ElegirTurno() {
    const indiceAleatorio = Math.floor(Math.random() * decidir.length);
    return decidir[indiceAleatorio];
}

function IniciarPartida() {
    const elegido = ElegirTurno();
    console.log(elegido);

    if (elegido == 1) {
        if (!p1Die) {
            move1 = true;
        }
        else {
            ElegirTurno();
            IniciarPartida();
        }
    }
    if (elegido == 2) {
        if (!p2Die) {
            move2 = true;
        }
        else {
            ElegirTurno();
            IniciarPartida();
        }
    }
    if (elegido == 3) {
        if (!p3Die) {
            move3 = true;
        }
        else {
            ElegirTurno();
            IniciarPartida();
        }
    }

    resetearJugadores();

    stopZ.style.display = "grid";
    inGame = true;
}

function resetearJugadores() {
    //Reestalecemos la posicion y visibilidad de los jugadores si estan vivos.
    if (!p1Die) {
        pais1.style.display = "block";
        pais1.style.top = 4 + "%";
    }
    if (!p2Die) {
        pais2.style.display = "block";
        pais2.style.top = 4 + "%";
    }
    if (!p3Die) {
        pais3.style.display = "block";
        pais3.style.top = 4 + "%";
    }

    Impulso = -1500;
}

function moverPais() {
    paisPosY += Impulso * deltaTime;//detatime es pa q no depende del rendimiento del pc sino q se s¿basa del tiempo

    if (move1){
        pais1.style.top = paisPosY + "px";
    }
    if (move2) {
        pais2.style.top = paisPosY + "px";
    }
    if (move3) {
        pais3.style.top = paisPosY + "px";
    }

    if (paisPosY < -mapHeight){
        paisPosY = mapHeight + paisHeight;//teletransporta abajo
    }
}

function moverBomba() {
    if (shooting) {
        bombaPosX += -Impulso * deltaTime;
        bomba.style.left = bombaPosX + "px";
        if (bombaPosX >= mapWidth) {
            bombaPosX = -mapWidth;//teletransporta
        } 
    }
}

function dispararBomba() {
    if (shooting && Impulso == 0) {
        bombaPosY += shootForce * deltaTime;
        bomba.style.top = bombaPosY + "px";
    }
    if (bombaPosY < -mapHeight) {
        shooting = false;
        bomba.style.display = "none";
        bomba.style.top = contBomba.style.top;
        bombaPosY = bomba.style.top;
        canResume = true;
        badMessage.style.display = "grid";
        badText.textContent = "¡Fallaste!"//si no le pega a nada
        setTimeout(() => {
            ReanudarPartida();
            bombaPosY = 0;
        }, 2000);
    }
}

function ReanudarPartida() {
    if (canResume) {
        ElegirTurno();
        resetearJugadores();
        canResume = false;//si no la restablezco todos se mueven
        Impulso = -1500;
        badMessage.style.display = "none";
        stopZ.style.display = "none";
        choosingWindow.style.display = "grid";
        setTimeout(() => {IniciarPartida(); choosingWindow.style.display = "none";}, 5000); //reseteamos todos los jugadores a su posicion por defecto y elegimos nuevamente un turno al azar en caso de que no se haya atinado a nadie la bomba.
    }
}

function mostrarPista() {
    if (move1 || move2 || move3) {
        pista1.style.display = "grid";
    }
    else {
        pista1.style.display = "none";
    }
    if (shooting) {
        pista2.style.display = "grid";
    }
    else {
        pista2.style.display = "none";
    }
}

function detectarColision() {
    if (isCollision(pais1, stopZ) || isCollision(pais2, stopZ) || isCollision(pais3, stopZ)) {//para verificar si esta en stop
        inStop = true;
    }
    else {
        inStop = false;
    }

    if (!p1Die && isCollision(bomba, pais1) && quienDispara !== 1 && !move1) {
        bomba.style.display = "none";//oculta bomba
        bomba.style.top = contBomba.style.top;
        bombaPosY = 0;//¡¡no tocar!! SE BUGUEA(RESETEO POS)
        shooting = false;
        badMessage.style.display = "grid";
        badText.textContent = "Pais 1 está en peligro"
        setTimeout(() => {
            badMessage.style.display = "none";
            resetearJugadores();
            move1 = true;
        }, 2000);
    }
    if (!p2Die && isCollision(bomba, pais2) && quienDispara !== 2 && !move2) {
        bomba.style.display = "none";
        bomba.style.top = contBomba.style.top;
        bombaPosY = 0;
        shooting = false;
        badMessage.style.display = "grid";
        badText.textContent = "Pais 2 está en peligro"
        setTimeout(() => {
            badMessage.style.display = "none";
            resetearJugadores();
            move2 = true;
        }, 2000);
    }
    if (!p3Die && isCollision(bomba, pais3) && quienDispara !== 3 && !move3) {
        bomba.style.display = "none";
        bomba.style.top = contBomba.style.top;
        bombaPosY = 0;
        shooting = false;
        badMessage.style.display = "grid";
        badText.textContent = "Pais 3 está en peligro"
        setTimeout(() => {
            badMessage.style.display = "none";
            resetearJugadores();
            move3 = true;
        }, 2000);
    }
}

function isCollision(a, b) {
    const aRect = a.getBoundingClientRect();//lo que ocupa el contenedor
    const bRect = b.getBoundingClientRect();

    const collision = !(aRect.right < bRect.left || aRect.left > bRect.right ||  aRect.bottom < bRect.top || aRect.top > bRect.bottom);
    return collision;
}

function detenerMovimiento() {
    Impulso = 0;
    if (inStop && !shooting) {
        setTimeout(() => {
            shooting = true;
        }, 2000);
        bomba.style.display = "block";
        if (move1) {
            goodMessage.style.display = "grid";
            setTimeout(() => {
                goodMessage.style.display = "none";
            }, 2000);
            pais1.style.display = "none";
            move1 = false;
            quienDispara = 1;
        }
        if (move2) {
            goodMessage.style.display = "grid";
            setTimeout(() => {
                goodMessage.style.display = "none";
            }, 2000);
            pais2.style.display = "none";
            move2 = false;
            quienDispara = 2;
        }
        if (move3) {
            goodMessage.style.display = "grid";
            setTimeout(() => {
                goodMessage.style.display = "none";
            }, 2000);
            pais3.style.display = "none";
            move3 = false;
            quienDispara = 3;
        }
        Impulso = -1500;
    }
    else {
        if (move1) {
            p1Die = true;
            setTimeout(() => {
                muerte();
            }, 1000);
        }
        if (move2) {
            p2Die = true;
            setTimeout(() => {
                muerte();
            }, 1000);
        }
        if (move3) {
            p3Die = true;
            setTimeout(() => {//1seg para llamar la muerte
                muerte();
            }, 1000);
        }
    }
}

function muerte() {
    if (p1Die) {
        pais1.style.display = "none";
        badMessage.style.display = "grid";
        badText.textContent = "Pais 1 ELIMINADO 😥"
        setTimeout(() => {
            badMessage.style.display = "none";
            if (!win) {
                ReanudarPartida();
            }
        }, 2000);
        move1 = false;
        canResume = true;
    }
    if (p2Die) {
        pais2.style.display = "none";
        badMessage.style.display = "grid";
        badText.textContent = "Pais 2 ELIMINADO 😥"
        setTimeout(() => {
            badMessage.style.display = "none";
            if (!win) {
                ReanudarPartida();
            }
        }, 2000);
        move2 = false;
        canResume = true;
    }
    if (p3Die) {
        pais3.style.display = "none";
        badMessage.style.display = "grid";
        badText.textContent = "Pais 3 ELIMINADO 😥"
        setTimeout(() => {
            badMessage.style.display = "none";
            if (!win) {
                ReanudarPartida();
            }
        }, 2000);
        move3 = false;
        canResume = true;
    }
}

function ganarPartida() {
    if (!p1Die && p2Die && p3Die) {
        win = true;
        setTimeout(() => {
            goodMessage.style.display = "grid";
            goodText.textContent = "VICTORIA, País 1, ahora estas tierras te pertenecen 👌... (Recarga para una nueva partida)";
            stopZ.style.display = "none";//oculta stop
        }, 3000);  
    }
    if (p1Die && !p2Die && p3Die) {
        win = true;
        setTimeout(() => {
            goodMessage.style.display = "grid";
            goodText.textContent = "VICTORIA, País 2, ahora estas tierras te pertenecen 👌... (Recarga para una nueva partida)";
            stopZ.style.display = "none";
        }, 3000);  
    }
    if (p1Die && p2Die && !p3Die) {
        win = true;
        setTimeout(() => {
            goodMessage.style.display = "grid";
            goodText.textContent = "VICTORIA, País 3, ahora estas tierras te pertenecen 👌... (Recarga para una nueva partida)";
            stopZ.style.display = "none";
        }, 3000);  
    }
}

//--------Cambiamos la imagen del pais por medio de los botones--------

//pais 1
function col1() {
    pais1.style.backgroundImage = "url('../SOURCES/IMG/col.png')";
    p1Seleccion = 1;
}

function ven1() {
    pais1.style.backgroundImage = "url('../SOURCES/IMG/ven.png')";
    p1Seleccion = 2;
}

function  bra1() {
    pais1.style.backgroundImage = "url('../SOURCES/IMG/bra.png')";
    p1Seleccion = 3;
}

function chi1() {
    pais1.style.backgroundImage = "url('../SOURCES/IMG/chi.png')";
    p1Seleccion = 4;
}

function mex1() {
    pais1.style.backgroundImage = "url('../SOURCES/IMG/mex.png')";
    p1Seleccion = 5;
}

//pais 2
function col2() {
    pais2.style.backgroundImage = "url('../SOURCES/IMG/col.png')";
    p2Seleccion = 1;
}

function ven2() {
    pais2.style.backgroundImage = "url('../SOURCES/IMG/ven.png')";
    p2Seleccion = 2;
}

function  bra2() {
    pais2.style.backgroundImage = "url('../SOURCES/IMG/bra.png')";
    p2Seleccion = 3;
}

function chi2() {
    pais2.style.backgroundImage = "url('../SOURCES/IMG/chi.png')";
    p2Seleccion = 4;
}

function mex2() {
    pais2.style.backgroundImage = "url('../SOURCES/IMG/mex.png')";
    p2Seleccion = 5;
}

//pais 3
function col3() {
    pais3.style.backgroundImage = "url('../SOURCES/IMG/col.png')";
    p3Seleccion = 1;
}

function ven3() {
    pais3.style.backgroundImage = "url('../SOURCES/IMG/ven.png')";
    p3Seleccion = 2;
}

function  bra3() {
    pais3.style.backgroundImage = "url('../SOURCES/IMG/bra.png')";
    p3Seleccion = 3;
}

function chi3() {
    pais3.style.backgroundImage = "url('../SOURCES/IMG/chi.png')";
    p3Seleccion = 4;
}

function mex3() {
    pais3.style.backgroundImage = "url('../SOURCES/IMG/mex.png')";
    p3Seleccion = 5;
}