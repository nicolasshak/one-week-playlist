let index = require('./index.js');

let event = {
    body: JSON.stringify( { code: 'AQAKtsuw9xm5P1oychfcEMhgRXw-fRA7l9xIZyRErLCnt_96-FTpEAPvSz1KXx_5YAwzym2KE_EPBBmII2eCpMXDshBRIxcjeEgcDnkwDwhey7CZjqkvp9ETkiQ_NQTVwL281kEDNZwA8myNn48usmhEdTovL9NxAwf1ZqrOz4z8YXQPt4_Ie69gGGgrtRVM5EVJCqcenWqnjdaN1ZWwqii6Lp8eVfe-tZecoujV_I-d' } )
}

index.handler(event)
    .catch(err => console.log(err))
    .then(res => console.log(res));