const fetch = require('node-fetch');

fetch('https://lit-ridge-56288.herokuapp.com/', { 
    method: 'POST', 
    body: JSON.stringify({name: 'maek', score: 56}),
    headers: {
      "Content-type": "application/json"
    }  
  })
  .then(res => res.json()) // expecting a json response
  .then(json => console.log(json)); 