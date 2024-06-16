require('dotenv').config();
const express  = require("express");
const mongoose = require('mongoose');
const STATUS = require('./utils/HttpStatusText');
const coursesRouter = require('./routes/coursesRoutes');
const usersRouter = require('./routes/usersRouts');
const path = require("path");


const app = express();

const url = process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log("mongoDb connected successfully");
    
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || STATUS.error, message: error.message});
})

app.listen(process.env.PORT,()=>{
    console.log("app");
});
