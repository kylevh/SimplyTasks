const Joi = require('joi');


module.exports.noteSchema = Joi.object({
    note: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional().allow(''),
        dueDate: Joi.date().optional().allow('')
    })
});