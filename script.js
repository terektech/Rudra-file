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

// Update turn indicator text and colour class
function updateTurnIndicator(text, player) {
    turnIndicator.innerText = text;
    turnIndicator.classList.remove('x-turn', 'o-turn');
    if (player === 'X') turnIndicator.classList.add('x-turn');
    if (player === 'O') turnIndicator.classList.add('o-turn');
}

// Render a mark in a cell with the correct player class
function renderMark(cell, player) {
    cell.classList.add(player === 'X' ? 'x-cell' : 'o-cell', 'taken');
    cell.innerHTML = `<span class="pop-animation">${player}</span>`;
}

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

    // Update board and UI
    board[index] = currentPlayer;
    renderMark(cell, currentPlayer);

    // Check for win or draw
    checkWin();
}

// Check for Win or Draw
function checkWin() {
    let winCombo = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') continue;
        if (board[a] === board[b] && board[b] === board[c]) {
            winCombo = winningConditions[i];
            break;
        }
    }

    if (winCombo) {
        updateTurnIndicator(`Player ${currentPlayer} Wins! 🎉`, null);
        winCombo.forEach(i => cells[i].classList.add('winner'));
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        updateTurnIndicator("It's a Draw! 🤝", null);
        gameActive = false;
        return;
    }

    // Switch turns
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator(`Player ${currentPlayer}'s Turn`, currentPlayer);
}

// Restart Game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    history = [];
    updateTurnIndicator(`Player ${currentPlayer}'s Turn`, currentPlayer);
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('x-cell', 'o-cell', 'taken', 'winner');
    });
}

// Undo Last Move
function undoMove() {
    if (history.length === 0) return;

    // Pop the last saved state
    const previousState = history.pop();
    board = [...previousState.board];
    currentPlayer = previousState.currentPlayer;
    gameActive = true;

    // Re-render the entire board from the restored state
    cells.forEach((cell, index) => {
        cell.classList.remove('x-cell', 'o-cell', 'taken', 'winner');
        if (board[index] !== '') {
            renderMark(cell, board[index]);
        } else {
            cell.innerHTML = '';
        }
    });

    updateTurnIndicator(`Player ${currentPlayer}'s Turn`, currentPlayer);
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);

// Set initial turn indicator colour on load
updateTurnIndicator(`Player ${currentPlayer}'s Turn`, currentPlayer);
