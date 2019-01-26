import React from 'react';

// styling
import styles from './GameOver.styles';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// constants
import constants from '../Constants/gameConstants';

// icons
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

// jsx elemements (too small to make components, I think)
const askToSend = (props) => {
  return (
    <div className="text-center">
      <p style={styles.gameLostMajorText}>Game Over <FaFrown /></p>
      <p style={styles.gameLostMinorText}>Level Reached: {props.level}</p>
      <p style={styles.gameLostMinorText}>Lines: {props.lines}</p>
      <p style={styles.gameLostMinorText}>Points: {props.points}</p>
      <p style={styles.gameLostMajorText}>Save to server?</p>
      <button
        className="btn btn-default"
        style={styles.saveScoreButtonStyle}
        onClick={props.sendScoreToServer} >
        <FaCheck />
      </button>
      <button
        className="btn btn-default"
        style={styles.dontSaveButtonStyle}
        onClick={props.backToStartScreen} >
        <FaTimes />
      </button>
    </div>
  )
}

const sendInProgress = () => {
  return (
    <div className="text-center">
      <p style={styles.gameLostMajorText}>Sending ... </p>
      <FaSpinner style={{ marginBottom: 10 }} />
    </div>
  )
}

const scoreSent = () => {
  return (
    <div className="text-center">
      <p style={styles.gameLostMajorText}>Score Saved!</p>
      <FaCheck style={{ marginBottom: 10 }} />
    </div>
  )
}

class GameOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendingScore: this.props.sendingScore,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      sendingScore: nextProps.sendingScore,
      scoreSentSuccessfully: nextProps.scoreSentSuccessfully,
    })
  }

  componentDidMount() {
    //console.log("mounted");

  }

  render() {
    //console.log("rendering");

    return (
      <div className="col game-over-container" style={styles.gameLostNoticeStyle}>

        {!this.state.sendingScore && askToSend(this.props) }

        {this.state.sendingScore && sendInProgress() }

        {this.state.scoreSentSuccessfully && scoreSent() }

      </div>
    )
  }

}

export default GameOver;

