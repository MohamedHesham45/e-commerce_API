require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require("express-async-errors");
const User = require("./models/users");
const usersRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const stripeRoute = require("./routes/stripe");
var cors = require('cors')
const loggerMiddleware = require('./middlewares/loggerMid');
const logger = require('./utils/loggerFun');
const CustomError = require('./utils/customError');

const PORT=3000;
const app = express();
app.use(express.json());
app.use(express.static("./public"));
app.use(loggerMiddleware);
app.use(cors())

app.use(usersRoute);
app.use(adminRoute);
app.use(productRoute);
app.use(categoryRoute);
app.use(stripeRoute)
app.use((req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${new Date().toISOString()} - Error: 404 not found this req`);
  res.status(404).json({ message: "Resource not found" });
});


app.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.url} - ${new Date().toISOString()} - Error: ${err.message}`);
    if (err instanceof CustomError) {
      console.log(err);
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
      app.listen(PORT,()=>{
        console.log("started with URL: http://localhost:3000/");
      })
     console.log("hi");
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
  // module.exports=app
  