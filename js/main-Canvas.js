// Get coordinates of a mouse click on the canvas
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

// Record the last step and each step
function recordCoord(coords, color) {
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
}

// Set a circle of a mouse click on the canvas
function setChessCanvas(coords, color) {
    var canvasX = coords.j*30+15;
    var canvasY = coords.i*30+15;

    ctx.fillStyle = color; 
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 12, 0, 2*Math.PI);
    ctx.closePath(); 
    ctx.fill();
}

// Get the closest coordinate to the coordinate player clicked
function getClosestCoord(canvasX, canvasY) {
    var path = [];
    coordinates.forEach(function(coord) {
        var a = canvasX - coord.x;
        var b = canvasY - coord.y;
        var c = Math.sqrt(a*a + b*b);
        
        path.push({coord: coord, theShortestPath: c});
    });
  
    var coordsCanvas = path.getMin('theShortestPath').coord;
    var coords = {};

    //coords.i //1 //coordsCanvas.y //60 //45 -15=30
    //coords.j //2 //coordsCanvas.x //90 //75 -15=50
    coords.i = (coordsCanvas.y+15)/30-1;
    coords.j = (coordsCanvas.x+15)/30-1;

    if(myIndexOf(board.logRecord, coords) === -1){
        recordCoord(coords, '#fff');
        setChessCanvas(coords, '#fff');

        // Check if win or not
        checkFourDirectForWin(board.playerLastRecord, board.playerWinMatrix, 1);
        if(board.isMyTurn && board.isWin){
            document.getElementById('whoWins').innerHTML = '<h3 class="text-danger">Congrats! You won!</h3>';
            board.gameOver = true;
        }else{
            setTimeout(execCanvasCompuPlay(), 500);
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

Array.prototype.getMin = function(attrib) {
    return this.reduce(function(prev, curr){ 
        return prev[attrib] < curr[attrib] ? prev : curr; 
    });
}

// Coordinates of the board
var coordinates = [
    {x:15,y:15},{x:45,y:15},{x:75,y:15},{x:105,y:15},{x:135,y:15},{x:165,y:15},{x:195,y:15},{x:225,y:15},{x:255,y:15},{x:285,y:15},{x:315,y:15},{x:345,y:15},{x:375,y:15},{x:405,y:15},{x:15,y:45},{x:45,y:45},{x:75,y:45},{x:105,y:45},{x:135,y:45},{x:165,y:45},{x:195,y:45},{x:225,y:45},{x:255,y:45},{x:285,y:45},{x:315,y:45},{x:345,y:45},{x:375,y:45},{x:405,y:45},{x:15,y:75},{x:45,y:75},{x:75,y:75},{x:105,y:75},{x:135,y:75},{x:165,y:75},{x:195,y:75},{x:225,y:75},{x:255,y:75},{x:285,y:75},{x:315,y:75},{x:345,y:75},{x:375,y:75},{x:405,y:75},{x:15,y:105},{x:45,y:105},{x:75,y:105},{x:105,y:105},{x:135,y:105},{x:165,y:105},{x:195,y:105},{x:225,y:105},{x:255,y:105},{x:285,y:105},{x:315,y:105},{x:345,y:105},{x:375,y:105},{x:405,y:105},{x:15,y:135},{x:45,y:135},{x:75,y:135},{x:105,y:135},{x:135,y:135},{x:165,y:135},{x:195,y:135},{x:225,y:135},{x:255,y:135},{x:285,y:135},{x:315,y:135},{x:345,y:135},{x:375,y:135},{x:405,y:135},{x:15,y:165},{x:45,y:165},{x:75,y:165},{x:105,y:165},{x:135,y:165},{x:165,y:165},{x:195,y:165},{x:225,y:165},{x:255,y:165},{x:285,y:165},{x:315,y:165},{x:345,y:165},{x:375,y:165},{x:405,y:165},{x:15,y:195},{x:45,y:195},{x:75,y:195},{x:105,y:195},{x:135,y:195},{x:165,y:195},{x:195,y:195},{x:225,y:195},{x:255,y:195},{x:285,y:195},{x:315,y:195},{x:345,y:195},{x:375,y:195},{x:405,y:195},{x:15,y:225},{x:45,y:225},{x:75,y:225},{x:105,y:225},{x:135,y:225},{x:165,y:225},{x:195,y:225},{x:225,y:225},{x:255,y:225},{x:285,y:225},{x:315,y:225},{x:345,y:225},{x:375,y:225},{x:405,y:225},{x:15,y:255},{x:45,y:255},{x:75,y:255},{x:105,y:255},{x:135,y:255},{x:165,y:255},{x:195,y:255},{x:225,y:255},{x:255,y:255},{x:285,y:255},{x:315,y:255},{x:345,y:255},{x:375,y:255},{x:405,y:255},{x:15,y:285},{x:45,y:285},{x:75,y:285},{x:105,y:285},{x:135,y:285},{x:165,y:285},{x:195,y:285},{x:225,y:285},{x:255,y:285},{x:285,y:285},{x:315,y:285},{x:345,y:285},{x:375,y:285},{x:405,y:285},{x:15,y:315},{x:45,y:315},{x:75,y:315},{x:105,y:315},{x:135,y:315},{x:165,y:315},{x:195,y:315},{x:225,y:315},{x:255,y:315},{x:285,y:315},{x:315,y:315},{x:345,y:315},{x:375,y:315},{x:405,y:315},{x:15,y:345},{x:45,y:345},{x:75,y:345},{x:105,y:345},{x:135,y:345},{x:165,y:345},{x:195,y:345},{x:225,y:345},{x:255,y:345},{x:285,y:345},{x:315,y:345},{x:345,y:345},{x:375,y:345},{x:405,y:345},{x:15,y:375},{x:45,y:375},{x:75,y:375},{x:105,y:375},{x:135,y:375},{x:165,y:375},{x:195,y:375},{x:225,y:375},{x:255,y:375},{x:285,y:375},{x:315,y:375},{x:345,y:375},{x:375,y:375},{x:405,y:375},{x:15,y:405},{x:45,y:405},{x:75,y:405},{x:105,y:405},{x:135,y:405},{x:165,y:405},{x:195,y:405},{x:225,y:405},{x:255,y:405},{x:285,y:405},{x:315,y:405},{x:345,y:405},{x:375,y:405},{x:405,y:405}
]

// Computer's turn
function execCanvasCompuPlay() {
    board.isMyTurn = false;
    checkCanvasChessAround();
    board.isMyTurn = true;
}

function checkCanvasChessAround() {
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
        recordCoord(compuCoords, '#000');
        setChessCanvas(compuCoords, '#000');

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