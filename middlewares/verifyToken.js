const jwt = require('jsonwebtoken');
const STATUS = require('../utils/HttpStatusText');
const appErrors = require("../utils/Errors");

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader){
        const error = appErrors.create(401, STATUS.error, "token is require !!"); 
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try{
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    }catch(err){
        const error =  appErrors.create(401, STATUS.error, err.message);
        return next(error);
    }
}

module.exports = verifyToken;