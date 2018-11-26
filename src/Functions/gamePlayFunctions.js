import constants from '../Constants/gameConstants';
import { I, O, T, S, Z, J, L } from './pieceConstructors';

// to assign square objects for each place in the grid
function GameSquare(i, j) {
  
  let maxRow = constants.gameHeight-1;
  let maxCol = constants.gameWidth-1;
  this.x = j*constants.squareSize + 0.5*constants.squareSize;
  this.y = i*constants.squareSize + 0.5*constants.squareSize;
  this.row = i;
  this.column = j;
  
  let borderRow = i === 0 || i === maxRow;
  let borderCol = j === 0 || j === maxCol;
  this.bgColor = borderRow || borderCol ? constants.borderColor : constants.backgroundColor;
  
  // set the type of border squares to border
  if (borderRow || borderCol) {
    this.type = "border";
  }
  // set the type to floor for the bottom most row of the remaining squares
  else if (i === maxRow ) {
    this.type = "floor";
  } 
  // set the type to background for all other squares
  else { 
    this.type = "background";
  }
  
}

const makeGameArray = (width, height) => {
  let gameArray = [];
  for ( let i = 0; i<height; i++) {
    let thisRow = [];
    for (let j=0; j<width; j++) {
      let thisSquare = new GameSquare(i,j);
      thisRow.push(thisSquare);
    }
    gameArray.push(thisRow);
  }
  return gameArray;
}

// retrieve the current floor pieces from the current board
const getFloorFromBoard = (board) => {
  // we will make the floor the same as the board, a 24 x 14 array.
  // with only floor pieces kept. so if no floor pieces in row, that
  // row is just an empty array
  let currentBoard = JSON.parse(JSON.stringify(board));
  let floor = currentBoard.map((row) => {
    return row.filter((square) => {
      return square.type === 'floor';
    });
  });
  
  return [].concat.apply([], floor);
}

// make the initial floor with the bottom row of squares
const makeInitialFloor = (width) => {
  let floor = {};
  floor.squares = [];
  
  for ( let i=1; i<width-1; i++ ) {
    floor.squares.push([constants.gameHeight-1, i]);  
  }
  return floor;
}


const detectContact = (piece, floor) => {
  //console.log(floor)
  // for contact, the column of the square in question must be the same as a floor square, and the row must be  -1 from the same floor square
  // EX -   [P]     P=piece    Pcol = Fcol and Prow = Frow-1
  //        [F]     F=floor

  // check all piece's squares and if any of them are in contact with any of the floor, return true
  // for each square of the piece, we need to see if currentBoard[row+1][col].type === "floor"
  
  for ( let i=0; i<piece.squares.length; i++) {
    
    let matchingRow = piece.squares[i][0] + 1;
    let matchingCol = piece.squares[i][1];
    //console.log(matchingRow, matchingCol)
    for ( let j=0; j<floor.squares.length; j++) {
      let floorRow = floor.squares[j][0];
      let floorCol = floor.squares[j][1];
      // console.log(`piece.squares[i]: ${piece.squares[i]}`)
      // console.log(`floor[j]: ${floor.squares[j]}`)
      
      if ( floorRow === matchingRow && floorCol === matchingCol ) {
        //console.log("yep")
        return true;
      }
    }
  }
  
  return false;
}
  
const isRowContinuousFloor = (row) => {  
  
  for ( let i=0; i<row.length; i++) {
    let square = row[i];
    
    if (square.row === 0 || square.row === constants.gameHeight-1) {
      //console.log(`row is part of border`)
      return false;
    }
    
    let isborderCol = i === 0 || i === constants.gameWidth-1;
    
    // check if borderCol, or if it is part of the floor
    if (!isborderCol && square.type !== 'floor') {
      return false;
    }
  }
  return true;
}

// need to shift the board above complete lines when 
// lines are removed
const shiftBoard = (board, belowRow) => {
  let newBoard = JSON.parse(JSON.stringify(board));
  
  newBoard.forEach( (row, i) => {
    if (i <= belowRow && i > 1) {
      row.forEach((square) => {
        let newRow = square.row+1;
        square.y = newRow*constants.squareSize + 0.5*constants.squareSize;
        square.row = newRow;
      });
    }
  });
  return newBoard;
}

const shiftFloor = (floor, belowRow) => {
  let newFloor = JSON.parse(JSON.stringify(floor));
  for ( let i=0; i<newFloor.squares.length; i++) {
    if (newFloor.squares[i][0] <= belowRow && newFloor.squares[i][0] > 0) {
      newFloor.squares[i][0]++;
    }
  }
  return newFloor;
}

const removeCompleteLines = (board, floor) => {
  console.log('checking for complete lines')
  
  let lines = 0;
  let points = 0;
  
  // copy the board and floor
  let newBoard = JSON.parse(JSON.stringify(board));
  let newFloor = JSON.parse(JSON.stringify(floor));
  let newFloorSquares = newFloor.squares;
  // create empty row to add whenever a complete row is found
  let emptyRow = [];
  for (let j=0; j<constants.gameWidth; j++) {
    let newSquare = new GameSquare(1,j);
    emptyRow.push(newSquare);
  }
  
  // check each row for completion
  newBoard.forEach((row, i) => {
    if ( isRowContinuousFloor(row) ) {
      console.log("found continuous row")
      
      lines++;
      points = lines*25;
      // remove the row array from the board array, and insert
      // a new empty one @ row 1
      newBoard.splice(i,1);
      newBoard.splice(1, 0, emptyRow);   
      newBoard = shiftBoard(newBoard, i);
      
      newFloor.squares.forEach( (square) => {
        if (square[0] === i) {
          newFloor.squares.splice(i,1)
        }
      });
      newFloor = shiftFloor(newFloor, i);
    }
  });
  
  //console.log(newBoard)
  console.log(`lines: ${lines}`)
  return [newBoard, newFloor, lines, points];
}

// to randomly choose from the pieces I, O, T, S, Z, J, L
const getNewPieceFunction = () => {
  let num = Math.random();
  let odds = 1/7;
  let piece = {};
  
  if (num > 1-odds*1) {
    return I; 
  }
  
  else if (num > 1-odds*2) {
    return O; 
  }
  
  else if (num > 1-odds*3) {
    return T; 
  }
  
  else if (num > 1-odds*4) {
    return S; 
  }
  
  else if (num > 1-odds*5) {
    return Z; 
  }
  
  else if (num > 1-odds*6) {
    return J; 
  }
  
  else {
    return L; 
  }
  
}

export {
  GameSquare,
  makeGameArray,
  getFloorFromBoard,
  makeInitialFloor,
  detectContact,
  isRowContinuousFloor,
  shiftBoard,
  removeCompleteLines,
  getNewPieceFunction,
}