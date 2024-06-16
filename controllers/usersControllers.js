let User = require('../models/users_models');
const asyncWrapper = require('../middlewares/asyncWrapper');
const STATUS = require('../utils/HttpStatusText');
const appErrors = require('../utils/Errors');
const bycrpt = require('bcryptjs');
const generateJwt = require('../utils/jwtGenerator');


const getAllUsers = async (req,res)=>{
    const query = req.query;
    const limit = query.limit || 100;
    const page = query.page || 1;
    const users = await User.find({}, {"__v": false, "password": false}).limit(limit).skip((page-1) * limit);
    res.json({status: STATUS.success, data: {users}});
}

const register = asyncWrapper(async (req, res, next)=>{
    const {firstName, lastName, email, password, role, avatar} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        const hashedpasseord = await bycrpt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedpasseord,
            role,
            avatar: req.file.filename
        });
        const token = await generateJwt({email: newUser.email, id: newUser.id, role: newUser.role});
        newUser.token = token;
        await newUser.save();
        return res.status(201).json({status: STATUS.success, data: {newUser}});
    }
    const error = appErrors.create(400, STATUS.fail, 'this email is already exist');
    return next(error);
});


const login = asyncWrapper(async (req, res, next)=>{
    const {email, password} = req.body;
    if(!email || ! password){
        const error = appErrors.create(400, STATUS.fail, "Email and Password are required");
        return next(error);
    }
    const user = await User.findOne({email: email});
    if(!user){
        const error = appErrors.create(400, STATUS.fail, "this user is not exist");
        return next(error);
    }
    const matchedPassword = await bycrpt.compare(password, user.password);
    if(!matchedPassword){
        const error =  appErrors.create(400, STATUS.fail, `Password is not correct !! is that you ${user.firstName} ??`);
        return next(error);
    }
    const token = await generateJwt({email: user.email, id: user.id, role: user.role});
    const updatedToken = await User.updateOne({_id: user.id},{$set:{token: token}});
    return res.status(200).json({status: STATUS.success, data:{token}});
})



module.exports = {
    getAllUsers,
    register,
    login
}