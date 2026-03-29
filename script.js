const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const undoBtn = document.getElementById('undoBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let moveHistory = []; // Keeps track of moves for the Undo feature

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle a cell being clicked
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    // Save move for undo
    moveHistory.push(index);

    // Update board and UI
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    
    // Add the specific class to trigger the CSS color and animation
    cell.classList.add(currentPlayer === 'X' ? 'player-x' : 'player-o');

    checkWinner();
}

// Check if someone won or if it's a draw
function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        statusText.style.color = currentPlayer === 'X' ? '#ef4444' : '#3b82f6';
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        statusText.textContent = 'Game Ended in a Draw!';
        statusText.style.color = '#555';
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Restart the game completely
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    moveHistory = [];
    statusText.textContent = `Player X's Turn`;
    statusText.style.color = '#555';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player-x', 'player-o');
    });
}

// Undo the last move
function undoMove() {
    if (moveHistory.length === 0 || !gameActive) return;

    const lastMoveIndex = moveHistory.pop();
    board[lastMoveIndex] = '';
    
    const cell = document.querySelector(`.cell[data-index="${lastMoveIndex}"]`);
    cell.textContent = '';
    cell.classList.remove('player-x', 'player-o');

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
undoBtn.addEventListener('click', undoMove);
