// modules
import React from 'react';
import ReactDOM from 'react-dom';

// styling
import 'bootstrap/dist/css/bootstrap.css';
import styles from './App.styles';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// components
import NextPieceDisplay from './Components/NextPieceDisplay';
import GameOver from './Components/GameOver';
import StartGame from './Components/StartGame';
// constants
import constants from './Constants/gameConstants';

// icons
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';


// get gamePlayFunctions in shorthand
import {
  makeGameArray,
  makeInitialFloor,
  detectContact,
  removeCompleteLines,
  getNewPieceFunction,
} from './Functions/gamePlayFunctions';

const getInitialState = () => {
  var initialStateObj = {
    canvasWidth: constants.canvasWidth,
    canvasHeight: constants.canvasHeight,
    gameWidth: constants.gameWidth,
    gameHeight: constants.gameHeight,
    squareSize: constants.squareSize,
    board: makeGameArray(constants.gameWidth, constants.gameHeight),
    boardFloor: makeInitialFloor(constants.gameWidth),
    centerRow: 0,
    centerCol: Math.floor(constants.gameWidth / 2),
    intervalTimer: null,
    gameSpeed: 300,
    lines: 0,
    points: 0,
    level: 1,
    score: 0,
    gameLost: false,
    gameRunning: false,
    showSuccessfulSave: false,
    playerName: '',
    sendingScore: false,
    scoreSentSuccessfully: false,
  };
  // get two random piece functions to assign the first pieces
  let pieceFunction = getNewPieceFunction();
  let nextPieceFunction = getNewPieceFunction();

  // get new pieces for the first drop
  initialStateObj.currentPiece = new pieceFunction(2, Math.floor(constants.gameWidth / 2));
  initialStateObj.nextPiece = new nextPieceFunction(2, Math.floor(constants.gameWidth / 2));

  // another copy of the next piece for the display
  initialStateObj.nextPieceDisplay = new nextPieceFunction(2, 2);
  initialStateObj.nextPieceDisplay.bgColor = initialStateObj.nextPiece.bgColor;

  return initialStateObj;
}

class GameSpace extends React.Component {
  constructor(props) {
    super(props)
    // this.handleKeyPress = this.handleKeyPress.bind(this);
    this.redrawCanvas = this.redrawCanvas.bind(this);
    this.startGame = this.startGame.bind(this);
    this.backToStartScreen = this.backToStartScreen.bind(this);
    this.getPlayerName = this.getPlayerName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendScoreToServer = this.sendScoreToServer.bind(this);
  }

  componentWillMount() {
    this.setState(getInitialState());
  }

  componentDidMount() {
    console.log("mounted");
    this.redrawCanvas();
  }

  focusDiv(selector) {
    console.log(`focusing on ${selector}`)
    ReactDOM.findDOMNode(selector).focus();
  }

  // to fill in individual squares of the canvas according to state
  drawSquare(centerRow, centerCol, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(centerRow, centerCol, constants.squareSize, constants.squareSize);
  }

  redrawCanvas() {
    // get the canvas context and the laySquare function
    const boardCtx = this.refs.canvas.getContext('2d');
    const laySquare = this.drawSquare || this.props.drawSquare;

    // clear the current canvas and redraw according to this.state.board
    boardCtx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    this.state.board.forEach((row) => {
      row.forEach((point) => {
        laySquare(point.x, point.y, point.bgColor, boardCtx);
      });
    });
  }

  // when the current piece reaches the bottom or any floor piece, i.e. contact detected
  addToFloor(piece) {

    let newFloor = JSON.parse(JSON.stringify(this.state.boardFloor));
    let newBoard = JSON.parse(JSON.stringify(this.state.board));

    piece.squares.forEach((square) => {
      newFloor.squares.push(square);
      let col = square[0];
      let row = square[1];
      newBoard[col][row].type = "floor";
      newBoard[col][row].bgColor = piece.bgColor;
    });

    newBoard = removeCompleteLines(newBoard, newFloor);

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

  updateLinesAndPoints(newBoard) {

    this.setState({
      lines: this.state.lines + newBoard[2],
      points: this.state.points + newBoard[3]
    });
    this.setState({
      level: Math.floor((this.state.lines / 10) + 1)
    });

  }

  rotatePiece() {
    let centerRow = this.state.currentPiece.centerRow;
    let centerCol = this.state.currentPiece.centerCol;

    // console.log("rotating piece")
    // console.log(`center: ${centerRow}, ${centerCol}`)
    let currentBoard = JSON.parse(JSON.stringify(this.state.board));
    let currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));

    //console.log(`currentPiece.squares: ${currentPiece.squares}`)

    // if its a square, don't do anything
    if (this.state.currentPiece.name === 'O') {
      return;
    }
    // clear the currentPiece off of the board
    this.state.currentPiece.squares.forEach((square) => {
      //console.log(`clearing ${square[0]}, ${square[1]}`)
      currentBoard[square[0]][square[1]].bgColor = constants.backgroundColor;
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
    if (illegalMove) { return; }

    // change the currentBoard to reflect the rotated piece
    newPiece.squares.forEach((square) => {
      currentBoard[square[0]][square[1]].bgColor = currentPiece.bgColor;
    });

    return this.setState({
      board: currentBoard,
      currentPiece: newPiece
    });

  }

  handleKeyPress(event) {
    console.log(event.key);
    event.preventDefault();

    if (event.key === "ArrowUp") {
      this.rotatePiece();
    } else {
      this.shiftPieceCenter(event.key);
    }

    // define "ArrowLeft" / "ArrowRight" / "ArrowDown" behavior based on simple conversion on the current centerX, centerY

    // define "ArrowUp" behavior based on rotation
    this.redrawCanvas();
  }

  // returns true for a legal move an false otherwise
  isMoveLegal(piece) {
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
    if (illegalMove) { return false; }

    return true;
  }

  // to move a piece around the board 
  // this handles both the base interval as well as the user keyboard input.

  shiftPieceCenter(key) {

    // copy the current board and piece
    let currentBoard = JSON.parse(JSON.stringify(this.state.board));
    let currentPiece = JSON.parse(JSON.stringify(this.state.currentPiece));
    let centerRow = this.state.centerRow;
    let centerCol = this.state.centerCol;

    // clear the currentPiece from the board
    this.state.currentPiece.squares.forEach((square) => {
      currentBoard[square[0]][square[1]].bgColor = constants.backgroundColor;
    });

    let movedSquares;

    // change the center accoding to the key

    if (key === "ArrowDown") { // add 1 to row
      centerRow++;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0] + 1, square[1]];
      });
      currentPiece.centerRow++;
    }
    else if (key === "ArrowLeft") { // subtract 1 from col
      centerCol--;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0], square[1] - 1];
      });
      currentPiece.centerCol--;
    }
    else if (key === "ArrowRight") { // add 1 to col
      centerCol++;
      movedSquares = currentPiece.squares.map((square) => {
        return [square[0], square[1] + 1];
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
  startPieceDropInterval() {
    console.log("new Interval starting");

    let timer = setInterval(() => {
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
        return this.newPieceDropInterval(timer, initialPiece);
      }

      // returns false for an illegal move
      // otherwise moves the piece down and returns true  
      let movedPiece = this.shiftPieceCenter("ArrowDown");

      if (!movedPiece) {
        return this.newPieceDropInterval(timer, initialPiece);
      }

    }, this.state.gameSpeed);
  }

  newPieceDropInterval(timer, movedPiece) {
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
    let nextPiece = new nextPieceFunction(2, Math.floor(constants.gameWidth / 2));
    let nextPieceDisplay = new nextPieceFunction(2, 2);
    nextPieceDisplay.bgColor = nextPiece.bgColor;

    this.setState((prevState) => {
      return {
        currentPiece: prevState.nextPiece,
        nextPiece: nextPiece,
        nextPieceDisplay: nextPieceDisplay,
        centerRow: 0,
        centerCol: Math.floor(constants.gameWidth / 2),
      }
    });

    //this.redrawCanvas();

    return this.startPieceDropInterval();
  }

  startGame(event) {
    this.focusDiv(this.refs.canvasHolder);
    this.setState({
      gameRunning: true,
    });
    this.startPieceDropInterval();
  }

  endGame() {
    this.setState({
      gameLost: true,
      selectingToSave: true,
    });
  }

  backToStartScreen() {
    this.setState(getInitialState());
  }

  getPlayerName() {
    this.setState({
      getPlayerName: true,
      //gameLost: false,
    })
  }

  handleChange(event) {
    console.log('onchange firing')
    this.setState({ playerName: event.target.value });
  }

  sendScoreToServer() {
    const self = this;
    const score = {
      name: this.state.playerName,
      score: this.state.score,
      lines: this.state.lines,
      level: this.state.level
    }
    self.setState({
      sendingScore: true,
    });

    setTimeout ( () => {
      fetch('https://lit-ridge-56288.herokuapp.com/', {
      method: 'POST',
      body: JSON.stringify(score),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        self.setState({
          scoreSentSuccessfully: true
        });

        setTimeout( () => {
          self.setState(getInitialState());
        }, 800)
      });
    }, 800)

  }

  render() {

    return (
      <div className="text-center container-fluid" style={styles.mainContainerStyle}>

        <h1 className="text-center" style={styles.titleStyle}>Tetris</h1>

        <div className="text-center row" style={styles.gameContainerStyle}  >


            {!this.state.gameRunning ? // Display at the beginning before the game is in progress
              <StartGame
                startGame={this.startGame}
                handleChange={this.handleChange}
                value={this.state.value}
              />
              : null}

          <div ref="canvasHolder"
            className="text-center canvasHolder"
            style={styles.canvasHolderStyle}
            onKeyDown={(e) => this.handleKeyPress(e)}
            tabIndex="0">

            <ReactCSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}>

              {this.state.gameLost ? // Display when the game is lost
                <GameOver
                  // props for game info
                  level={this.state.level}
                  lines={this.state.lines}
                  points={this.state.points}

                  // sendScoreToServer and backToStartScreen functions
                  sendScoreToServer={this.sendScoreToServer}
                  sendingScore={this.state.sendingScore} // will toggle when sending to server w/ func
                  scoreSentSuccessfully={this.state.scoreSentSuccessfully}
                  backToStartScreen={this.backToStartScreen}
                /> : null}

              {this.state.gameRunning ? // Show the player's name once they've started
                <div>{this.state.playerName} for the win!</div>
                : null}

            </ReactCSSTransitionGroup>

            <canvas ref="canvas"
              className="col"
              width={this.state.canvasWidth}
              height={this.state.canvasHeight}
              style={styles.canvasStyle} />

          </div>

          <NextPieceDisplay
            points={this.state.points}
            lines={this.state.lines}
            level={this.state.level}
            board={makeGameArray(5, 5)}
            piece={this.state.nextPieceDisplay}
            drawSquare={this.drawSquare} />

        </div>

      </div>
    )
  }
}

export default GameSpace;
