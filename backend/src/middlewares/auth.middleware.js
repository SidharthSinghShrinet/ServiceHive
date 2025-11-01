const ErrorHandler = require('../utils/ErrorHandler.utils');
const jwt = require('jsonwebtoken');
const userCollection = require("../models/user.model");

const authenticate = async(req,res,next) => {
    let token = req.cookies.token;
    if(!token){
        throw new ErrorHandler(401,"Please Login!");
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
    if(!decodedToken){
        throw new ErrorHandler(401,"Invalid Token! Please Login Again.");
    }
    let user = await userCollection.findOne({_id:decodedToken.id});
    if(!user){
        throw new ErrorHandler(401,"User Not Found! Please Signup.");
    }
    req.user = user;
    next();
}

module.exports =authenticate;