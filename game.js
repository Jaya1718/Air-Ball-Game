// Get elements from the DOM
const startButton = document.getElementById('start-button');
const startGameButton = document.getElementById('start-game-button');
const endButton = document.getElementById('end-button');
const retryButton = document.getElementById('retry-button');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const timerDisplay = document.getElementById('timer');
const gameCanvas = document.getElementById('gameCanvas');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over');
const mainMenu = document.getElementById('main-menu');

// Game variables
let score = 0;
let gameInterval;
let timerInterval;
let timeRemaining = 60;
let gameRunning = false;

// Game setup
const canvas = gameCanvas.getContext('2d');
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;
let waterDrops = [];
let pollutedDrops = [];

// Drop class to create water and polluted drops
class Drop {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.type = type; // 'water' or 'polluted'
        this.speed = 3;
    }

    draw() {
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        canvas.fillStyle = this.type === 'water' ? 'blue' : 'red';
        canvas.fill();
        canvas.closePath();
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}

// Spawn water or polluted drops randomly
function spawnDrop() {
    let x = Math.random() * canvasWidth;
    let type = Math.random() < 0.8 ? 'water' : 'polluted'; // 80% water, 20% polluted
    let drop = new Drop(x, 0, type);
    if (type === 'water') {
        waterDrops.push(drop);
    } else {
        pollutedDrops.push(drop);
    }
}

// Detect collision with touch or mouse
gameCanvas.addEventListener('click', function (event) {
    const x = event.offsetX;
    const y = event.offsetY;

    // Check for collision with water drops
    waterDrops = waterDrops.filter(drop => {
        if (Math.hypot(drop.x - x, drop.y - y) < drop.size) {
            score += 10;  // Add points for water drops
            scoreDisplay.textContent = `Score: ${score}`;
            return false; // Remove the collected water drop
        }
        return true;
    });

    // Check for collision with polluted drops
    pollutedDrops = pollutedDrops.filter(drop => {
        if (Math.hypot(drop.x - x, drop.y - y) < drop.size) {
            score -= 5;  // Deduct points for polluted drops
            scoreDisplay.textContent = `Score: ${score}`;
            return false; // Remove the collected polluted drop
        }
        return true;
    });
});

// Game update function
function updateGame() {
    canvas.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update all drops
    waterDrops.forEach(drop => drop.update());
    pollutedDrops.forEach(drop => drop.update());

    // Spawn new drops periodically
    if (Math.random() < 0.05) {
        spawnDrop();
    }

    // Check if any drop reaches the bottom
    waterDrops = waterDrops.filter(drop => drop.y < canvasHeight);
    pollutedDrops = pollutedDrops.filter(drop => drop.y < canvasHeight);
}

// Timer countdown
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.textContent = `Time Remaining: ${timeRemaining}s`;
        } else {
            clearInterval(timerInterval);
            endGame(); // End the game when time is up
        }
    }, 1000);
}

// Start game
function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timeRemaining = 60;
    timerDisplay.textContent = `Time Remaining: ${timeRemaining}s`; // Initialize timer
    waterDrops = [];
    pollutedDrops = [];
    gameRunning = true;
    gameInterval = setInterval(updateGame, 50);
    startTimer(); // Start the timer countdown
    mainMenu.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

// End game and display final score with retry button
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval); // Stop the timer
    gameRunning = false;
    waterDrops = [];
    pollutedDrops = [];
    canvas.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas

    // Show the game-over screen with the final score
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Retry button functionality
retryButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startGame();
});

// Start button functionality
startButton.addEventListener('click', () => {
    startGame();
});

// End button functionality
endButton.addEventListener('click', () => {
    if (gameRunning) {
        endGame();
    }
});
