const express = require("express");
const app =  express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser  = require("body-parser");
const connectionDB = require("../config/database");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const User = require("../src/routes/userRoutes");
const Task = require("../src/routes/taskRoutes");
const { createAdmin } = require("./controller/userController");

dotenv.config();

app.use(cors()) ;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(errorHandler);


connectionDB();
createAdmin(); 

//Default route
app.get('/' , (req,res)=>{
    res.send("Application is currently working !")
});

app.use("/users", User);
app.use("/task", Task);

module.exports = app;
