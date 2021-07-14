const mongoose = require('mongoose')
const Note = require('../models/notebase')

mongoose.connect('mongodb://localhost:27017/note-taker', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database successfully connected!")
});

const seedDB = async () => { //Delete everything from database and apply seed data
    await Note.deleteMany({});
    for (let i = 1; i < 10; i++) {
        const n = new Note({
            author: '60bad62871f3db26bca5fb3f',
            title: `${i} is my favorite number`,
            description: `yep, ${i} really is my favorite number in the whole wide world`,
            dueDate: new Date()
        });
        await n.save();
    }
}

seedDB().then(() => {
    console.log("Database updated! Now closing...")
    mongoose.connection.close();
});