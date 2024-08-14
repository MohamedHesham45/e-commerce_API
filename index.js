const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/product')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));


app.get('/', (req, res) => {
    res.send('API is working');
});
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
