const {noteSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Note = require('./models/notebase')


module.exports.isLoggedIn = isLoggedIn = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.session.returnTo = request.originalUrl;
        request.flash('error', 'Must be signed in')
        return response.redirect('/login')
    }
    next();
}

module.exports.validateNote = (request, response, next) => {
    const {error} = noteSchema.validate(request.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(request, response, next) => {
    const {id} = request.params;
    const note = await Note.findById(id);
    if (!note.author.equals(request.user._id)) {
        request.flash('error', 'You do not have permission to do that!');
        return response.redirect(`/notes/${id}`);
    }
    next();
}