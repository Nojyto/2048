const boxSize = 4;
let score     = document.getElementById("score");
    bestScore = document.getElementById("best");
    items = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

const colorVal = new Map([
    [0,    "#cdc0b4"],
    [2,    "#eee4da"],
    [4,    "#ede0c8"],
    [8,    "#f2b179"],
    [16,   "#f59563"],
    [32,   "#f67c5f"],
    [64,   "#f65e3b"],
    [128,  "#edcf72"],
    [256,  "#edcc61"],
    [512,  "#edc850"],
    [1024, "#edc53f"],
    [2048, "#edc22e"],
    [4096, "#3c3a32"],
    [8192, "#3c3a32"],
   ]);

items[Math.floor(Math.random() * boxSize)][Math.floor(Math.random() * boxSize)] = 2;
if(localStorage.getItem("PB") !== null)
    bestScore.innerHTML = localStorage.getItem("PB");

addItem();
updateScreen();

function addItem(){
    let y, x;
    do {
        y = Math.floor(Math.random() * boxSize);
        x = Math.floor(Math.random() * boxSize);
    }while(items[y][x] != 0)
    items[y][x] = Math.floor(Math.random() * 2) ? 4 : 2;
}

function updateScreen(){
    for(i in items){
       for(j in items){
            let tile = document.getElementById(String(i) + String(j))
            tile.innerHTML = items[i][j] == 0 ? "": tile.innerHTML = items[i][j];
            tile.style.backgroundColor = colorVal.get(items[i][j]);
        }
    }
    
    bestScore.innerHTML = Math.max(parseInt(bestScore.innerHTML), parseInt(score.innerHTML));
    localStorage.setItem("PB", bestScore.innerHTML);
}

function isGame(){
    for(i in items)
       for(j in items)
            if(items[i][j] == 0)
                return true;
    return false;
}

function rotMatrix(dir){
    let tmp = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
       ];
    
    for(i in items)
       for(j in items)
           tmp[i][j] = items[i][j];
           
    //let tmp = items; neveikia kazkodel
    for(i in items)
       for(j in items)
            items[i][j] = dir ? tmp[j][boxSize - 1 - i] : tmp[boxSize - 1 - j][i];
}

function stackIt(){
    let didMove = false;
    for(let y = 0; y < boxSize; y++)
        for(let x = boxSize - 2; x >= 0; x--)
            if(items[y][x] != 0)
                for(let i = boxSize - 1; i > x; i--){
                    if(items[y][i] == 0){
                        items[y][i] = items[y][x];
                        items[y][x] = 0;
                        didMove = true;
                    }else if(items[y][i] == items[y][x]){
                        items[y][i] *= 2;
                        items[y][x] = 0;
                        score.innerHTML = parseInt(score.innerHTML) + items[y][i];
                        didMove = true;
                    }
                }
    return didMove;
}

/*Handles arrow-key movement*/
document.addEventListener("keydown", function(evt) {
    evt.preventDefault();
    switch (evt.key) {
        case 'ArrowLeft':
            rotMatrix(true);
            rotMatrix(true);
            if(stackIt()) addItem();
            rotMatrix(false);
            rotMatrix(false);
            break;
        case 'ArrowUp':
            rotMatrix(false);
            if(stackIt()) addItem();
            rotMatrix(true);
            break;
        case 'ArrowRight':
            if(stackIt()) addItem();
            break;
        case 'ArrowDown':
            rotMatrix(true);
            if(stackIt()) addItem();
            rotMatrix(false);
            break;
        default:
            return;
    }
    updateScreen();
    if(!isGame()){
        items = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
           ];
    }
});

/*Handles swipes*/
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if(!xDown || !yDown) return;
    
    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if(Math.abs(xDiff) > Math.abs(yDiff)){
        if(xDiff > 0) {
            /* left swipe */
            rotMatrix(true);
            rotMatrix(true);
            if(stackIt()) addItem();
            rotMatrix(false);
            rotMatrix(false);
        }else{
            /* right swipe */
            if(stackIt()) addItem();
        }                       
    }else{
        if(yDiff > 0){
            /* up swipe */
            rotMatrix(false);
            if(stackIt()) addItem();
            rotMatrix(true);
        }else{ 
            /* down swipe */
            rotMatrix(true);
            if(stackIt()) addItem();
            rotMatrix(false);
        }                                                                 
    }
    xDown = null;
    yDown = null;
    
    updateScreen();
    if(!isGame()){
        items = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
           ];
    }
};