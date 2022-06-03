const { urlencoded } = require('express');
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const { default: mongoose } = require('mongoose');
const app = express();
const indexRoute = require('./routes/index')
const userRoute = require('./routes/users')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Passport Config
require('./config/passport')(passport);

// Connect To Mongo
mongoose.connect(process.env.MongoURI, { useNewUrlParser: true})
    .then( () => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// EJS 
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash())

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next();
})


// Routes
app.use('/', indexRoute);
app.use('/users', userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started on port 5000'));