const express = require('express');
const app = express();
const authRoutes = require('./routes/auth'); 
const sweetRoutes=require('./routes/sweets');
app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.use('/api/sweets',sweetRoutes);

module.exports=app;