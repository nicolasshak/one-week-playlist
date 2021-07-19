//get access token
//get user info
//add user to db
//  if user exists, use that info instead
//add playlist to db
exports.handler = async (event) => {
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
