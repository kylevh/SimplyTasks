const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const Note = require('./models/notebase')
const methodOverride = require('method-override')
const {noteSchema} = require('./schemas.js')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const usersRoutes = require('./routes/users')
const notesRoutes = require('./routes/notes');
require('dotenv').config();

const MongoStore = require("connect-mongo");
dbURL = process.env.db_URL;
//'mongodb+srv://admin:27YiWAySg10odmnc@cluster0.qaw6u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//'mongodb://localhost:27017/note-taker'
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database successfully connected!")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// app.use(mongoSanitize);

const secret = process.env.SECRET || "devKey";

const store = MongoStore.create({
    mongoUrl: dbURL,
    secret: secret,
    touchAfter: 24 * 60 * 60,
})

store.on("error", function () {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'taskr',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true, WHEN DEPLOYED
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const validateNote = (request, response, next) => {
    const {error} = noteSchema.validate(request.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

app.use((request, response, next) => {

    response.locals.currentUser = request.user;
    response.locals.success = request.flash('success');
    response.locals.error = request.flash('error');
    next();
})


app.use('/', usersRoutes);
app.use('/notes', notesRoutes);


app.get('/', (request, response) => {
    response.render('home');
})

app.all('*', (request, response, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((error, request, response, next) => {
    const {statusCode = 500 } = error;
    if(!error.message) error.message = 'Something went wrong!';
    response.status(statusCode).render('error', {error})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`LISTENING ON : ${port}`);
})