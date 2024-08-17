const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// var morgan = require('morgan')
require("express-async-errors");
const usersRoute = require("./routes/user");
const postRoute=require('./routes/posts')
const CustomError = require('./utils/customError');
const User = require("./models/users");
// const loggerMiddleware = require('./middlewares/loggerMid');
// const logger = require('./utils/loggerFun');






const app = express();
app.use(express.json());
// app.use(loggerMiddleware);
// app.use(morgan('dev'))

app.use(usersRoute);
app.use('/posts',postRoute);


app.use((err, req, res, next) => {
  // logger.error(`${req.method} ${req.url} - ${new Date().toISOString()} - Error: ${err.message}`);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


mongoose.connect(process.env.DB_URL)
  .then(async () => {

    try {
      const { ADMIN, ADMIN_PASS } = process.env;
      const existingAdmin = await User.findOne({ email: ADMIN });
      if (!existingAdmin) {
        const admin = new User({
          email: ADMIN,
          password:ADMIN_PASS,
          role: 'admin',
        });
        await admin.save();
      }
    app.listen(3000,()=>{
      console.log("hi");
      
    })
    } catch (error) {
  logger.error(` ${new Date().toISOString()} - Error: ${error.message}`);

      console.error('Error during database initialization:', error);
      process.exit(1);
    }
  })
  .catch(error => {
  logger.error(` ${new Date().toISOString()} - Error: ${error.message}`);

    console.error('Database connection error:', error);
    process.exit(1);
  });
