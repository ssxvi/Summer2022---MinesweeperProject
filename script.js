var bombWeight = 0.20;
var pGridx = 10;
var pGridy = 10;
var playGrid = [];

//class for squares
class Land {

  //constructor
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbours = [];
    this.number = -1;
    this.bomb = generateBomb(bombWeight);
    this.flagged = false;
    this.visible = false;
  }

  //Methods!


  //visible + finds number
  setVisible() {
    this.visible = true;
    this.getNumber();
  }

  //updates Neighbours
  update() {
    this.neighbours = getNeighbours(this);
    this.getNumber();
  }

  //gets number based on neighbour array
  getNumber() {
    
    if (this.flagged == true) {
      this.number = -2;
    } else if (this.bomb == true) {
      this.number = -8;

    } else {

      let counter = 0;

      for (i = 0; i < this.neighbours.length; i++) {
        if (this.neighbours[i].bomb === true) {
          counter++;
        }
      }

      this.number = counter;
    }

  }


  //Gets adj property in neighbours
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

    this.setVisible();

    if (this.bomb == true) {
      //lose();
      console.log('Lose');
    }

    for (let i = 0; i < this.neighbours.length; i++) {

      this.neighbours[i].update();

      if (this.number == 0) {

        if (this.neighbours[i].visible == false) {

          this.neighbours[i].guess();

        }

      }
    }
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

//fills grid w/ 2d array of land
function setGrid(xn, yn) {

  tGrid = [];


  for (i = 0; xn > i; i++) {

    yGrid = [];

    for (j = 0; yn > j; j++) {

      yGrid.push(new Land(i, j));

    }

    tGrid.push(yGrid);

  }

  return tGrid;
}


function importGrid(xn, yn, ){

}



//Returns array 
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

        tGrid.push(playGrid[tX][tY]);
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

      grid[i][j].update();

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





//visualizers

//true visualizer in console.log
function budgetTrueVisualizer(grid) {
  console.log("Budget True Visualizer");
  console.log();

  updateAll(playGrid);
  for (let i = 0; i < (pGridx); i++) {

    let line = "";

    for (let j = 0; j < (pGridy); j++) {

      grid[i][j].getNumber();
      grid[i][j].reveal();

      switch (grid[i][j].number) {
        case -1:
          line = line + '  -';
          break;
        case -2:
          line = line + '  🚩';
          break;
        case -8:
          line = line + '  💣';
          break;
        default:
          line = line + '  ' + grid[i][j].number;
          break;
      }

    }

    console.log(line);

  }

  console.log();

}

//visualizer is console.log()
function budgetVisualizer(grid) {

  console.log("Budget Visualizer");
  console.log();
  updateAll(playGrid);

  for (let i = 0; i < (pGridx); i++) {

    let line = "";

    for (let j = 0; j < (pGridy); j++) {

      if (grid[i][j].visible === true) {

        switch (grid[i][j].number) {
          case -1:
            line = line + '  -';
            break;
          case -2:
            line = line + '  🚩';
            break;
          case -8:
            line = line + '  💣';
            break;
          default:
            line = line + '  ' + grid[i][j].number;
        }

      } else {

        line = line + '  -';

      }
    }

    console.log(line);

  }

  console.log();

}


//solvers


//beeg solve
function solve(grid) {

  scrape(grid);


}

//finds if program needs harder solve
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
function scrape(grid) {
  let set = getOpenSet(grid);
  let i = 0;
  let scraped = false;


  while(i < set.length) {
    let wSqr = set[i];

    //print test value
    //console.log("Test: x-" + wSqr.y + " y-" + wSqr.x);
    //console.log("value - " +  wSqr.number + " adj empty - " + //wSqr.getAdjProperty('e').length + " adj flagged - " + wSqr.getAdjProperty('f').length );



    //flag if
    if (wSqr.number == (wSqr.getAdjProperty('e').length + wSqr.getAdjProperty('f').length)){
     
      for (let l of wSqr.getAdjProperty('e')){
        l.flag();
        scraped = true;
      
        // console.log("flagged: x-" + l.y + " y-" + l.x);
      }

  //guess if
   } else if ((wSqr.number - wSqr.getAdjProperty('f').length) == 0){

     for (let l of wSqr.getAdjProperty('e')){
       l.guess();
       scraped = true;
        //console.log("guessed: x-" + l.y + " y-" + l.x);
     }   
   }

    //format + iterate
    // console.log();
    i++;
    set = getOpenSet(grid);
  }

  if (scraped == true){
    budgetVisualizer(playGrid);
    scrape(grid);
  } else {
    budgetVisualizer(playGrid);
    return false;
  }

}

//upper level solve
function shoopSolve(grid) {

}

//rng probability solver? idk how this is going to work man
function jesusSolve() {

}

//Gets open lands 
function getOpenSet(grid) {

  let openSet = [];
  for (let i = 0; i < (pGridx); i++) {
    for (let j = 0; j < (pGridy); j++) {

      if (grid[i][j].visible == true) {

        for (let k = 0; k < grid[i][j].neighbours.length; k++) {

          grid[i][j].neighbours[k].update();

          if (grid[i][j].neighbours[k].visible == false) {
            openSet.push(grid[i][j]);
            break;
          }

        }
      }
    }
  }
  
  return openSet;
  
}



//superpositions smaller set and tries to solve
function superPos(bLand, sLand){
  let wArr = [];

  //if small neighbours all in big neighbours
  if (sLand.getAdjProperty('e').every(n => bLand.getAdjProperty('e').includes(n))){

    //set work array to be big neighbours minus small neighbours
    wArr = bLand.getAdjProperty('e').filter(l => !sLand.getAdjProperty('e').includes(l));

    if (wArr.length == (bLand.number  - bLand.getAdjProperty('f').length) - (sLand.number - sLand.getAdjProperty('f').length)){
      wArr.forEach(x => x.flag);
    } 
    /*else if (wArr.length == (bLand.number  - bLand.getAdjProperty('f').length) - (sLand.number - sLand.getAdjProperty('f').length)){
      wArr.forEach(x => x.flag);
    }*/
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

//input own playGrid

function getWorkingGrid(l, w, array) {

  let arr = array;
  let tGrid = setGrid(l, w);

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


//
let array31 = [
  [0,0,'b','i'],
  [1,0,'b','i'],
  [0,1,3,'v'],
  [0,2,1,'v']
];


//main

//playGrid = setGrid(pGridx, pGridy);
firstGuessSetup(Math.floor(pGridx / 2), Math.floor(pGridy / 2));
//playGrid = getWorkingGrid(2, 1, array31);


updateAll(playGrid);
budgetVisualizer(playGrid);
console.log();
scrape(playGrid);
budgetTrueVisualizer(playGrid);
console.log("Solution: " + solved(playGrid));


//scrape(playGrid);
//budgetVisualizer(playGrid);
//console.log();
//console.log(playGrid);
//console.log(getOpenSet(playGrid));
//console.log();

//budgetVisualizer(playGrid);
//getNeighbours(playGrid[0][0]);
//console.log(playGrid[1][1].neighbours)
//playGrid[1][1].setVisible();

/*

[{1, 2, 3},
{3, 2, 1},
{2, 4, 1}]
*/