import React from 'react';

// styling
import styles from './StartGame.styles';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// constants
import constants from '../Constants/gameConstants';

// icons
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';
import { FaFrown } from 'react-icons/fa';

class StartGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //value: 'Enter a name'
    };
  }

  componentWillReceiveProps(nextProps) {
    //
  }

  componentDidMount() {
    //console.log("mounted");

  }

  render() {
   
    return (
      <div className="game-start-buttons" style={styles.startGameContainerStyle}>
        
        <p style={styles.text}>Enter a name</p>
        
        <form style={styles.inputForm} onSubmit={this.props.startGame}>
          <label>
            <input
              type="text"
              value={this.props.value}
              onChange={this.props.handleChange}
              style={styles.submitNameStyle}
            />
          </label>
          <input
            type="submit"
            value="play"
            style={styles.startGameButtonStyle}
          />
        </form>


      </div>
    )
  }

}

export default StartGame;

