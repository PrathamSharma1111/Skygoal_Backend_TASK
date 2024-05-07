const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtTokens");
const crypto = require("crypto");

// Register a User:
exports.registerUser = catchAsyncErrors(async(req, res, next)=>{
    const {name, email, password, phoneNo, createdAt} = req.body;
    const user = await User.create({
        name, email, password, phoneNo, createdAt
        
    });

    sendToken(user,201,res);
    
});

// Login User:
exports.loginUser = catchAsyncErrors(async (req, res, next)=>{

    const {email, password} = req.body;
    
    // checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password", 400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user,200,res);

});

// Logout user:
exports.logout = catchAsyncErrors(async(req,res, next)=>{

    res.cookie("token", null,{
        expires:new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success:true,
        message:"Logged out",
    });
});


// Get User Details: 
exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});



// Update user profile: 
exports.updateProfile = catchAsyncErrors(async(req, res, next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        phoneNo:req.body.phoneNo,
    }

    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});
