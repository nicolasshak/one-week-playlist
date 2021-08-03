const SpotifyWebApi = require('spotify-web-api-node');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});``
const rdsDataService = new AWS.RDSDataService();

exports.handler = async (event) => {

    let { code } = JSON.parse(event.body);

    let spotifyApi = new SpotifyWebApi({
        clientId: 'c3afb837e40041e9ad1e7a35d200f0b1',
        clientSecret: '7abda0af6a3042bdb773e963b33c63f5',
        redirectUri: 'http://localhost:8000/submit'
    });

    let sqlParams = {
        secretArn: 'arn:aws:secretsmanager:us-east-1:174459398466:secret:OneWeekPlaylist/MySQL-sY9GKa',
        resourceArn: 'arn:aws:rds:us-east-1:174459398466:cluster:one-week-playlist',
        sql: 'SELECT * FROM Users;',
        //sql: 'INSERT INTO Users (userId, refreshToken, displayName) VALUES ("Test ID", "testToken", "testDisplayName")',
        database: 'oneWeekPlaylist',
        includeResultMetadata: true
    }

    const promise = new Promise(async (resolve, reject) => {

        await spotifyApi.authorizationCodeGrant(code)
            .then(data => {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
            })
            .catch(err => reject(err));

        let { display_name: displayName, id: userId } = await spotifyApi.getMe()
            .then(data => data.body)
            .catch(err => reject(err));

        sqlParams.sql = `
            INSERT INTO Users (displayName, refreshToken, userId)
            VALUES ("${displayName}", "${spotifyApi.getRefreshToken()}", "${userId}")
            ON DUPLICATE KEY UPDATE refreshToken="${spotifyApi.getRefreshToken()}";
        `;

        let insertRes = await new Promise((resolve, reject) => {

            rdsDataService.executeStatement(sqlParams, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        sqlParams.sql = `
            SELECT COUNT(userId) FROM Playlists WHERE userId="${userId}";
        `;

        let selectRes = await new Promise((resolve, reject) => {

            rdsDataService.executeStatement(sqlParams, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        resolve({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            //body: JSON.stringify({ insertRes, selectRes })
            body: JSON.stringify('Test!')
        });
    });

    return promise;
};
