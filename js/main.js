// Function constructor of GOMOKU board game
function BoardGame() {
    // If it's player's turn
    this.isMyTurn = true;
    // Player's last step
    this.playerLastRecord = {};
    // Computer's last step
    this.compuLastRecord = {};
    // Player's steps record
    this.logRecord = [];
    // Computer's steps record
    this.logRecordCompu = [];
    // Computer's the next available step
    this.compuAvail = [];
    // Chess board matrix
    this.boardMatrix = [];
    // Player's win matrix
    this.playerWinMatrix = [];
    // Computer's win matrix
    this.compuWinMatrix = [];
    // Computer's expected next step
    this.expectedCompuX = 0;
    this.expectedCompuY = 0;
    // If win or not
    this.isWin = false;
    // If the game is over or not
    this.gameOver = false;
};

// Create a board game
var board = new BoardGame();
initMatrix();

function initMatrix() {
    // Create matrix
    board.boardMatrix = createMatrix(board.boardMatrix, 0);
    board.playerWinMatrix = createMatrix(board.playerWinMatrix, 0);
    board.compuWinMatrix = createMatrix(board.compuWinMatrix, 0);
}

function createMatrix(arr, value) {
    for (var i = 0; i < 14; i++) {
        arr[i] = [];
        for (var j = 0; j < 14; j++) {
            arr[i][j] = value;
        }
    }
    return arr;
}

function setScriptTag(src) {
    var script = document.createElement('script');

    script.setAttribute('src', src);
    document.head.appendChild(script);
}

// Render Canvas or DOM as the chess board depending on the browser's support
function renderBoard() {
    // 於此將 !!window.HTMLCanvasElement 改為 false，可更改為渲染 DOM 
    if(!!window.HTMLCanvasElement){
        // Render Chess Board with canvas
        canvas = document.getElementById("boardCanvas");
        ctx = canvas.getContext("2d");
        
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                ctx.beginPath();
                ctx.strokeRect(i*30, j*30, 30, 30);
                ctx.strokeStyle = '#191970';
                ctx.closePath();
            }
        }

        // Include script tag & text
        setScriptTag('./js/main-Canvas.js');

        // Click event on the canvas
        canvas.addEventListener('click', function() {
            coords = canvas.relMouseCoords(event);

            if(!board.gameOver && board.isMyTurn){
                getClosestCoord(coords.x, coords.y);
            }
        }, false);
    }else{
        // Render Chess Board with DOM
        var boardDOM = document.getElementById("boardDOM");
        var boardCell = document.getElementsByClassName("board-cell");
        document.getElementById("boardCanvas").style.display = "none";
        
        for (var i = 0; i < 14; i++) {
            boardDOM.insertAdjacentHTML('beforeend', '<div class="board-row d-flex flex-row">');
            for (var j = 0; j < 14; j++) {
                var boardRowDOM = document.querySelectorAll('.board-row');
                var boardCellDOMstr = '<div class="board-cell" data-i="' + i + '" data-j="' + j + '"></div>';
                
                boardRowDOM[i].insertAdjacentHTML('beforeend', boardCellDOMstr);
            }
            boardDOM.insertAdjacentHTML('beforeend', '</div>');
        }

        // Include script tag
        setScriptTag('./js/main-DOM.js');

        for(var i=0; i<boardCell.length; i++) {
            boardCell[i].addEventListener("click", function(e) {
                coords = {};
                coords.i = parseInt(e.toElement.dataset.i, 10);
                coords.j = parseInt(e.toElement.dataset.j, 10);

                if(isNaN(coords.i)){return;}

                if(!board.gameOver && board.isMyTurn){
                    if(myIndexOf(board.logRecord, coords) === -1){
                        console.log(board.logRecord);
                        console.log(coords);
                        recordCoordDOM(coords, '#fff');
                        setChessDOM(coords, '#fff');

                        // Check if win or not
                        checkFourDirectForWin(board.playerLastRecord, board.playerWinMatrix, 1);
                        if(board.isMyTurn && board.isWin){
                            document.getElementById('whoWins').innerHTML = '<h3 class="text-danger">Congrats! You won!</h3>';
                            board.gameOver = true;
                        }else{
                            setTimeout(execDOMCompuPlay(), 500);
                        }
                    }
                }
            });
        }
    }
}