module.exports = 
{
	admin: (req, res, next) =>
	{
		if(req.isAuthenticated() && req.user.admin == 1)
		{
			return next();
		}
		else
		{
			req.flash('error_msg', 'Você deve ter premissão para entrar aqui!');
			res.redirect('/');
		}
	}
}