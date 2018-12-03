import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import logo from './logo.svg';
import styles from './highScores.styles';

import 'bootstrap/dist/css/bootstrap.css';

import constants from '../Constants/gameConstants';

class highScores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highScores: this.props.highScores
    };
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({ scores: nextProps.highScores });  
  }
  
  componentDidMount () {
    //console.log("mounted");
    
  }
  
  
  render() {
  //console.log("rendering");
    
    return (
      <div className="" style={styles.displayDivStyle}>
        
      </div>
    )
  }
  
}

export default highScores;
