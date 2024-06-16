let Course = require('../models/courses_models');
const {validationResult} = require('express-validator');
const STATUS = require('../utils/HttpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appErrors = require("../utils/Errors");

const getAllCourses = async (req,res)=>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const courses = await Course.find({}, {"__v": false}).limit(limit).skip((page-1) * limit);
    res.json({status: STATUS.success, data: {courses}});
}
const getSingleCourse = asyncWrapper(
    async (req, res, next)=>{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error =  appErrors.create(404, STATUS.fail, "course not found");
            return next(error);
        }
        res.json({status: STATUS.success, data: {course}});
    }
);
const addCourse = asyncWrapper(
    async (req, res, next)=>{
    const errors = validationResult(req);
        if(errors.isEmpty()){
            const newCourse = new Course(req.body);
            await newCourse.save();
            return res.status(201).json({status: STATUS.success, data: {newCourse}});
        }
        const error = appErrors.create(400, STATUS.fail, errors.array());
        next(error);
        //res.status(400).json({status: STATUS.fail, data: errors.array()});
    }
)
const updateCourse = asyncWrapper(
    async (req, res, next)=>{
        const course = await Course.updateOne({_id: req.params.id}, {$set : {...req.body}});
        if(!course){
            const error =  appErrors.create(404, STATUS.fail, "course not found");
            return next(error);
        }
        res.status(201).json({status: STATUS.success, data: course});
    }
);
const deleteCourse = async(req,res)=>{
    await Course.deleteOne({_id: req.params.id});
    res.status(200).json({status: STATUS.success, data: null});
}

module.exports = {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
}