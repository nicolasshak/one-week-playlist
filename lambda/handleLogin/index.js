/*
 * Get access token and refresh token
 * Get user creds
 * If in db, set access token
 * If not, add user to db
 * Return access token
 */

const SpotifyWebApi = require('spotify-web-api-node');
const AWS = require('aws-sdk');
const rds = new AWS.RDSDataService();

exports.handler = async (event) => {

    // Probably unsafe to use lambda proxy for public api
    const { code } = JSON.parse(event.body);

    let spotifyApi = new SpotifyWebApi({
        clientId: 'c3afb837e40041e9ad1e7a35d200f0b1',
        clientSecret: '7abda0af6a3042bdb773e963b33c63f5',
        redirectUri: 'http://localhost:8000/submit'
    });

    // Is it bad to use async callback for promsie?
    const promise = new Promise(async (resolve, reject) => {

        let { refreshToken, accessToken } =  await spotifyApi.authorizationCodeGrant(code).then(data => ({ refreshToken: data.body['refresh_token'], accessToken: data.body['access_token']}) );
        resolve(accessToken);
    });

    return promise;
};
