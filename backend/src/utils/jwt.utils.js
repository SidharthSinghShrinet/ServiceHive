const jwt = require('jsonwebtoken');

const generateJWTToken = (id) => {
    return jwt.sign({id},process.env.SECRET_kEY,{expiresIn:"1d"});
}

module.exports = generateJWTToken;