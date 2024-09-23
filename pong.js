//board properties
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//variable for players
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1Score = 0;
let player2Score = 0;

let player1 = { /* Player 1's position */
    x: 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
};

let player2 = { /* Player 1's position */
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY
};

//ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardWidth/2,
    y: boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 1,
    velocityY: 2
};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used to draw on the screen

    //draw initial player 1
    context.fillStyle = "cyan";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    context.fillStyle = "cyan";
   // player1.y += player1.velocityY;
   let nextPlayer1Y =  player1.y + player1.velocityY;

    if( !outOfBounds(nextPlayer1Y)){
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

  //  player2.y += player2.velocityY;
    let nextPlayer2Y =  player2.y + player2.velocityY;
    if( !outOfBounds(nextPlayer2Y)){
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // to draw the ball
    context.fillStyle = "ivory";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    if(ball.y <=0 || (ball.y + ball.height) >= boardHeight) {
        ball.velocityY *= -1; // reverse direction
    }

    //bounce the ball back from paddle
    if(detectCollision(ball, player1)){
        if(ball.x <= (player1.x + player1.width)){
            //left side of ball touches right side of player1
            ball.velocityX *= -1;
        }
    }
    else if(detectCollision(ball, player2)){
        if(ball.x + ballWidth >= player2.x ){
            //right side of ball touches left side of player2
            ball.velocityX *= -1;
        }
    }

    //game over for each round
    if(ball.x < 0 ){
        player2Score++;
        resetGame(1);
    }
    else if(ball.x + ballWidth > boardWidth){
        player1Score++;
        resetGame(-1);
    }

    //draw the score
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 -45, 45);

    //draw dotted line in the middle of board
    for(let indx = 10; indx < board.height; indx += 25){
        //indx=starting y position, draw a square every 25 pixels down
        context.fillRect(board.width/2 - 10, indx, 5, 5);
    }
}

function outOfBounds(yPosition) {
    return ((yPosition < 0 ) || (yPosition + playerHeight > boardHeight));
}

function movePlayer(event) {
    if(event.code === "KeyW"){
        player1.velocityY = -3;
    }
    else if(event.code === "KeyS"){
        player1.velocityY = 3;
    }

    if(event.code === "ArrowUp"){
        player2.velocityY = -3;
    }
    else if(event.code === "ArrowDown"){
        player2.velocityY = 3;
    }
}

function detectCollision(a, b) {
    return( a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner  
            a.x + a.width > b.x && //a's top right corner passes b's top left corner
            a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner 
            a.y + a.height > b.y); // a's bottom left corner doesn't reach b's top left corner 
}

function resetGame(direction){
    ball = {
        x: boardWidth/2,
        y: boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX: direction,
        velocityY: 2
    };
}