import React from 'react';

// set stylesheet, import bootstrap and css transitions
import styles from './NextPieceDisplay.styles';
import 'bootstrap/dist/css/bootstrap.css';

import constants from '../Constants/gameConstants';

import HighScores from './HighScores';

import Loader from 'react-loader-spinner'

class NextPieceDisplay extends React.Component {
  constructor(props) {
    super(props);

    // this.getHighScores = this.getHighScores.bind(this);

    this.state = {
      piece: this.props.piece,
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ piece: nextProps.piece });
    this.drawCanvas();
  }

  componentWillMount() {
    // this.getHighScores();
  }

  componentDidMount() {
    //console.log("mounted");

  }

  drawCanvas() {
    // get the canvas ctx and the square function
    const boardCtx = this.refs.canvas.getContext('2d');
    const laySquare = this.props.drawSquare;

    //copy the current Board
    let piece = JSON.parse(JSON.stringify(this.props.piece));

    // these are fudge factors for the square and line shapes
    let XShift = piece.name === 'O' ? 0.5 * constants.squareSize : 0;
    let YShift = piece.name === 'I' ? 0.5 * constants.squareSize : 0;

    // clear the current canvas and redraw according to the piece passed down
    boardCtx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.width);

    // draw each square of the piece
    piece.squares.forEach((square) => {
      let row = square[0];
      let col = square[1];
      let boardSquare = this.props.board[row][col];
      laySquare(boardSquare.x - XShift, boardSquare.y - YShift, piece.bgColor, boardCtx);
    });

  }

  render() {
    //console.log("rendering");
    //console.log(this.props.highScores);

    return (
      <div className="col-sm-2" style={styles.displayDivStyle}>

        <p style={styles.text}>Next: </p>
        <canvas ref="canvas"
          width={constants.nextPieceDisplaySize}
          height={constants.nextPieceDisplaySize}
          style={styles.canvasStyle}
        />
        <div>
          <p style={styles.text}>Score: {this.props.points}</p>
          <p style={styles.text}>Lines: {this.props.lines}</p>
          <p style={styles.text}>Level: {this.props.level}</p>
        </div>
        { // will display once this.state.highScores(in app.js) exists
          this.props.highScores ?
            <HighScores
              scores={this.props.highScores}
            />
            :
            <div className="" role="status">

              <p style={styles.smallText}>loading high scores...</p>
              <Loader
                type="ThreeDots"
                color="#00BFFF"
                height="50"
                width="50"
              />

            </div>
        }

        {/* <button
          style={styles.refreshScoresButton}
          onClick={this.getHighScores}>
          <MaterialIcon icon="refresh" size='medium' />

        </button> */}

      </div>
    )
  }

}

export default NextPieceDisplay;
