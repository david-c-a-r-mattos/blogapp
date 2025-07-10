const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('users');

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => 
    {
            try 
            {
                const user = await User.findOne({email: email});
                if(!user) 
                {
                    return done(null, false, {message: 'Essa conta não existe!'});
                }
                
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch) 
                {
                    return done(null, user);
                }
                else 
                {
                    return done(null, false, {message: 'Senha incorreta!'});
                }
            } 
            catch(error) 
            {
                return done(error);
            }
        })
    );
    passport.serializeUser((user, done) =>
    {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) =>
    {
        try 
        {
            const user = await User.findById(id);
            done(null, user);
        } 
        catch(error)
        {
            done(error, null);
        }
    });
}
