let index = require('./index.js');

let event = {
    body: JSON.stringify( { code: '' } )
}

index.handler(event)
    .catch(err => console.log(err))
    .then(res => console.log(res));