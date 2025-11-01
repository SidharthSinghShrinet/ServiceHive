const userCollection = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");
const ApiResponse = require("../utils/ApiResponse.utils");
const ErrorHandler = require("../utils/ErrorHandler.utils");
const generateJWTToken = require("../utils/jwt.utils");

// Get all users
const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
    const userExists = await userCollection.findOne({ email });
    if (userExists) {
      throw new ErrorHandler(400, "User already exists with this email");
    }
    const user = await userCollection.create({ username, email, password });
    new ApiResponse(201,true,"User registered successfully",user).send(res);
});

// Logged in user
const loginUser = expressAsyncHandler(async(req,res,next)=>{
  const {email,password} = req.body;
  const existingUser = await userCollection.findOne({email});
  if(!existingUser) throw new ErrorHandler(404,"User not found with this email");
  const isMatched = await existingUser.comparePassword(password);
  if(!isMatched) throw new ErrorHandler(401,"Invalid credentials");
  let token = generateJWTToken(existingUser._id);
  if(!token) throw new ErrorHandler(500,"Could not generate token");
  res.cookie("token",token,{
    maxAge:24*60*60*1000,
    secure:true,
    httpOnly:true,
  })
  new ApiResponse(200,true,"User logged in successfully",existingUser,token).send(res);
})

// logout user
const logoutUser = expressAsyncHandler(async(req,res,next)=>{
  res.clearCookie("token")
  new ApiResponse(200,true,"User logged out successfully").send(res);
});

const getProfile = expressAsyncHandler(async(req,res,next)=>{
  let userId = req.user._id;
  let user = await userCollection.findById(userId);
  if(!user) throw new ErrorHandler(404,"User not found");
  new ApiResponse(200,true,"User found successfully",user).send(res);
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile
};
