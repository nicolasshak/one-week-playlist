let index = require('./index.js');

let event = {
    body: JSON.stringify( { code: '' } )
}

index.handler(event).then(res => console.log(res));