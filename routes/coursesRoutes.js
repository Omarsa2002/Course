const express  = require("express");
const { validatorSchema } = require('../middlewares/validationSchema');
const coursesController = require('../controllers/coursesControllers');
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

const router =  express.Router()

router.route('/')
            .get(coursesController.getAllCourses)
            .post(verifyToken, allowedTo(userRoles.MANGER, userRoles.ADMIN), validatorSchema(), coursesController.addCourse);
router.route('/:id')
            .get(verifyToken, allowedTo(userRoles.MANGER, userRoles.ADMIN), coursesController.getSingleCourse)
            .patch(verifyToken, allowedTo(userRoles.MANGER, userRoles.ADMIN), coursesController.updateCourse)
            .delete(verifyToken, allowedTo(userRoles.MANGER, userRoles.ADMIN), coursesController.deleteCourse);  


module.exports = router