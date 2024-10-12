// Definitie van variabelen voor spelers en scores
var playerRed = "R"; // Symbool voor speler Rood
var playerYellow = "Y"; // Symbool voor speler Geel
var currPlayer = playerRed; // Huidige speler, begint met Rood

var playerScoreRed = 0; // Score van speler Rood
var playerScoreYellow = 0; // Score van speler Geel

// Variabelen voor spelstatus en spelbord
var highScore = getHighScore(); // Haal de highscore op bij het laden van de pagina
var gameOver = false; // Geeft aan of het spel voorbij is
var board; // Het spelbord
var rows = 6; // Aantal rijen in het spelbord
var columns = 7; // Aantal kolommen in het spelbord
var currColumns = []; // Houdt bij welke rij de volgende zet in elke kolom moet zijn

// Timer variabelen
var timerIntervalRed; // Interval voor timer van speler Rood
var timerIntervalYellow; // Interval voor timer van speler Geel
var timerRed = 10; // Initiële timer voor speler Rood
var timerYellow = 10; // Initiële timer voor speler Geel

// Wanneer de pagina geladen is, wordt de setGame functie aangeroepen
window.onload = function () {
    // Haal de opgeslagen highscore op en toon deze
    let savedHighscoreYellow = getCookie("yellowHighScore");
    let savedHighscoreRed = getCookie("redHighScore");
    if (savedHighscoreRed) {
        scoreRed.innerText = "HighScoreRed: " + savedHighscoreRed;
    }
    if (savedHighscoreYellow) {
        scoreYellow.innerText = "HighScoreYellow: " + savedHighscoreYellow;
    }
    setGame(); // Start het spel
}; 

// Functie om het spel in te stellen
function setGame() {
    currPlayer = playerRed; // Begin met speler Rood
    gameOver = false; // Reset de spelstatus naar actief
    updateTimer("timerRed", timerRed); // Update de timer voor speler Rood
    updateTimer("timerYellow", timerYellow); // Update de timer voor speler Geel

    board = []; // Leeg het spelbord
    currColumns = [5, 5, 5, 5, 5, 5, 5]; // Zet de kolommen voor de volgende zet terug naar het begin

    var boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Wis het spelbord in de HTML

    // Genereer het spelbord in de HTML
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' '); // Voeg lege cellen toe aan het spelbord

            let tile = document.createElement("div"); // Creëer een div element voor elk vakje op het spelbord
            tile.id = r.toString() + "-" + c.toString(); // Geef elk vakje een uniek id
            tile.classList.add("tile"); // Voeg de "tile" class toe aan elk vakje
            tile.addEventListener("click", setPiece); // Voeg een click event listener toe aan elk vakje
            boardElement.append(tile); // Voeg het vakje toe aan het spelbord in de HTML
        }
        board.push(row); // Voeg de rij toe aan het spelbord
    }
}

// Functie om het spel te starten
function startGame() {
    setGame(); // Reset het spel
    startTimer("timerRed", timerRed); // Start de timer voor speler Rood
}

// Functie om een spelstuk te plaatsen
function setPiece() {
    if (gameOver) {
        return; // Stop als het spel voorbij is
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c]; // Bepaal op welke rij het spelstuk terechtkomt

    if (r < 0) {
        return; // Stop als de kolom vol is
    }

    board[r][c] = currPlayer; // Plaats het spelstuk op het spelbord
    let tile = document.getElementById(r.toString() + "-" + c.toString()); // Vind het HTML-element voor het betreffende vakje
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece"); // Voeg de klasse toe voor het spelstuk van speler Rood
    } else {
        tile.classList.add("yellow-piece"); // Voeg de klasse toe voor het spelstuk van speler Geel
    }

    r -= 1; // Ga naar de volgende rij voor de volgende zet in dezelfde kolom
    currColumns[c] = r; // Update de rij voor de volgende zet in dezelfde kolom

    checkWinner(); // Controleer of er een winnaar is
    updateScore(); // Update de score

    // Wissel van speler en start de timer voor de volgende speler
    if (!gameOver) {
        switchPlayer(); // Wissel van speler na een zet

        if (currPlayer == playerRed) {
            pauseTimer(timerIntervalYellow); // Pauzeer de timer van speler Geel
            resumeTimer("timerRed", timerRed); // Hervat de timer van speler Rood
        } else {
            pauseTimer(timerIntervalRed); // Pauzeer de timer van speler Rood
            resumeTimer("timerYellow", timerYellow); // Hervat de timer van speler Geel
        }
    }
}

// Functie om de timer te starten voor de actieve speler
function startTimer(timerId, initialTime) {
    clearInterval(timerIntervalRed); // Stop eventuele lopende timers voor speler Rood
    clearInterval(timerIntervalYellow); // Stop eventuele lopende timers voor speler Geel

    let timer = initialTime; // Initialiseer de timer met de opgegeven waarde

    updateTimer(timerId, timer); // Update de timer in de HTML

    // Start de timer voor de actieve speler
    if (currPlayer == playerRed) {
        timerIntervalRed = setInterval(function () {
            timer--; // Verminder de timer

            // Stop de timer en wissel van speler als de tijd op is
            if (timer <= 0) {
                clearInterval(timerIntervalRed); // Stop de timer
                timer = 10; // Reset de timer
                switchPlayer(); // Wissel van speler wanneer de tijd op is
                updateScore(true); // Verminder een punt voor het opraken van de tijd
                resumeTimer("timerYellow", timerYellow); // Hervat de timer van speler Geel
            }

            updateTimer(timerId, timer); // Update de timer in de HTML
        }, 1000);
    } else {
        timerIntervalYellow = setInterval(function () {
            timer--; // Verminder de timer

            // Stop de timer en wissel van speler als de tijd op is
            if (timer <= 0) {
                clearInterval(timerIntervalYellow); // Stop de timer
                timer = 10; // Reset de timer
                switchPlayer(); // Wissel van speler wanneer de tijd op is
                updateScore(true); // Verminder een punt voor het opraken van de tijd
                resumeTimer("timerRed", timerRed); // Hervat de timer van speler Rood
            }

            updateTimer(timerId, timer); // Update de timer in de HTML
        }, 1000);
    }
}

// Functie om de timer te pauzeren
function pauseTimer(interval) {
    clearInterval(interval); // Stop de opgegeven timer
}

// Functie om de timer te hervatten
function resumeTimer(timerId, remainingTime) {
    startTimer(timerId, remainingTime); // Hervat de timer met de resterende tijd
}

// Functie om de timer in de HTML bij te werken
function updateTimer(timerId, timer) {
    document.getElementById(timerId).innerText = "Tijd: " + timer + "s";
}

// Functie om van speler te wisselen
function switchPlayer() {
    if (currPlayer == playerRed) {
        currPlayer = playerYellow; // Wissel naar speler Geel
    } else {
        currPlayer = playerRed; // Wissel naar speler Rood
    }
}

// Functie om te controleren of er een winnaar is
function checkWinner() {
    // Loop door alle vakjes op het spelbord
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== ' ') {
                // Controleer in alle richtingen vanaf elk vakje of er een winnende combinatie is
                if (
                    checkDirection(r, c, 1, 0) || // Verticale richting
                    checkDirection(r, c, 0, 1) || // Horizontale richting
                    checkDirection(r, c, 1, 1) || // Diagonale richting (\)
                    checkDirection(r, c, 1, -1) // Diagonale richting (/)
                ) {
                    setWinner(r, c); // Markeer de winnaar en beëindig het spel
                    return;
                }
            }
        }
    }

    // Als het spelbord vol is, eindigt het spel in een gelijkspel
    if (isBoardFull()) {
        document.getElementById("winner").innerText = "Gelijkspel!";
        gameOver = true;
        setTimeout(restartGame, 2000); // Start het spel opnieuw na 2 seconden
    }
}

// Functie om in een specifieke richting te controleren op een winnende combinatie
function checkDirection(row, col, rowDir, colDir) {
    let player = board[row][col];
    for (let i = 1; i < 4; i++) {
        let newRow = row + i * rowDir;
        let newCol = col + i * colDir;

        // Controleer of het vakje buiten het spelbord ligt of niet van dezelfde speler is
        if (
            newRow < 0 ||
            newRow >= rows ||
            newCol < 0 ||
            newCol >= columns ||
            board[newRow][newCol] !== player
        ) {
            return false; // Geen winnende combinatie in deze richting
        }
    }
    return true; // Er is een winnende combinatie in deze richting
}

// Functie om te controleren of het spelbord vol is
function isBoardFull() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == ' ') {
                return false; // Het spelbord is niet vol, er kunnen nog zetten worden gedaan
            }
        }
    }
    return true; // Het spelbord is vol
}

// Functie om de winnaar van het spel aan te geven
function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Rood Wint"; // Speler Rood heeft gewonnen
        playerScoreRed++; // Verhoog de score van speler Rood
    } else {
        winner.innerText = "Geel Wint"; // Speler Geel heeft gewonnen
        playerScoreYellow++; // Verhoog de score van speler Geel
    }
    
    updateScore(); // Update de score
    
    // Update de highscore indien nodig
    if (currPlayer == playerRed && playerScoreRed > highScore) {
        highScore = playerScoreRed;
        setHighScore(false, playerScoreRed);
        
    } else if (currPlayer == playerYellow && playerScoreYellow > highScore) {
        highScore = playerScoreYellow;
        setHighScore(true, playerScoreYellow);
    }

    gameOver = true; // Markeer het spel als voorbij

    setTimeout(restartGame, 2000); // Start het spel opnieuw na 2 seconden
}

// Functie om de score bij te werken
function updateScore(outOfTime = false) {
    if (outOfTime) {
        if (currPlayer == playerRed) {
            playerScoreYellow++; // Verhoog de score van speler Geel als de tijd op is voor speler Rood
        } else {
            playerScoreRed++; // Verhoog de score van speler Rood als de tijd op is voor speler Geel
        }
    }

    // Update de scores in de HTML
    document.getElementById("scoreRed").innerText = "Rood Score: " + playerScoreRed;
    document.getElementById("scoreYellow").innerText = "Geel Score: " + playerScoreYellow;
}

// Functie om het spel opnieuw te starten
function restartGame() {
    document.getElementById("winner").innerText = ""; // Wis het winnaarsbericht
    setGame(); // Reset het spel
}

// Functie om de highscore in te stellen
function setHighScore(playerYellowWon, score = 5) {
    const cname = playerYellowWon ? "yellowHighScore" : "redHighScore"; // Kies de juiste cookie naam op basis van de winnaar
    document.cookie = cname + "=" + score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT"; // Stel de cookie in met de highscore
}

// Functie om de highscore op te halen
function getHighScore(playerYellowWon) {
    const cname = playerYellowWon ? "yellowHighScore" : "redHighScore"; // Kies de juiste cookie naam op basis van de winnaar
    const cookies = document.cookie.split(';'); // Splits alle cookies
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cname + '=')) {
            return parseInt(cookie.substring(cname.length + 1), 10); // Haal de highscore uit de cookie
        }
    }
    return 0; // Geen highscore gevonden, geef 0 terug
}

// Functie om een cookie op te halen
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
