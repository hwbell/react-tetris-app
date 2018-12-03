const fetch = require('node-fetch');

const postScore = (score) => {
  fetch('http://localhost:3000/', {
          method: 'post',
          body:    JSON.stringify(score),
          headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.json())
      .then((json) => {
        // display the message from the server confirming the score
        // was posted to the server 

        return json;
      
      });
}

const getScores = () => {
  fetch('http://localhost:3000/scores', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then((json) => {

      return json;
      
      // display the message from the server confirming the score
      // was posted to the server 
      // this.setState({ highScores: json.highScores})

    });
}


export {
  postScore,
  getScores
}