const express  = require("express");
const userController = require('../controllers/usersControllers');
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");

const imageUpload = require('../utils/imageUpload');


const router =  express.Router()

router.route('/')
            .get(verifyToken, allowedTo(userRoles.MANGER, userRoles.ADMIN), userController.getAllUsers);

router.route('/register')
            .post(imageUpload.upload.single('avatar'), userController.register); 

router.route('/login')
            .post(userController.login);


module.exports = router