let index = require('./index.js');

let event = {
    body: JSON.stringify( { code: 'AQCwIwV5xntHBecJ34Xg_RhjVqWYLhG1frgG-UKPyDF4t0wqFXWoNciguQsF6cER6mUVbBby8kE1rngTxEAIhfY0pBgNpVZJoQnD06DdGqTYV32BA82x7abQB59e18uSCqFqxDrYDGbX81I5Z1k6_tUYTRm2Y21Og6DsJi5Y89Y' } )
}

index.handler(event).then(res => console.log(res));