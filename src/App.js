import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.scss';

// define the width and height, in number of squares
const gameWidth = 12;
const gameHeight = 22;

// define the width/height of squares, in pixels
const squareSize = 25;

// define canvas size according to squaresize
const canvasWidth = squareSize*gameWidth+ 0.5*squareSize;
const canvasHeight = squareSize*gameHeight+ 0.5*squareSize;

// colors for GameSquares
const background = 'black';
const pieceColor = "#FF7043";
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

const getRandomColor = (colorList) => {
  let ind = Math.floor(Math.random() * 10);
  return colorList[ind];
}

// to assign square objects for each place in the grid
function GameSquare(i, j) {
  
  let maxRow = gameHeight-1;
  let maxCol = gameWidth-1;
  this.x = j*squareSize + 0.5*squareSize;
  this.y = i*squareSize + 0.5*squareSize;
  this.row = i;
  this.column = j;
  
  let borderRow = i === 0 || i === maxRow;
  let borderCol = j === 0 || j === maxCol;
  this.bgColor = borderRow || borderCol ? borderColor : background;
  
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
    floor.squares.push([gameHeight-1, i]);  
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
    
    if (square.row === 0 || square.row === gameHeight-1) {
      //console.log(`row is part of border`)
      return false;
    }
    
    let isborderCol = i === 0 || i === gameWidth-1;
    
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
        square.y = newRow*squareSize + 0.5*squareSize;
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
  for (let j=0; j<gameWidth; j++) {
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

// Define the pieces as objects according to a given center coordinates
// *** Using this site as a reference for the piece names: https://tetris.wiki/Tetromino

// base square to inherit properties of centerRow, centerCol, and random color
function baseSquare (centerRow, centerCol) {
  this.centerRow = centerRow;
  this.centerCol = centerCol;
  
  // random color from list. Just change array of colors to change style
  this.bgColor = getRandomColor(squareColors);
}

function dummy (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol)
}

// straight line - [ ]
                // [*] centered at top - 1
                // [ ]
                // [ ]
function I (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow+1, centerCol],[centerRow+2, centerCol]];
}

// simple square - [ ] [ ] centered at bottom left
                // [*] [ ]
function O (centerRow, centerCol) {
  baseSquare.call(this, centerRow, centerCol);
  this.squares = [[centerRow, centerCol],[centerRow-1, centerCol],[centerRow-1, centerCol+1],[centerRow, centerCol+1]];
}

// upside down T -     [ ]     centered at bottom middle 
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

// S shape -  [ ] [ ]      centered at bottom
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

const getInitialState = () => {
  var initialStateObj = {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    gameWidth: gameWidth,
    gameHeight: gameHeight,
    squareSize: squareSize,
    board: makeGameArray(gameWidth, gameHeight),
    boardFloor: makeInitialFloor(gameWidth),
    centerRow: 0,
    centerCol: Math.floor(gameWidth/2),
    intervalTimer: null,
    gameSpeed: 300,
    lines: 0,
    points: 0,
    level: 1,
    gameLost: false,
    gameRunning: false
  };
  
  // get two random piece functions to assign the first pieces
  let pieceFunction = getNewPieceFunction();
  let nextPieceFunction = getNewPieceFunction();
  
  // get new pieces for the first drop
  initialStateObj.currentPiece = new pieceFunction(2, Math.floor(gameWidth/2));
  initialStateObj.nextPiece = new nextPieceFunction(2, Math.floor(gameWidth/2));
  
  // another copy of the next piece for the display
  initialStateObj.nextPieceDisplay = new nextPieceFunction(4, 3);
  initialStateObj.nextPieceDisplay.bgColor = initialStateObj.nextPiece.bgColor;
  
  return initialStateObj;
}

class GameSpace extends React.Component{
  constructor(props) {
    super(props)
   // this.handleKeyPress = this.handleKeyPress.bind(this);
    this.redrawCanvas = this.redrawCanvas.bind(this);
    this.startGame = this.startGame.bind(this);
    this.backToStartScreen = this.backToStartScreen.bind(this);
    this.state = getInitialState();
  }
  
  componentDidMount () {
    console.log("mounted");
    this.redrawCanvas();
  }
  
  focusDiv(selector) {
    console.log(`focusing on ${selector}`)
    ReactDOM.findDOMNode(selector).focus();
  }

  // to fill in individual squares of the canvas according to state
  drawSquare (centerRow, centerCol, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(centerRow, centerCol, squareSize, squareSize);
  }
  
  redrawCanvas () {
    // get the canvas context and the laySquare function
    const boardCtx = this.refs.canvas.getContext('2d');
    const laySquare = this.drawSquare || this.props.drawSquare;
    
    // clear the current canvas and redraw according to this.state.board
    boardCtx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    this.state.board.map((row) => {
      row.map((point) => {
        laySquare(point.x, point.y, point.bgColor, boardCtx);
      });
    });
  }
  
  // when the current piece reaches the bottom or any floor piece, i.e. contact detected
  addToFloor (piece) {
    
    let newFloor = JSON.parse(JSON.stringify(this.state.boardFloor));
    let newBoard = JSON.parse(JSON.stringify(this.state.board));
    
    piece.squares.forEach((square) => {
      newFloor.squares.push(square);
      let col = square[0];
      let row = square[1];
      newBoard[col][row].type = "floor";
      newBoard[col][row].bgColor = piece.bgColor;
    });
    
    newBoard = removeCompleteLines(newBoard,newFloor);
    
    this.setState({
      board: newBoard[0],
      boardFloor: newBoard[1],
    });
    
    if (newBoard[2]) {
      console.log('updating lines and points')
      this.updateLinesAndPoints(newBoard);
    }
    
    //console.log(`newFloor: ${newFloor.squares}`)
  }
  
  updateLinesAndPoints (newBoard) {
    
    this.setState({
      lines: this.state.lines + newBoard[2],
      points: this.state.points + newBoard[3]
    });
    this.setState({
      level: Math.floor(this.state.lines/10)
    });
    
  }
  
  rotatePiece () {
    let centerRow = this.state.currentPiece.centerRow;
    let centerCol = this.state.currentPiece.centerCol;
    
    // console.log("rotating piece")
    // console.log(`center: ${centerRow}, ${centerCol}`)
    let currentBoard = JSON.parse(JSON.stringify(this.state.board));
    let currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
    
    //console.log(`currentPiece.squares: ${currentPiece.squares}`)
    
    // clear the currentPiece off of the board
    this.state.currentPiece.squares.forEach((square) => {
      //console.log(`clearing ${square[0]}, ${square[1]}`)
      currentBoard[square[0]][square[1]].bgColor = background;
    });
    
    let rotatedSquares = currentPiece.squares.map((square) => {
      // rotation of the row and col of each square is changed according to its original displacement from the center square
      // the center square does not change
      let row = square[0];
      let col = square[1];
      let initialRowDisp = row - centerRow;
      let initialColDisp = col - centerCol;
      let newRow = centerRow + initialColDisp;
      let newCol = centerCol - initialRowDisp;
      return [newRow, newCol];
    });
    
    let newPiece = JSON.parse(JSON.stringify(currentPiece));
    newPiece.squares = rotatedSquares;
    //console.log(rotatedSquares);
    
    // check for illegal movement into existing floor or border
    let illegalMove = false;
    newPiece.squares.forEach((square) => {
      let boardSquare = currentBoard[square[0]][square[1]];

      if (!boardSquare || boardSquare.type !== "background") {
        illegalMove = true
      } 
    });
    //console.log(`illegalMove: ${illegalMove}`)
    if (illegalMove) {return;}
    
    // change the currentBoard to reflect the rotated piece
    newPiece.squares.forEach((square) => {
      currentBoard[square[0]][square[1]].bgColor = currentPiece.bgColor;
    });
    
    this.setState({
      board: currentBoard,
      currentPiece: newPiece
    });
    
  }
  
  handleKeyPress (event)  {
    console.log(event.key);
    event.preventDefault();

    if (event.key === "ArrowUp") {
      this.rotatePiece();
    } else {
      this.shiftPieceCenter (event.key);
    }
    
    // define "ArrowLeft" / "ArrowRight" / "ArrowDown" behavior based on simple conversion on the current centerX, centerY
    
    // define "ArrowUp" behavior based on rotation
    this.redrawCanvas();
  }
  
  // returns true for a legal move an false otherwise
  isMoveLegal (piece) {
    // copy the currentBoard
    let currentBoard = JSON.parse(JSON.stringify(this.state.board));
    
    // check for illegal movement into existing floor or border, or nonexistent piece
    let illegalMove = false;
    piece.squares.forEach((square) => {
      let boardSquare = currentBoard[square[0]][square[1]];

      if (!boardSquare || boardSquare.type !== "background") {
        illegalMove = true
      }
    });
    //console.log(`illegalMove: ${illegalMove}`)
    if (illegalMove) {return false;}
    
    return true;
  }
  
  // to move a piece around the board 
  // this handles both the base interval as well as the user keyboard input.
  
  shiftPieceCenter (key) {
    
    // copy the current board and piece
    let currentBoard = JSON.parse(JSON.stringify(this.state.board));
    let currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
    let centerRow = this.state.centerRow;
    let centerCol = this.state.centerCol;

    // clear the currentPiece from the board
    this.state.currentPiece.squares.forEach((square) => {
      currentBoard[square[0]][square[1]].bgColor = background;
    });
    
    let movedSquares;
    
    // change the center accoding to the key
    
    if (key === "ArrowDown") { // add 1 to row
      centerRow++;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0]+1, square[1]];
      });
      currentPiece.centerRow++;
    } 
    else if (key === "ArrowLeft") { // subtract 1 from col
      centerCol--;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0], square[1]-1];
      });
      currentPiece.centerCol--;
    } 
    else if (key === "ArrowRight") { // add 1 to col
      centerCol++;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0], square[1]+1];
      });
      currentPiece.centerCol++;
    } 
    else { // nothing for other keys
      return;
    }
    
    let movedPiece = JSON.parse(JSON.stringify(currentPiece));
    movedPiece.squares = movedSquares;
    
    //console.log(`movedSquares: ${movedSquares}`)
    
    // check for illegal movement into an occupied square - floor or border
    // make sure none of the squares of the new piece are border or floor already, by just checking if the type == 'background'
    
    // check for illegal movement into existing floor or border
    if (!this.isMoveLegal(movedPiece)) {
      console.log('illegal move');
      return false; 
    }
    
    else {
      // change the currentBoard to show the new piece
      movedPiece.squares.forEach((square) => {
        currentBoard[square[0]][square[1]].bgColor = currentPiece.bgColor;
      });

      this.setState({
        board: currentBoard,
        centerRow: centerRow,
        centerCol: centerCol,
        currentPiece: movedPiece
      });
    }

    return true;
  }
  
  
  // this is just for the regular interval of downward piece movement
  // User input is handled separately
  startPieceDropInterval () {
    console.log("new Interval starting");
    
    let timer = setInterval( () => {
      // redraw  the board
      this.redrawCanvas();
      // copy the board
      let board = JSON.parse(JSON.stringify(this.state.board))
      
      // first check for any contact created by user input
      let initialPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
      let initialFloor = JSON.parse(JSON.stringify(this.state.boardFloor));
            
      // if piece hits any part of the floor, it becomes part of the floor. Restart with a new piece
      let contact = detectContact(initialPiece, initialFloor);
      
      if (contact) {
        return this.newPieceDropInterval (timer, initialPiece);
      }
      
      // returns false for an illegal move
      // otherwise moves the piece down and returns true  
      let movedPiece = this.shiftPieceCenter("ArrowDown");
      
      if (!movedPiece) {
        return this.newPieceDropInterval (timer, initialPiece);
      }
        
    }, this.state.gameSpeed );
  }
  
  newPieceDropInterval (timer, movedPiece) {
    // console.log("restarting game")
    clearInterval(timer);

    // check if game is lost by simply checking if the minimun row of the piece is < 2
    if (!this.isMoveLegal(movedPiece) && this.state.centerRow === 0) {
      this.redrawCanvas();
      return this.endGame();
    }

    // make piece part of the floor
    this.addToFloor(movedPiece);
    
    
    // start over with a new currentPiece and nextPiece        
    
    //  get the new Pieces to start over with
    let nextPieceFunction = getNewPieceFunction();
    let nextPiece = new nextPieceFunction(2, Math.floor(gameWidth/2));
    let nextPieceDisplay = new nextPieceFunction(4, 3);
    nextPieceDisplay.bgColor = nextPiece.bgColor;
    
    this.setState( (prevState) => {
      return {
        currentPiece: prevState.nextPiece,
        nextPiece: nextPiece,
        nextPieceDisplay: nextPieceDisplay,
        centerRow: 0,
        centerCol: Math.floor(gameWidth/2),
      }
    });
    
    //this.redrawCanvas();

    return this.startPieceDropInterval();
  }
  
  startGame () {
    this.focusDiv(this.refs.canvasHolder);
    this.setState ({
      gameRunning: true,
    });
    this.startPieceDropInterval();
  }
  
  endGame () {
    this.setState({
      gameLost: true
    });
  }
  
  backToStartScreen () {
    this.setState(getInitialState());
  }
  
  
  ////////////////////////////
  render() {
  //console.log("rendering");
    
    const self = this;
    const mainContainerStyle = {
      position: 'relative',
      border: '',
      width: 700,
      height: 1000
    };
    
    const fixedContainerWidth = 675;
    const fixedContainerStyle = {
      width: fixedContainerWidth,
      position: 'absolute',
      left: '50%',
      marginLeft: -fixedContainerWidth/2,
    };
    
    const canvasHolderStyle = {
      width: fixedContainerWidth,
      position: 'relative',
      // margin: 20,
      // paddingRight: 25,
      // border: '1px solid black',
      borderRadius: 15
    };
    
    const gameLostNoticeWidth = 0.6*fixedContainerWidth;
    const gameLostNoticeStyle = {
      width: '80%',
      position: 'absolute',
      left: '53%',
      top: '30%',
      zIndex: 1,
      color: 'white',
      fontSize: 20,
      marginLeft: -gameLostNoticeWidth/3,
      background: 'rgba(0,0,0,0.5)',
    };
       
    const saveScoreButtonStyle = {
      color: 'black',
      fontSize: 20,
      width: 60,
      height: 40,
      padding: 0,
      borderRadius: 14,
      marginBottom: 10,
    }
    
    const startGameContainerStyle = {
      width: '70%',
      position: 'absolute',
      left: '58%',
      top: '40%',
      height: 120,
      borderRadius: 15,
      zIndex: 1,
      color: 'white',
      fontSize: 20,
      marginLeft: -gameLostNoticeWidth/3,
      background: 'rgba(0,0,0,0.5)',
    };
    
    const startGameButtonStyle = {
      color: 'black',
      fontSize: 20,
      width: 130,
      height: 40,
      marginTop: 40,
      padding: 0,
      borderRadius: 14
    }
    
    console.log(this.state.gameRunning)
    let col, row;
    return (
      <div className="text-center container" style={mainContainerStyle}>
        
        <div className="row fixed-game-elements" style={fixedContainerStyle}  >
          
          <div ref="canvasHolder" className="col canvasHolder" style={canvasHolderStyle} onKeyDown={(e) => this.handleKeyPress(e)} tabIndex="0">
            { !this.state.gameRunning ? 
              <div className="col game-start-buttons" style={startGameContainerStyle}>
                <button 
                  className="btn btn-default col" 
                  style={startGameButtonStyle}
                  onClick={this.startGame}>
                  New Game
                </button>
              </div>              
              : null }
            
            { this.state.gameLost ? 
              <div className="col game-won-buttons" style={gameLostNoticeStyle}>
                <p>Game Over !</p>
                <p>Level Reached: {this.state.level}</p>
                <p>Lines: {this.state.lines}</p>
                <p>Points: {this.state.points}</p>
                <p>Save to high scores ?</p>
                
                <button 
                  className="btn btn-default col" 
                  style={saveScoreButtonStyle}
                  onClick={this.sendScoreToServer} >
                  yes
                </button>
                <button 
                  className="btn btn-default col" 
                  style={saveScoreButtonStyle}
                  onClick={this.backToStartScreen} >
                  no
                </button>
                
              </div>
              
              : null }
            
            <canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight}/>
            
          </div>
          
          {<NextPieceDisplay 
             points={this.state.points}
             lines={this.state.lines}
             level={this.state.level}
             board={makeGameArray(7,7)}
             piece={this.state.nextPieceDisplay}
             drawSquare = {this.drawSquare}/>
          }
        </div>
      </div>
    )
  }
}

class NextPieceDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      piece: this.props.piece
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ piece: nextProps.piece });  
    this.drawCanvas();
  }
  
  componentDidMount () {
    //console.log("mounted");
    
  }
  
  drawCanvas () {
    // get the canvas ctx and the square function
    const boardCtx = this.refs.canvas.getContext('2d');
    const laySquare = this.props.drawSquare;
    
    //copy the current Board
    let board = JSON.parse(JSON.stringify(this.props.board));
    let piece = JSON.parse(JSON.stringify(this.props.piece));
//     console.log(`squares: ${piece.squares}`)
//     console.log('piece: @  0,0: ')
//     console.log(board[0][0])
    
    // clear the current canvas and redraw according to this.state.board
    boardCtx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.width);
    
    //this.props.piece.squares.forEach()
    
    this.props.board.forEach((row) => {
      row.forEach((point) => {
        
        let color;
        piece.squares.forEach((square) => {
          //console.log('foreaching piece squares!: ', square[0], square[1], point.row, point.column)
          if (point.row === square[0] && point.column === square[1]) {
            //console.log('yep!')
            color = piece.bgColor;
          }
          
        });
        
        laySquare(point.x, point.y, color ? color : background, boardCtx);
        
      });
      
    });
  }
  
  render() {
  //console.log("rendering");
    const self = this;
    const displayDivStyle = {
      // border: '1px solid grey',
      borderRadius: 10,
      width: 750,
      height: 400,
      marginTop: 25
    };
    const nextPieceTextStyle = {
      fontWeight: 'bold',
      fontSize: 25,
    };
    const statsStyle = {
      fontWeight: 'bold',
      fontSize: 25,
    };
    
    return (
      <div className="col" style={displayDivStyle}>
        
        <p style={nextPieceTextStyle}>Next: </p>
        <canvas ref="canvas" width={squareSize*8+ 0.5*squareSize} height={squareSize*8+ 0.5*squareSize}/>
        <p style={statsStyle}>Score: {this.props.points}</p>
        <p style={statsStyle}>Lines: {this.props.lines}</p>
        <p style={statsStyle}>Level: {this.props.level}</p>
      </div>
    )
  }
  
}


export default GameSpace;
