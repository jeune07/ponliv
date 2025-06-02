const express =require('express');
const app = express();
require('dotenv').config();
const userRoutes=require('./routes/userRoutes')
console.log(typeof userRoutes)
app.use(express.json());
app.use('/api/users', userRoutes);
module.exports=app


