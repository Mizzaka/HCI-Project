require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoute');

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

mongoose.connect(process.env.DB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log("connected to db and listening on port: " , process.env.PORT))
    })
    .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);