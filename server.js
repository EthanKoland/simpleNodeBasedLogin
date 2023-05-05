//indev
if(process.env.NODE_ENV !== 'production'){
    //load in the env variables
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passportConfig');
initializePassport(passport, 
    email => { users.find(user => user.email === email)},
    id => { users.find(user => user.id === id)}
    );


app.set('view engine', 'ejs');
//take the forms and access them inside the req.body. The name field in the form matches the name field in the req.body
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(flash());
//Dont resave if nothing has changed, dont save if there is nothing to save
app.use(session({secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());
//Note that the users are not stored in a database, but in an array. This is not a good practice, but it is done for simplicity
const users = [];



app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    //show a message if there is an error
    failureFlash: true
}))   



app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
    
})
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
        //10 is the number of rounds of hashing, good default is 10
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Connect to the database 
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //redirect to the login page to allow the users to login
        res.redirect('/login')
    } catch {
        //allow the users to try again if there is an error
        res.redirect('/register')
    }

})

app.delete('/logout', (req, res) => {
    //logout is a function that is added to the req object by passport
    req.logOut();
    res.redirect('/login');
})

//middleware to check if the user is authenticated
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Redirect to the login page if the user is not authenticated
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        //Redirect to the home page if the user is authenticated
        return res.redirect('/');
    }
    next();
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});