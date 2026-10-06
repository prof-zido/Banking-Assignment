const express = require('express');
const connectDB = require('./Config/databaseConfig');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
connectDB();

app.use(express.json());

const userRoutes = require('./Routes/UserRoute');
const accountRoutes = require('./Routes/AccountRoute');


app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
}); 