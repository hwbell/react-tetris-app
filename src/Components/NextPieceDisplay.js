import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import logo from './logo.svg';
import styles from './NextPieceDisplay.styles';

import 'bootstrap/dist/css/bootstrap.css';

import constants from '../Constants/gameConstants';

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
    let piece = JSON.parse(JSON.stringify(this.props.piece));
    
    // these are fudge factors for the square and line shapes
    let XShift = piece.name === 'O' ? 0.5*constants.squareSize : 0 ;
    let YShift = piece.name === 'I' ? 0.5*constants.squareSize : 0 ;

    // clear the current canvas and redraw according to the piece passed down
    boardCtx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.width);
    
    // draw each square of the piece
    piece.squares.forEach( (square) => {
      let row = square[0];
      let col = square[1];
      let boardSquare = this.props.board[row][col];
      laySquare(boardSquare.x-XShift, boardSquare.y-YShift, piece.bgColor, boardCtx);
    });
    
  }
  
  render() {
  //console.log("rendering");
    
    return (
      <div className="text-center" style={styles.displayDivStyle}>
        
        <p style={styles.text}>Next: </p>
        <canvas ref="canvas" 
          width={constants.nextPieceDisplaySize} 
          height={constants.nextPieceDisplaySize}
          style={styles.canvasStyle}
          />
        <p style={styles.text}>Score: {this.props.points}</p>
        <p style={styles.text}>Lines: {this.props.lines}</p>
        <p style={styles.text}>Level: {this.props.level}</p>
      </div>
    )
  }
  
}

export default NextPieceDisplay;
