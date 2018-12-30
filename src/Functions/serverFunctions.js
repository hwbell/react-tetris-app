const fetch = require('node-fetch');

const postScore = (score) => {
  console.log('score: ')
  console.log(score)

  return fetch('https://lit-ridge-56288.herokuapp.com/', { 
    method: 'POST', 
    body: JSON.stringify(score),
    headers: {
      "Content-type": "application/json"
    }  
  })
  .then(res => res.json(), (err) => {
    console.log(err)
  }) // expecting a json response   
  
}

const getScores = () => {
 return fetch('https://lit-ridge-56288.herokuapp.com/scores', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json()) // expecting a json response
      
      // display the message from the server confirming the score
      // was posted to the server 
      // this.setState({ highScores: json.highScores})

}


export {
  postScore,
  getScores
}