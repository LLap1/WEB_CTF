const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

function GenerateToken(username) {
    //resolves a jwt, and if an error occurs, rejects with the error response.
    return new Promise((resolve, _) => {
        try{
            token = jwt.sign({ 'username': username }, process.env.TOKEN_SECRET)
            resolve(token);
        }catch(e){
            reject(e);
        }
    })
};

//Middleware function. Gets a request with the authentication token. if the token is missing, it returns a 401 response to the client with a message. verifies the token and if it is invalid
// it returns a 401 response to the client, else it continues the flow of the code.
function VerifyToken(req, res, next) {
    const auth_cookie = req.cookies.auth
    if (auth_cookie) {
        try {
            res.locals.token = jwt.verify(auth_cookie, process.env.TOKEN_SECRET)
            next()
        } catch (e) {
            return res.status(401).send('Invalid Cookie!')
        }
    } else {
        return res.status(401).send('Missing auth cookie!')
    }


}

module.exports = {GenerateToken, VerifyToken }

