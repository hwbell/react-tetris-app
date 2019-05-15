// define the width and height, in number of squares
const gameWidth = 14;
const gameHeight = 24;


// define the width/height of squares, in pixels
const squareSize = 20;

// define canvas size according to squaresize
const canvasWidth = squareSize*gameWidth + squareSize;
const canvasHeight = squareSize*gameHeight + squareSize;

// define nextPieceDisplay size accoring to squareSize. This will be a square so just need one number
const nextPieceDisplaySize = squareSize*5 + squareSize;


// colors for body
const bodyColor = '#3498DB'

// colors for GameSquares
const backgroundColor = 'white';
const borderColor = 'black';

// define colorset
//  - a function from gamePlayFunctions will pull one randomly for each move 
const squareColors = [ // using material design chart from https://htmlcolorcodes.com/color-chart/
  '#E91E63',
  '#9C27B0',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#8BC34A',
  '#FFEB3B',
  '#FFC107',
  '#FF5722',
]

// wrap in object and export
const constants = {
  gameHeight,
  gameWidth,
  squareSize,
  canvasHeight,
  canvasWidth,
  nextPieceDisplaySize,
  backgroundColor,
  borderColor,
  squareColors,
  bodyColor
}

export default constants;