const SpotifyWebApi = require('spotify-web-api-node');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'dynamodb.us-east-1.amazonaws.com'
});
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {

    let { code } = JSON.parse(event.body);

    let spotifyApi = new SpotifyWebApi();

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

        let getParams = {
            TableName: "OneWeekPlaylist",
            Key: {
                "userId": {
                    S: "nicolasshak"
                }
            },
            UpdateExpression: "SET refreshToken = :refreshToken, accessToken = :accessToken",
            ExpressionAttributeValues: {
                ":refreshToken": { S: "test" },
                ":accessToken": { S: "test2" }
            },
            ReturnValues: "ALL_NEW"
        }

        let one = await new Promise((resolve, reject) => {
            dynamodb.updateItem(getParams, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            });
        });

        if(one['Attributes']['playlists'].length > 9) {
            reject('Max 10 playlists per user!');
        }

        let promiseCreatePlaylist = spotify.createPlaylst('One Week Playlist');

        let promiseCreateOverflow = spotify.createPlaylist('Overflow');

        let [playlistId, overflowId] = await Promise.all([promiseCreatePlaylist, promiseCreateOverflow]);

        console.log({playlistId, overflowId});

        let params = {
            TableName: "OneWeekPlaylist",
            Key: {
                "userId": {
                    S: "nicolasshak"
                }
            },
            UpdateExpression: "SET playlists = list_append(if_not_exists(playlists, :emptyList), :p)",
            //ConditionExpression: "size(playlists) <= :max OR attribute_not_exists(playlists)",
            ExpressionAttributeValues: {
                ":p": {
                    L: [
                        {
                            M: {
                                "playlistUri": { S: "test" },
                                "overflowUri": { S: "test3" },
                                "period": { N: "7" }
                            }
                        }
                    ]
                },
                ":emptyList": {
                    L: []
                },
                // ":max": {
                //     N: "10"
                // }
            },
            ReturnValues: "ALL_NEW"
        }

        let two = await new Promise((resolve, reject) => {
            dynamodb.updateItem(params, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            });
        });

        resolve({
            one,
            two
        });
    });

    return await promise.catch(err => {
        return {
            statusCode: 400,
            eaders: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(err)
        }
    }).then(res => {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(res)
        }
    });
};
