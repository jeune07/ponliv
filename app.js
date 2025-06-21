const express =require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const userRoutes=require('./routes/userRoutes')
app.use(cors({
  origin: 'https://ponliv.onrender.com', // or wherever Swagger UI runs
  credentials: true
}));
console.log(typeof userRoutes)
app.use(express.json());
app.use('/api', userRoutes);
module.exports=app


