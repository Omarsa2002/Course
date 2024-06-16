const appErrors = require("../utils/Errors");
const STATUS = require("../utils/HttpStatusText");
module.exports = (...roles)=>{
    return (req, res, next) =>{
        if(!roles.includes(req.currentUser.role)){
            return next(appErrors.create(401, STATUS.fail, "You are not allowed to do that"));
        }
        next();
    }
}