/*const localStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('./../models/User');
const user = mongoose.model('users');
module.exports = async (passport) =>
{
	passport.use(new localStrategy({'usernameField': 'email'}, async (email, password, done) =>
	{
		try
		{
			user = await User.findOne({email: email}).lean();
			if(!user)
			{
				return done(null, false, {message: 'Essa conta não existe!'});
			}
			else
			{
				bcrypt.compare(password, user.password, (error, beats) =>
				{
					if(beats)
					{
						return done(null, user);
					}
					else
					{
						return done(null, false, {message: "Senha incorreta!"})
					}

				});
			}
		}
		catch(error)
		{
			req.flash('error_msg', "Erro na autenticação! "+error.message);
		}
	}))
	passport.serializeUser((user, done) =>
	{
		done(null, user.id);
	})
	passport.deserializeUser((id, done) =>
	{
		User.findById(id, (error, user) =>
		{
			done(error, user);
		})
	})
}*/
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
