// define the width and height, in number of squares
const gameWidth = 15;
const gameHeight = 30;

// define the width/height of squares, in pixels
const squareSize = 25;

// define canvas size according to squaresize
const canvasWidth = squareSize*gameWidth+ squareSize;
const canvasHeight = squareSize*gameHeight+ squareSize;

// colors for GameSquares
const backgroundColor = 'black';
const borderColor = 'black';

// define colorset and a function to pull one randomly for each move 
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
  backgroundColor,
  borderColor,
  squareColors
}

export default constants;