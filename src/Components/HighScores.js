import React from 'react';

// styling
import styles from './HighScores.styles';

// bootstrap and transitions
import 'bootstrap/dist/css/bootstrap.css';

// constants
import constants from '../Constants/gameConstants';

// icons
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';

class HighScores extends React.Component {
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
 //console.log(this.props.scores);
    let items = this.props.scores.map((score, index) => {
      if (index > 10) {
        return null;
      }
      else {
        return (

          <div key={index} style={styles.textContainer} className="text-center row">
            <p style={styles.text}>{score.name}: </p>
            <p style={styles.score}>{score.score}</p>
          </div>
        )
      }
    });
    
    return (

      <div className="text-center" style={styles.containerStyle}>
        <p style={styles.title}>High Scores</p>
        {items}

      </div>
    )
  }

}

export default HighScores;

