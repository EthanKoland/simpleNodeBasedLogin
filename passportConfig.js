const passport = require('passport');
const bcrypt = require('bcrypt');

const localStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser =  async (email, password, done) => {
        const user = getUserByEmail(email);
        //Check if the user exists
        if(user == null){
            //No error, no user, message
            return done(null, false, {message: 'No user with that email'});
        }

        try{
            //Check if the password matches the hashed password
            if(await bcrypt.compare(password, user.password)){
                //No error, user
                //found user
                return done(null, user);
            } else {
                //No error, no user, message
                //Passwords did not match
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch(e){
            //Error
            return done(e);
        }
    }
    passport.use(new localStrategy({usernameField: 'email'}, authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

//Call the function extenrally
module.exports = initialize;