//Globals because i cannot code well
var bombWeight = 0;
var pGridx = 10;
var pGridy = 10;
var playGrid = [];
var numSel = 1;
var table = document.getElementById('main');

/*
* 7/14 - Be able to input full array -> try to solve
* 7/25 - Feature idea-> Step by step guess recommendation (in waves), give percentage chance of the safety of a guess

7/26 - do the 1-1-1 pattern thing that takes effort
*/



//Backend
//class for squares
class Land {

  //constructor
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbours = [];
    this.number = -1; 
    //Number Clarification
    /*
      -1 -> unguessed
      -2 -> Flag
      -8 -> Bomb
    */
    this.bomb = generateBomb(bombWeight);
    this.safetyPercent //Chance of a safe guess
    this.flagged = false;
    this.guessable = false;
    this.visible = false;
  }

  //Methods!

  
  //visible + finds number
  setVisible() {
    this.visible = true;
  }

  //updates Neighbours
  update() {
    this.neighbours = getNeighbours(this);
  }


  //Gets array of adjacent lands w/ specific property
  getAdjProperty(prop) {


    let array = [];

    for (i = 0; i < this.neighbours.length; i++) {

      switch(prop){
        case 'visible':
        case 'v':
        if (this.neighbours[i].visible === true) {
          array.push(this.neighbours[i]);
        }
        break;

        case 'empty':
        case -1:
        case 'e':
        if (this.neighbours[i].visible === false) {
          array.push(this.neighbours[i]);
        }
        break;

        case 'bomb':
        case 'b':
        if (this.neighbours[i].bomb === true) {
          array.push(this.neighbours[i]);
        }
        break;


        case 'flagged':
        case 'flag':
        case 'f':
        if (this.neighbours[i].flagged === true) {
          array.push(this.neighbours[i]);
        }
        break;


      }

    }

    return array;

  }


  //guesses
  guess() {

    this.guessable = true;
    this.visible = true;
    /* Flood Solve for 0
    for (let i = 0; i < this.neighbours.length; i++) {

      this.neighbours[i].update();

      if (this.number == 0) {

        if (this.neighbours[i].visible == false) {

          this.neighbours[i].guess();

        }

      }
      
    }
    */
  }


//flags
  flag() {

    if (this.visible == false) { }
    this.visible = true;
    this.flagged = true;
    this.number = -2;

  }

//reveal
  reveal(){
    if (this.bomb == true){
      this.number = -8;
    }
  }
  
}


//functions

//fills and returns a grid w/ 2d array of land
function setGrid(xn, yn) {

  tGrid = [];


  for (j = 0; yn > j; j++) {

    yGrid = [];

    for (i = 0; xn > i; i++) {

      yGrid.push(new Land(i, j));

    }

    tGrid.push(yGrid);

  }

  return tGrid;
}

//do this later sometime idk
function importGrid(xn, yn, array){
  
}

//Returns array of neighbouring lands
function getNeighbours(land) {

  let tGrid = [];
  let tX;
  let tY;

  for (i = -1; i <= 1; i++) { 

    tX = land.x + i;

    for (j = -1; j <= 1; j++) {

      tY = land.y + j;

      //console.log(tX + " = tX | " + tY + " = tY");

      if ((tX == land.x) && (tY == land.y)) {

        //console.log("Center");

      } else if (((tX >= 0) && (tY >= 0)) && ((tX < pGridx) && (tY < pGridy))) {

        tGrid.push(playGrid[tY][tX]);
        //console.log("works" + tX + " " + tY);

      } else if ((tX < 0) || (tY < 0)) {
        // console.log("Empty");

      } else {

        //console.log('wtf');

      }
      // console.log();
    }

  }

  //console.log(tGrid);
  return tGrid;
}

//generates bomb chance
function generateBomb() {

  if (Math.random() < bombWeight) {
    return true;
  }

  return false;

}

//updates all
function updateAll(grid) {

  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      grid[j][i].update();

    }
  }

}

//sets up board so first guess opens
function firstGuessSetup(x, y) {

  do {
    playGrid = setGrid(pGridx, pGridy);
    updateAll(playGrid);
    playGrid[x][y].getNumber();


  } while (playGrid[x][y].number !== 0)

  playGrid[x][y].guess();

}


//Base function, fills grid with -1's
function populateTable(x, y){

    
  for (let j = 0; y > j; j++) { //javascript scope sucks make sure these are 'let'
  
    let tr = document.createElement('tr');
   
      for (let i = 0; x > i; i++) {

        
        bButton = document.createElement('input'); //button is made
        //bButton.disabled = true;
        bButton.contentEditable = true;
        bButton.id = i + "," + j;
        bButton.className = "grid";

        bButton.style.background = "rgb(24, 25, 28)";
        bButton.addEventListener("click", () => {
          document.getElementById(i+","+j).focus();
          document.getElementById(i+","+j).select();
          //console.log("focus works");
        });
        //bButton.addEventListener("mouseover", function(){});
        //bButton.addEventListener("mouseout", function(){});
        bButton.textColor = 'white';
        //bButton.value = "-1"
        bButton.textContent = "";
        tr.appendChild(bButton);
    
            
      }
    
    table.appendChild(tr); //row to table 
   
  }
  
}

function selectText(i, j) {
  let input = document.getElementById(i + "," + j);
  input.focus();
  input.select();
}





//solvers


//beeg solve
function solve(grid) {

  scrape(grid);

}

//finds if program needs harder solve [UNUSED]
function isDeadlock(grid) {
  if (scrape(grid) == false){
    if (shoopSolve == false){
      
    } else {
      return "s";
    }
  }


  //if (){}
}



//soft solve
/*
almost the bread and butter of the solving algorithm
scrape will essentially fill in any 1-land solutions. If there is a land that says 2, and has 2 empty neighbours, it will flag both neighbours.
*/
function scrape(grid) {
  let set = getOpenSet(grid); //gets 'active' squares (empty and neighbours a number)
  let i = 0;
  let scraped = false;



  while(i < set.length) { //loops through every 'active' square
    let wSqr = set[i]; 

    //print test value
    //console.log("Test: x-" + wSqr.x + " y-" + wSqr.y);
    //console.log("value - " +  wSqr.number + " adj empty - " + wSqr.getAdjProperty('e').length + " adj flagged - " + wSqr.getAdjProperty('f').length );


    //flags if empty + flag
    if (wSqr.number == (wSqr.getAdjProperty('e').length +   wSqr.getAdjProperty('f').length)){
     
      for (let l of wSqr.getAdjProperty('e')){
        l.flag();
        scraped = true;
      
      //  console.log("flagged: x-" + l.x + " y-" + l.y);
      }

  //guess if
   } else if ((wSqr.number - wSqr.getAdjProperty('f').length) == 0){

     for (let l of wSqr.getAdjProperty('e')){
       l.guess();
       scraped = true;

        //console.log("guessed: x-" + l.x + " y-" + l.y);
     }   
   }

    //format + iterate
    // console.log();
    i++;
    set = getOpenSet(grid);
    superPosSearch(set);
  }

  if (scraped){
    scrape(grid);
  } else {
    return false;
  }

}


//Gets open lands (hidden lands adjacent to visible lands )
function getOpenSet(grid) {

  let openSet = [];
  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      if ((grid[j][i].visible == true)&&(grid[j][i].flagged == false)&&(grid[j][i].guessable == false)) {

        for (let k = 0; k < grid[j][i].neighbours.length; k++) {

          grid[j][i].neighbours[k].update();

          if (grid[j][i].neighbours[k].visible == false) {
            openSet.push(grid[j][i]);
            break;
          }

        }
      }
    }
  }
  
  return openSet;
  
}



//superpositions smaller set into bigger set as a number and tries to solve (need to recomment this is so messy)
function superPos(bLand, sLand){
  let wArr = [];

  
  if(bLand.getAdjProperty('e').length < sLand.getAdjProperty('e').length){
    
   superPos(sLand, bLand);
   
  } else if (sLand.getAdjProperty('e').every(n => bLand.getAdjProperty('e').includes(n))){  //if small neighbours all in big neighbours
    //console.log("small in big");
    //set work array to be big neighbours minus small neighbours
    
    wArr = bLand.getAdjProperty('e').filter(l => !sLand.getAdjProperty('e').includes(l));
    //console.log("filter s in b empties");
  
    if (wArr.length == (bLand.number - bLand.getAdjProperty('f').length) - (sLand.number - sLand.getAdjProperty('f').length)){ //flag if the effective big number - effective small number is the same as remaining open squares 
      wArr.forEach(x => {x.flag(); console.log("flagged " + x.x + "," + x.y)});
    } 
    else if ((bLand.number  - bLand.getAdjProperty('f').length) - (sLand.number - sLand.getAdjProperty('f').length) == 0){
      wArr.forEach(x => {x.guess(); console.log("guessed " + x.x + "," + x.y)} );//guess if effective big number - effective small number is smaller than remaining squares
    }
    //check test if big and small are swapped
  } 
  
  
  //test case for vertical 1 - 1 - 1, or 1 - 2 - 1
  //superPos(playGrid[1][0],playGrid[0][0]); scrape(playGrid); webViewUpdate();
}


function superPosSearch(set){
  let i = 0;
  
  while(i < set.length){

    if(set[i].number > 0){
      set[i].getAdjProperty('v').filter(n => n.number > 0).forEach(n => {superPos(set[i], n); console.log("SUPERPOS " + set[i].x + "," + set[i].y + " | "+ n.x + ',' + n.y)});
    }
    
    i++;      
    }


}

//checks if solved
function solved(grid){


  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      if (grid[i][j].bomb == true){
        if(grid[i][j].flagged == false){
          return false;
        }
      }

    }
  }

    return true;

}

function fillZeros(){

  let zeroed = false;

  playGrid = pullGrid(pGridx, pGridy);
  updateAll(playGrid);
  
  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      if ((playGrid[j][i].number == 0)&&(playGrid[j][i].getAdjProperty('e').length > 0)){

          playGrid[j][i].getAdjProperty('e').forEach(n => {n.number = 0; document.getElementById(n.x + ","+ n.y).value = 0;});
          zeroed = true;
      }
    }
  }

  if (zeroed == true){
    fillZeros();    
  }


  
}

//input own playGrid

function getWorkingGrid(l, w, array) {

  let arr = array;
  let tGrid = setGrid(l, w);

  //resets all squares
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < w; j++) {

      tGrid[i][j].bomb = false;
      tGrid[i][j].visible = false;

    }
  }


  for (let i = 0; i < arr.length; i++) {
   
   let wLand = tGrid[arr[i][0]][arr[i][1]];

   if ((typeof arr[i][2]) == 'number'){
     wLand.number = arr[i][2];
   } else if (arr[i][2] == 'b'){
     wLand.bomb = true;
   } else if (arr[i][2] == 'f'){
     wLand.flag = true;
   } else {
     console.log("fuck - working grid wLand error");
   }

  if (arr[i][3] == 'v'){
    wLand.setVisible = true;
  }



  }

  updateAll(tGrid);
  return tGrid;
}

function waveSolve(){
  playGrid = pullGrid(pGridx, pGridy);
  updateAll(playGrid);
  scrape(playGrid);
  scrape(playGrid);
  webViewUpdate();
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//Web Visualizer Setup
function webViewSetup(){
  
  //switch after
  pGridy = document.getElementById("hin").value;
  pGridx = document.getElementById("win").value;
  document.getElementById('main').innerHTML = '';
  populateTable(pGridx, pGridy);

}


function randomSetup(x, y){
  
  let tGrid = setGrid(x,y);
  
  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      //grid[i][j]

    }
  }

}





function pullGrid(xn, yn){

  console.log("Grid")
  tGrid = [];

  for (j = 0; yn > j; j++) {

    yGrid = [];

    for (i = 0; xn > i; i++) {

      let pLand = new Land(i, j); //create temporary land to be imported
      pLand.number = parseInt(document.getElementById(i +"," +j).value);

      if(pLand.number >= 0){
        pLand.value = pLand.number;
        pLand.visible = true;
      } 

      if(pLand.number == -2){
        pLand.flag();
      }
      
      console.log(pLand);
      yGrid.push(pLand);

    }
    
    tGrid.push(yGrid);

  }
  
  return tGrid; 

}



function webViewUpdate(){
  
  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {
      
      if (playGrid[j][i].flagged == true){
        
        document.getElementById(i+","+j).style.backgroundColor = "red";
        
      } else if (playGrid[j][i].guessable == true){
        
        document.getElementById(i+","+j).style.backgroundColor = "green";
        
      } else {
        
        document.getElementById(i+","+j).style.backgroundColor = "#18191C";
      }
      
      
    }
  }
}

//main

webViewSetup();

