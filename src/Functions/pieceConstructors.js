import constants from '../Constants/gameConstants';

// Define the pieces as objects according to a given center coordinates
// *** Using this site as a reference for the piece names: https://tetris.wiki/Tetromino

const getRandomColor = (colorList) => {
  let ind = Math.floor(Math.random() * 10);
  return colorList[ind];
}

// base square to inherit properties of centerRow, centerCol, and random color
function baseSquare (centerRow, centerCol) {
  this.centerRow = centerRow;
  this.centerCol = centerCol;
  
  // random color from list. Just change array of colors to change style
  this.bgColor = getRandomColor(constants.squareColors);
}

// I shape - [ ]
                // [*] centered at top - 1
                // [ ]
                // [ ]
function I (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow+1, centerCol],[centerRow+2, centerCol]];
}

// O shape - [ ] [ ] centered at bottom left
                // [*] [ ]
function O (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow-1, centerCol+1],[centerRow, centerCol+1]];
}

// T shape -     [ ]     centered at bottom middle 
              //   [ ] [*] [ ]
function T (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow, centerCol-1],[centerRow, centerCol+1]];
}

// S shape -     [ ] [ ]   centered at bottom
        //   [ ] [*] 
function S (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow-1, centerCol+1],[centerRow, centerCol-1]];
}

// Z shape -  [ ] [ ]      centered at bottom
        //        [*] [ ]
function Z (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol-1],[centerRow-1, centerCol],[centerRow, centerCol+1]];
}

// J shape -  [ ]          centered at bottom middle
        //    [ ] [*] [ ]
function J (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol-1],[centerRow, centerCol-1],[centerRow, centerCol+1]];
}

// L shape -          [ ]  centered at bottom middle
        //    [ ] [*] [ ]
function L (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow, centerCol-1],[centerRow, centerCol+1],[centerRow-1, centerCol+1]];
}

export { I, O, T, S, Z, J, L };