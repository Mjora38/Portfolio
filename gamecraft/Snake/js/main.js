let blockSize = 30;
let rows = 15;
let cols = 15;
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

let foodX;
let foodY;

let score = 0;

let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", veranderRichting);

    start();
    document.getElementById("highscore").innerHTML = getHighscore();
}

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "burlywood";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "#834f35";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        document.getElementById("score").innerHTML = score;
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "#4fa033";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        gameOver = true;
        alert("Game Over");
        editHighscore();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over");
            editHighscore();
        }
    }
}

function veranderRichting(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function startAgain() {
    let answer = prompt("Wil je opnieuw spelen?");
    if (answer == "ja") {
        window.location.reload();
    }
    else if (answer == "nee") {
        alert("jammer");
    }
    else {
        alert(`Vul een geldig antwoord in (ja of nee)`);
        startAgain();
    }
}

function start() {
    let naam = prompt("Wat is je naam?")
    let snelheid = prompt(`Welkom ${naam} kies je snelheidsgraad (Sloom, Normaal, Snel)`);
    if (snelheid == "sloom") {
        setInterval(update, 1000 / 1);
    }
    else if (snelheid == "normaal") {
        setInterval(update, 1000 / 5);
    }
    else if (snelheid == "snel") {
        setInterval(update, 1000 / 10);
    }
    else {
        alert("Vul een geldige snelheidsgraad in!")
        start();
    }
}

function editHighscore() {
    const currentHighscore = getHighscore();
    if (score > currentHighscore) {
        setHighscore(score);
        alert(`Gefeliciteerd! Je nieuwe highscore is: ${score}`);
        document.getElementById("highscore").innerHTML = score;
        startAgain();
    }
    else if (score < currentHighscore) {
        alert(`Final score die je hebt behaald is ${score}, volgende keer beter`);
        startAgain();
    }
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const keyValue = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
    return keyValue ? keyValue[2] : null;
}

function getHighscore() {
    return parseInt(getCookie('highscore')) || 0;
}

function setHighscore(score) {
    setCookie('highscore', score, 365);
}