// Record the last step and each step
function recordCoordDOM(coords, color) {
    if(color === '#fff'){
        board.playerLastRecord = coords;
        board.boardMatrix[coords.i][coords.j] = 1;
        board.playerWinMatrix[coords.i][coords.j] = 1;
    }else{
        board.compuLastRecord = coords;
        board.boardMatrix[coords.i][coords.j] = 2;
        board.compuWinMatrix[coords.i][coords.j] = 2;
    }
    board.logRecord.push(coords);

    // for(var i=0; i<board.logRecord.length; i++) {
    //     var unclickableBoardCell = document.querySelector("[data-i='" + board.logRecord[i].i + "'][data-j='" + board.logRecord[i].j + "']");
    //     unclickableBoardCell.addEventListener("click", function(e) {
    //         e.preventDefault();
    //     });
    // }
}

// Set a circle of a mouse click on the DOM
function setChessDOM(coords, color) {
    var boardCell = document.querySelectorAll(".board-cell");
    var chessDOM = document.createElement("span");

    chessDOM.classList.add("chessDOM");
    chessDOM.style.backgroundColor = color;
    
    for(var i=0; i<boardCell.length; i++){
        if(parseInt(boardCell[i].dataset.i, 10)==coords.i && parseInt(boardCell[i].dataset.j, 10)==coords.j){
            boardCell[i].appendChild(chessDOM);
        }
    }
}

// Check if win or not
function checkFourDirectForWin(lastRecord, matrix, value){
    var serialCount = 0;
    var i = lastRecord.i;
    var j = lastRecord.j;

    // Horizontal
    for(var a=0; a<10; a++){
        for(var b=0; b<5; b++){
            if(matrix[i][a+b]==value){
                serialCount++;

                if(serialCount==5){
                    board.isWin = true;
                }
            }
        }
        serialCount = 0;
    }
    // Vertical
    for(var a=0; a<10; a++){
        for(var b=0; b<5; b++){
            if(matrix[a+b][j]==value){
                serialCount++;

                if(serialCount==5){
                    board.isWin = true;
                }
            }
        }
        serialCount = 0;
    }
    // Backslash
	for (var a=0; a<10; a++) {
		for (var b=0; b<10; b++) {
			for (var c=0; c<5; c++) {
				if(matrix[a+c][b+c]==value){
                    serialCount++;
    
                    if(serialCount==5){
                        board.isWin = true;
                    }
                }
            }
            serialCount = 0;
		}
    }
    // Slash
    for (var a=0; a<10; a++) {
		for (var b=13; b>3; b--) {
			for (var c=0; c<5; c++) {
				if(matrix[a+c][b-c]==value){
                    serialCount++;
    
                    if(serialCount==5){
                        board.isWin = true;
                    }
                }
            }
            serialCount = 0;
		}
    }
}

// Computer's turn
function execDOMCompuPlay() {
    board.isMyTurn = false;
    checkDOMChessAround();
    board.isMyTurn = true;
}

function checkDOMChessAround() {
    var compuCoords = {};

    checkFourDirectForSerial(board.playerLastRecord, board.boardMatrix);

    // If not one to match, then choose the nearest one
    if(board.expectedCompuX==0 && board.expectedCompuY==0){
        var compuAvailPath = [];

        for (var i = 0; i < 14; i++) {
            for (var j = 0; j < 14; j++) {
                if(board.boardMatrix[i][j]==0){ // Empty
                    var a = board.playerLastRecord.i - i;
                    var b = board.playerLastRecord.j - j;
                    var c = Math.sqrt(a*a + b*b);

                    compuAvailPath.push({coords: {i: i, j: j}, theShortestPath: c});
                }
            }
        }
        compuCoords = compuAvailPath.getMin('theShortestPath').coords;
    }else{
        compuCoords.i = board.expectedCompuX;
        compuCoords.j = board.expectedCompuY;
    }

    if(myIndexOf(board.logRecord, compuCoords) === -1){
        recordCoordDOM(compuCoords, '#000');
        setChessDOM(compuCoords, '#000');

        // Check if win or not
        checkFourDirectForWin(compuCoords, board.compuWinMatrix, 2);
        if(!board.gameOver && !board.isMyTurn && board.isWin){
            document.getElementById('whoWins').innerHTML = '<h3 class="text-danger">Oops! Computer has won!</h3>';
            board.gameOver = true;
        } 
    }
}

Array.prototype.getMin = function(attrib) {
    return this.reduce(function(prev, curr){ 
        return prev[attrib] < curr[attrib] ? prev : curr; 
    });
}

function checkFourDirectForSerial(lastRecord, matrix){
    // Empty、White、Black Counter
    var serialCountE = 0, serialCountW = 0, serialCountB = 0;
    // Expected coords for computer's next step
    var expectedCompuX = 0, expectedCompuY = 0;
    // If end the check or not
    var endCheck = false;
    // Transform lastRecord to matrix index
    var i = lastRecord.i;
    var j = lastRecord.j;

    // Find one of patterns like 01111, 10111, 11011, 11101, 11110 
    // Check there's the one empty chess in 4 directions
    checkHoriz(1, 4);
    checkVerti(1, 4);
    checkSlash(1, 4);
    checkBackslash(1, 4);

    // Find one of patterns like 00111, 01011, 01101, 01110, 10110, 11010, 11100
    // Check there's 2 empty chesses in 4 directions
    checkHoriz(2, 3);
    checkVerti(2, 3);
    checkSlash(2, 3);
    checkBackslash(2, 3);

    checkHoriz(3, 2);
    checkVerti(3, 2);
    checkSlash(3, 2);
    checkBackslash(3, 2);

    // Horizontal
    function checkHoriz(eValue, bwValue) {
        if(!endCheck){
            for(var a=0; a<14; a++){
                for(var b=0; b<10; b++){
                    for(var c=0; c<5; c++){
                        if(matrix[a][b+c]==0){
                            serialCountE++;
                            expectedCompuX = a;
                            expectedCompuY = b+c;    
                        }else if(matrix[a][b+c]==1){
                            serialCountW++;
                        }else if(matrix[a][b+c]==2){
                            serialCountB++;
                        }
                    }
        
                    checkSerialCount(eValue, bwValue, expectedCompuX, expectedCompuY);
                    if(endCheck){
                        return;
                    }
                }
            }
        }
    }
    // Vertical
    function checkVerti(eValue, bwValue) {
        if(!endCheck){
            for(var c=0; c<14; c++){
                for(var a=0; a<10; a++){
                    for(var b=0; b<5; b++){
                        if(matrix[a+b][c]==0){
                            serialCountE++;
                            expectedCompuX = a+b;
                            expectedCompuY = c;
                        }else if(matrix[a+b][c]==1){
                            serialCountW++;
                        }else if(matrix[a+b][c]==2){
                            serialCountB++;
                        }
                    }
    
                    checkSerialCount(eValue, bwValue, expectedCompuX, expectedCompuY);
                    if(endCheck){
                        return;
                    }
                }
            }
            
        }
    }
    // Slash
    function checkSlash(eValue, bwValue) {
        if(!endCheck){
            for (var a=0; a<10; a++) {
                for (var b=13; b>3; b--) {
                    for (var c=0; c<5; c++) {
                        if(matrix[a+c][b-c]==0){
                            serialCountE++;
                            expectedCompuX = a+c;
                            expectedCompuY = b-c;
                        }else if(matrix[a+c][b-c]==1){
                            serialCountW++;
                        }else if(matrix[a+c][b-c]==2){
                            serialCountB++;
                        }
                    }

                    checkSerialCount(eValue, bwValue, expectedCompuX, expectedCompuY);
                    if(endCheck){
                        return;
                    }
                }
            }
        }
    }
    // Backslash
    function checkBackslash(eValue, bwValue) {
        if(!endCheck){
            for (var a=0; a<10; a++) {
                for (var b=0; b<10; b++) {
                    for (var c=0; c<5; c++) {
                        if(matrix[a+c][b+c]==0){
                            serialCountE++;
                            expectedCompuX = a+c;
                            expectedCompuY = b+c;
                        }else if(matrix[a+c][b+c]==1){
                            serialCountW++;
                        }else if(matrix[a+c][b+c]==2){
                            serialCountB++;
                        }
                    }

                    checkSerialCount(eValue, bwValue, expectedCompuX, expectedCompuY);
                    if(endCheck){
                        return;
                    }
                }
            }
        }
    }
    // Check Serial Count
    function checkSerialCount(eValue, bwValue, expectedCompuX, expectedCompuY){
        if((serialCountE==eValue && serialCountB==bwValue) || (serialCountE==eValue && serialCountW==bwValue)){
            board.expectedCompuX = expectedCompuX;
            board.expectedCompuY = expectedCompuY;
            console.log(expectedCompuX, expectedCompuY);
            return endCheck = true;
        }else{ 
            serialCountE = 0;
            serialCountW = 0;
            serialCountB = 0;
            board.expectedCompuX = 0;
            board.expectedCompuY = 0;
            return endCheck = false;
        }
    }
}

function myIndexOf(arr, o) {    
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].i == o.i && arr[i].j == o.j) {
            return i;
        }
    }
    return -1;
}