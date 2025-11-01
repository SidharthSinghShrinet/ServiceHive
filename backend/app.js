require('dotenv').config();
let express = require('express');
let cors =  require('cors');
let app = express();
let cookieParser = require('cookie-parser');
let userRoutes = require('./src/routes/user.routes');
let eventRoutes = require('./src/routes/event.routes');
let swapRequestRoutes = require('./src/routes/swapRequest.routes');
let error = require("./src/middlewares/error.middleware");


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true,
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/swap', swapRequestRoutes);
app.use(error);

module.exports = app;