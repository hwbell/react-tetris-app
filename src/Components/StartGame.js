import React from 'react';

// styling
import styles from './StartGame.styles';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';

// // constants
// import constants from '../Constants/gameConstants';

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
        
        <p style={styles.text}>Your name, if you please (optional)  <i className="fa fa-smile"></i></p>

        <form style={styles.inputForm} onSubmit={this.props.startGame}>
          <label style={styles.inputFormLabel}>
            <input
              type="text"
              value={this.props.value}
              onChange={this.props.handleChange}
              style={styles.submitNameStyle}
            />
          </label>
          <input className="btn btn-sm"
            type="submit"
            value="lets go!"
          />
        </form>


      </div>
    )
  }

}

export default StartGame;

