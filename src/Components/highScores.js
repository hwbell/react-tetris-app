import React, { Component } from 'react';
import styles from './highScores.styles';
import 'bootstrap/dist/css/bootstrap.css';

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
