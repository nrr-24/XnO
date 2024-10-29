const vsButtons = document.querySelector('.vs-button');//1st button list
const vsAlg = document.querySelector('.vs-alg');//2nd button list
const twoPlayers = document.getElementById('twoPlayers');//2 players button
const vsComputer = document.getElementById('vsComputer');//vs computer button
const vsBfs = document.getElementById('vsBfs');//vs bfs button
const twoPlayersSection = document.querySelector('.two-players');//2 players section
const vsComputerSection = document.querySelector('.vs-computer');
const vsBfsSection = document.querySelector('.vs-bfs');
const restartButton = document.getElementById('restartButton')

function twoPlayersGame() {
    twoPlayersSection.style.display = "";
    // vsComputerSection.remove();
    vsButtons.style.display = "none";
    restartButton.style.display = "";
}
twoPlayers.addEventListener('click', twoPlayersGame);

function vsComputerOptions() {
    // vsComputerSection.style.display = "";
    twoPlayersSection.remove();
    vsButtons.style.display = "none";
    vsAlg.style.display = "";
    // restartButton.style.display = "";
}
vsComputer.addEventListener('click', vsComputerOptions); //when vscomputer button clicked

function vsBfsGame() {
    vsBfsSection.style.display = "";
    vsAlg.style.display = "none";
    restartButton.style.display = "";
}
vsBfs.addEventListener('click', vsBfsGame); //when vscomputer button clicked


let currentPlayer = 'X';
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let gameOver = false;

function twoPMakeMove(row, col) {
    if (!gameOver && board[row][col] === '') {
        board[row][col] = currentPlayer;
        document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1}`).textContent = currentPlayer;
        
        if (checkWinOnBoard(board, currentPlayer)) {
            document.getElementById('twoPlayersWinnerText').textContent = `${currentPlayer} wins!`;
            gameOver = true;
        } else if (checkTie()) {
            document.getElementById('twoPlayersWinnerText').textContent = "It's a tie!";
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

// function vsComMakeMove(row, col) {
//     if (!gameOver && board[row][col] === '') {
//         board[row][col] = currentPlayer;
//         document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1}`).textContent = currentPlayer;

//         if (checkWin()) {
//             document.getElementById('vsComputerWinnerText').textContent = `${currentPlayer} wins!`;
//             gameOver = true;
//         } else if (checkTie()) {
//             document.getElementById('vsComputerWinnerText').textContent = "It's a tie!";
//             gameOver = true;
//         } else {
//             currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

//             if (!gameOver && currentPlayer === 'O') {
//                 setTimeout(makeComputerMove, 500); 
//             }
//         }
//     }
// }


// function makeComputerMove() {
//     if (!gameOver) {
//         let row, col;
//         do {
//             row = Math.floor(Math.random() * 3);
//             col = Math.floor(Math.random() * 3);
//         } while (board[row][col] !== '');
        
//         vsComMakeMove(row, col);
//     }
// }

function vsBfsMakeMove(row, col) {
    if (!gameOver && board[row][col] === '') {
        board[row][col] = currentPlayer;
        document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1}`).textContent = currentPlayer;

        if (checkWin()) {
            document.getElementById('vsComputerWinnerText').textContent = `${currentPlayer} wins!`;
            gameOver = true;
        } else if (checkTie()) {
            document.getElementById('vsComputerWinnerText').textContent = "It's a tie!";
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (!gameOver && currentPlayer === 'O') {
                setTimeout(makeBfsMove, 500); 
            }
        }
    }
}


function makeBfsMove() {
    if (!gameOver) {
        // BFS Queue holds possible game states, initialized with the current board state
        let queue = [{ board: JSON.parse(JSON.stringify(board)), move: null }];//copy of board(passed as a string) along with variable move set to null
        let visited = new Set();  // Track visited states to avoid revisiting

        while (queue.length > 0) {
            let { board: currentBoard, move } = queue.shift();//This method removes the first element from the queue array and returns it. The queue is structured as an array of objects, where each object contains properties for board and move.

            // Check if a winning move for 'O' is available in the current state
            if (checkWinOnBoard(currentBoard, 'O')) {
                vsBfsMakeMove(move.row, move.col);  // Apply the winning move
                return;
            }

            // Check if a blocking move for 'X' is necessary
            if (checkWinOnBoard(currentBoard, 'X')) {
                vsBfsMakeMove(move.row, move.col);  // Block the opponent's winning move
                return;
            }

            // Generate all possible moves for 'O' and add to queue
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (currentBoard[row][col] === '') {
                        // Create a new board state with the move applied
                        let newBoard = JSON.parse(JSON.stringify(currentBoard));
                        newBoard[row][col] = 'O';

                        // Convert the board to a unique string to avoid revisiting
                        let boardState = JSON.stringify(newBoard);
                        if (!visited.has(boardState)) {
                            visited.add(boardState);
                            queue.push({ board: newBoard, move: { row, col } });
                        }
                    }
                }
            }
        }

        // if no wins or blocks
        makeRandomMove();
    }
}

function checkWinOnBoard(boardConfig, player) {
    for (let i = 0; i < 3; i++) {
        if (
            (boardConfig[i][0] === player && boardConfig[i][1] === player && boardConfig[i][2] === player) ||
            (boardConfig[0][i] === player && boardConfig[1][i] === player && boardConfig[2][i] === player)
        ) {
            return true;
        }//checks for horizontal and vertical wins
    }
    
    return (
        (boardConfig[0][0] === player && boardConfig[1][1] === player && boardConfig[2][2] === player) ||
        (boardConfig[0][2] === player && boardConfig[1][1] === player && boardConfig[2][0] === player)
    ); //checks for diagonal wins
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (
            (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer) ||
            (board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer)
        ) {
            return true;
        }
    }
    
    if (
        (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) ||
        (board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer)
    ) {
        return true;
    }
    
    return false;
}

// Fallback move for random placement if no BFS move is found
function makeRandomMove() {
    let row, col;
    do {
        row = Math.floor(Math.random() * 3);
        col = Math.floor(Math.random() * 3);
    } while (board[row][col] !== '');
    vsBfsMakeMove(row, col);
}

function checkTie() {
    for (let row of board) {
        if (row.includes('')) {
            return false;
        }
    }
    return true;
}

function restartGame() {
    location.reload();
}
restartButton.addEventListener('click', restartGame);