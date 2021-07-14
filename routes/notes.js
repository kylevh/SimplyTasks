const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const notes = require('../controllers/notes')
const Note = require('../models/notebase');
const { isLoggedIn, isAuthor, validateNote } = require('../middleware')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


router.route('/')
    .get(isLoggedIn, catchAsync(notes.index)) //View notes
    .post(validateNote, catchAsync(notes.createNote)) //Create new note

router.get('/new', isLoggedIn, notes.renderNewForm)     //View new note form

router.route('/:id')
    .get(isLoggedIn, catchAsync(notes.showNote))    //View specific note
    .put(isLoggedIn, isAuthor, catchAsync(notes.updateNote))    //Update edit note
    .delete(catchAsync(notes.destroyNote))    //Delete note

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(notes.renderEditForm))    //View edit note form



module.exports = router;