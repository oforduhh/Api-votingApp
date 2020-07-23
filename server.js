const express = require('express');
// require('./src/db/database');
require('dotenv').config();
const connectDB = require('./src/database/mongoose');
const userRouter = require('./src/routes/user');
const adminRouter = require('./src/routes/admin');


// Initializing Express Framework
const app = express();

// Connecting DB
connectDB();

// Defining Port
const port = process.env.PORT;

app.use(express.json());

// My Routers
app.use(userRouter);
app.use(adminRouter);





app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

