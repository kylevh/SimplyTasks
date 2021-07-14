const Note = require('../models/notebase');


module.exports.index = async (request, response) => {
    const tempNotes = await Note.find({author: request.user._id});
    response.render('notes/index.ejs', { tempNotes });
}

module.exports.renderNewForm = (request, response) => {
    response.render('notes/new')
}

module.exports.createNote = async (request, response, next) => {
    const note = new Note(request.body.note);
    note.author = request.user._id;
    await note.save();
    request.flash('success', 'Successfully made a new task')
    response.redirect(`/notes/${note._id}`);
}

module.exports.showNote = async (request, response) => {
    const { id } = request.params;
    const tempNote = await (await Note.findById(request.params.id).populate('author'));
    if(!tempNote){
        request.flash('error', 'Task does not exist!')
        response.redirect('/notes')
    }
    if (!tempNote.author.equals(request.user._id)) {
        request.flash('error', 'You do not have permission');
        return response.redirect(`/notes`);
    }
    response.render('notes/show', { tempNote });
}

module.exports.renderEditForm = async (request, response) => {
    const {id} = request.params;
    const tempNote = await Note.findById(id)
    if(!tempNote) {
        request.flash('error', 'Cannot find that task!')
        return response.redirect('/notes');
    }
    response.render('notes/edit', { tempNote });
}

module.exports.updateNote = async (request, response) => {
    const { id } = request.params;
    const note = await Note.findByIdAndUpdate(id, { ...request.body.note });
    request.flash('success', 'Successfully updated task!')
    response.redirect(`/notes/${note._id}`);
}

module.exports.destroyNote = async (request, response) => {
    const { id } = request.params;
    await Note.findByIdAndDelete(id);
    request.flash('success', 'Deleted task!')
    response.redirect('/notes');
}