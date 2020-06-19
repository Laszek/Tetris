//setting up canvas
const cvs = document.getElementById('tetris');
    //setting up drawing on canvas
const ctx = cvs.getContext('2d');

const SQ = 60;

//Funkcja rysująca kwadrat
function drawSquare(canv,x,y,color){
    canv.fillStyle = color;
    canv.fillRect(x*SQ,y*SQ,SQ,SQ);
}

const ROW = 12; //ilość wierszy
const COL = 8; //ilość kolumn
const VACANT = "#4361ee";
let score = 0;
const scoreEl = document.getElementById('score');

let board = [];
for(r=0;r<ROW;r++){
    board[r] = [];
    for(c=0;c<COL;c++){
        board[r][c] = VACANT;
    }
}

//Funkcja rysująca planszę
function drawBoard(rows, cols, canvas, section){
    for(r=0;r<rows;r++){
        for(c=0;c<cols;c++){
            drawSquare(canvas,c,r,section[r][c]);
        }
    }
}

//rysowanie tetronimo
/*
let piece = T[0];
const pieceColor='orange';
for(r=0;r<piece.length;r++){
    for(c=0;c<piece.length;c++){
        if(piece[r][c]){
            drawSquare(c,r,pieceColor);
        }
    }
}
*/

const PIECES = [[Z,"orange"],[S,"purple"],[J,"blue"],[L,"green"],[T,"red"],[I,"white"],[O,"yellow"]];

//LOSOWANIE elementu

function randPiece(){
    let randomN = Math.floor(Math.random()*PIECES.length);
    return new Piece(PIECES[randomN][0],PIECES[randomN][1])
}

//tworzenie elementów

function Piece(tetro,color){
    this.tetromino = tetro; //wczytanie danego tetromino
    this.tetrominoN = 0; //początkowy indeks tetromino
    this.activeTetromino = this.tetromino[this.tetrominoN]; //aktywny tetromino
    this.color = color;
    this.x=3; //x startowy
    this.y=-3; //y startowy
    //rysowanie elementu
    this.draw = ()=>{
        for(r=0;r<this.activeTetromino.length;r++){
            for(c=0;c<this.activeTetromino.length;c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(ctx, c+this.x,r+this.y,this.color);
    }}}};
    this.drawPreview = ()=>{
        for(r=0;r<this.activeTetromino.length;r++){
            for(c=0;c<this.activeTetromino.length;c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(ctx2, c,r,this.color);
    }}}};
    this.clear = ()=>{
        for(r=0;r<this.activeTetromino.length;r++){
            for(c=0;c<this.activeTetromino.length;c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(ctx,c+this.x,r+this.y,VACANT);
    }}}};
    this.clearPreview = ()=>{
        for(r=0;r<this.activeTetromino.length;r++){
            for(c=0;c<this.activeTetromino.length;c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(ctx2,c,r,VACANT);
    }}}};
    
    //Poruszanie się
    this.moveDown = ()=>{
        if(!this.collision(0,1,this.activeTetromino)){
            this.clear();
            this.y++;
            this.draw();
            next.drawPreview();
        }else{
            this.lock();
            piece = next;
            piece.x=3;
            piece.y=-3;
            next.clearPreview();
            next = randPiece();
        }
    };
    this.moveLeft = ()=>{
        if(!this.collision(-1,0,this.activeTetromino)){
            this.clear();
            this.x--;
            this.draw();
        }
    };
    this.moveRight = ()=>{
        if(!this.collision(1,0,this.activeTetromino)){
            this.clear();
            this.x++;
            this.draw();
        }
    };
    //obrót
    this.rotate = ()=>{
        let nextPattern = this.tetromino[(this.tetrominoN+1)%this.tetromino.length];
        let kick;
        if(this.collision(0,0,nextPattern)){
            if(this.collision(0,0,nextPattern)!="occupied"){

                this.clear();
                if(this.x<COL/2){
                    this.x += this.activeTetromino.length>3 ? 2 : 1;
                }
                if(this.x>COL/2){
                    this.x-= this.activeTetromino.length>3 ? 2 : 1;
                }
            }
        }
        if(!this.collision(0,0,nextPattern)){
            this.clear();
            this.tetrominoN = (this.tetrominoN+1)%this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
        
        
    }
    //DETEKCJA KOLIZJI
    this.collision = (x,y,piece)=>{
        for(r=0;r<piece.length;r++){
            for(c=0;c<piece.length;c++){
                if(!piece[r][c])
                    continue;
                let newX = this.x+c+x;
                let newY = this.y+r+y;
                
                //warunki
                if(newX<0 || newX>=COL || newY>=ROW)
                    return true;
                //pomiń newY < 0; board[-1] zcrushuje gre
                if(newY<0)
                    continue;
                // sprawdź, czy jest zablokowany element w tym miejscu
                if(board[newY][newX] != VACANT)
                    return "occupied";
            }
        }
    return false;
    };
    
    //Blokowanie elementu
    this.lock = ()=>{
        for(r=0;r<this.activeTetromino.length;r++){
            for(c=0;c<this.activeTetromino.length;c++){
                //omijamy puste pola
                if(!this.activeTetromino[r][c]){
                    continue;
                }
                //elementy, które zablokują się na górze
                if(this.y+r<0){
                    gameOver = true;
                    endGame();
                    break;
                }
                
                board[this.y+r][this.x+c]= this.color;
        }}
        //USUWANIE PEŁNYCH WIERSZY
        for(r=0; r<ROW;r++){
            let isRowFull = true;
            for(c=0;c<COL;c++){
                isRowFull = isRowFull && (board[r][c] != VACANT);
            }
            if(isRowFull){
                for(y=r; y>=1;y--){
                    for(c=0;c<COL;c++){
                        board[y][c] = board[y-1][c];
                    }
                }
                for(c=0;c<COL;c++){
                    board[0][c] = VACANT;
                }

                score+=10;
        }
        scoreEl.innerHTML = score;
    }
    drawBoard(ROW,COL,ctx,board);
    
    };
    this.changeTetro = ()=>{
        next.clearPreview();
        piece.clear();
        console.log("HELLO");
        let tmpTetro = piece;
        piece = next;
        next = tmpTetro;
        piece.x = 3;
        piece.y = -2;
        next.x = 0;
        next.y=0;
        piece.draw();
        next.drawPreview();
    };
        
}

let piece;

//KONTROLOWANIE
document.addEventListener("keydown", CONTROL);

function CONTROL(event){
    if(event.keyCode==37){
        piece.moveLeft();
        dropStart = Date.now();
    }
        
    else if(event.keyCode==38){
        piece.rotate();
        dropStart = Date.now();
    }
    else if(event.keyCode==39){
        piece.moveRight();
        dropStart = Date.now();
    }
    else if(event.keyCode==40){
        piece.moveDown();
    }
    else if(event.keyCode==16){
        piece.changeTetro();
        dropStart = Date.now();
    }
}

let right = document.getElementById('move-right');
let left = document.getElementById('move-left');
let down = document.getElementById('move-down');
let rotate = document.getElementById('rotate');
let change = document.getElementById('change');

function ANALOGCONTROLS(event){
    if(event.target.id == 'move-left'){
        piece.moveLeft();
        dropStart = Date.now();
    }
        
    else if(event.target.id == 'rotate'){
        piece.rotate();
        dropStart = Date.now();
    }
    else if(event.target.id == 'move-right'){
        piece.moveRight();
        dropStart = Date.now();
    }
    else if(event.target.id == 'move-down'){
        piece.moveDown();
    }
    else if(event.target.id == 'change'){
        piece.changeTetro();
    }
}
right.addEventListener("click", ANALOGCONTROLS);
    left.addEventListener("click", ANALOGCONTROLS);
    down.addEventListener("click", ANALOGCONTROLS);
    rotate.addEventListener("click", ANALOGCONTROLS);
    change.addEventListener("click", ANALOGCONTROLS);

//OPADANIE klocka
let dropStart = Date.now();
let speed;
function drop(){
    let gameOver = false;
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > speed){
        piece.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}





//ustawianie podglądu następnej figury
let next = randPiece();
const lookup = document.getElementById('next-tetronimo');

const ctx2 = lookup.getContext('2d');
let preview = [];
for(r=0;r<4;r++){
    preview[r] = [];
    for(c=0;c<4;c++){
        preview[r][c] = VACANT;
    }
}


function endGame() {
    piece = '';
    next ='';
    for(r=0;r<ROW;r++){
        for(c=0;c<COL;c++){
            board[r][c] = VACANT;
        }
    }
    for(r=0;r<4;r++){
        for(c=0;c<4;c++){
            preview[r][c] = VACANT;
        }
    }
    
    score = 0;
    drawBoard(ROW,COL,ctx,board);
    drawBoard(4,4,ctx2,preview);
    menuDiv.style.display = 'flex';
}

function startGame(event){
    
    if(event.target.value== 'easy'){
        speed = 1000;
    } else if(event.target.value=='normal'){
        speed = 500;
    } else if(event.target.value=='hard'){
        speed = 200;
    }
    
    console.log("HELLO "+speed);
    menuDiv.style.display = 'none';
    
    drawBoard(ROW,COL,ctx,board);
    drawBoard(4,4,ctx2,preview);
    next = randPiece();
    piece = next;
    next = randPiece();
    drop();
}

const menuDiv = document.getElementById('menu');
const start = document.getElementById('start-game');

start.addEventListener("click", ()=>{
    let easy = document.createElement("button");
    easy.classList += "menu--btn";
    easy.innerText="Easy";
    easy.value = "easy";
    easy.addEventListener("click", startGame);
    let normal = document.createElement("button");
    normal.classList += "menu--btn";
    normal.innerText="Normal";
    normal.value = "normal";
    normal.addEventListener("click", startGame);
    let hard = document.createElement("button");
    hard.classList += "menu--btn";
    hard.innerText="Hard";
    hard.value = "hard";
    hard.addEventListener("click", startGame);
    
    menuDiv.innerHTML = "<h2>Wybierz poziom trudności:</h2>";
    
    menuDiv.appendChild(easy);
    menuDiv.appendChild(normal);
    menuDiv.appendChild(hard);
});

