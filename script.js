// DOM Elements
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.querySelector('.turn-indicator');
const restartBtn = document.querySelector('.restart-btn');
const undoBtn = document.querySelector('.undo-btn');

// Game State Variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let history = []; // Stores past board states for the undo feature

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle Cell Clicks
function handleCellClick(e) {
    const cell = e.target.closest('.cell'); // Ensures we target the cell even if the span is clicked
    if (!cell) return;
    
    const index = Array.from(cells).indexOf(cell);

    // Prevent move if cell is occupied or game is over
    if (board[index] !== '' || !gameActive) return;

    // Save the current state to history BEFORE making the move
    history.push({
        board: [...board],
        currentPlayer: currentPlayer
    });

    // Update board and UI with the animation span
    board[index] = currentPlayer;
    cell.innerHTML = `<span class="pop-animation">${currentPlayer}</span>`;
    
    // Check for win or draw
    checkWin();
}

// Check for Win or Draw
function checkWin() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        turnIndicator.innerText = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        turnIndicator.innerText = 'Game Ended in a Draw!';
        gameActive = false;
        return;
    }

    // Switch turns
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
}

// Restart Game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    history = [];
    turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => cell.innerHTML = '');
}

// Undo Last Move
function undoMove() {
    if (history.length === 0) return; 

    // Pop the last saved state
    const previousState = history.pop();
    board = [...previousState.board];
    currentPlayer = previousState.currentPlayer;
    gameActive = true; 
    
    // Update the UI to reflect the old state
    cells.forEach((cell, index) => {
        if (board[index] !== '') {
            cell.innerHTML = `<span class="pop-animation">${board[index]}</span>`;
        } else {
            cell.innerHTML = '';
        }
    });
    turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);
