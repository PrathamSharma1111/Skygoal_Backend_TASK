const express = require('express');
const app = express();
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());


// Route imports: 
const user = require("./routes/userRoute");

app.use("/api/v1", user);


// Middleware for error:
app.use(errorMiddleware);


module.exports = app;