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

class GameOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //
    };
  }

  componentWillReceiveProps(nextProps) {
    //
  }

  componentDidMount() {
    //console.log("mounted");

  }

  render() {
    //console.log("rendering");

    return (
      <div className="col game-over-container" style={styles.gameLostNoticeStyle}>
        <p style={styles.gameLostMajorText}>Game Over <FaFrown /></p>
        <p style={styles.gameLostMinorText}>Level Reached: {this.props.level}</p>
        <p style={styles.gameLostMinorText}>Lines: {this.props.lines}</p>
        <p style={styles.gameLostMinorText}>Points: {this.props.points}</p>

          <div className="text-center">
          <p style={styles.gameLostMajorText}>Save to server?</p>
            <button
              className="btn btn-default"
              style={styles.saveScoreButtonStyle}
              onClick={this.props.sendScoreToServer} >
              <FaCheck />
            </button>
            <button
              className="btn btn-default"
              style={styles.dontSaveButtonStyle}
              onClick={this.props.backToStartScreen} >
              <FaTimes />
            </button>
          </div>


      </div>
    )
  }

}

export default GameOver;

