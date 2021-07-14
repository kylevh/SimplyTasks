const User = require('../models/user')


module.exports.renderRegister = (request, response) => {
    response.render('users/register')
}

module.exports.register = async (request, response) => {
    try {
        const { email, username, password } = request.body
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        request.login(registeredUser, error => {
            if (error) return next(error);
            request.flash('success', 'Welcome to SimpleTasks!');
            response.redirect('/notes');
        });
    } catch (e) {
        request.flash('error', e.message)
        response.redirect('register')
    }
}

module.exports.renderLogin = (request, response) => {
    response.render('users/login')
}

module.exports.login = (request, response) => {
    request.flash('success', 'Welcome back!')
    const redirectUrl = request.session.returnTo || '/notes';
    delete request.session.returnTo;
    response.redirect(redirectUrl);
}

module.exports.logout = (request, response) => {
    request.logout();
    request.flash('success', 'You have been logged out')
    response.redirect('/')
}

module.exports.viewProfile = (request, response) => {
    response.render('users/profile')
}