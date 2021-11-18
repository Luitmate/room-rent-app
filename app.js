const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const engine = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')

//ROUTES
const roomsRoutes = require('./routes/rooms')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/room-rent');
}

const app = express()

// EJS-MATE CONFIG
app.engine('ejs', engine)
// EJS CONFIG
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

//METHOD OVERRIDE
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// PASSPORT CONFIG
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/rooms', roomsRoutes)
app.use('/rooms/:id/reviews', reviewsRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if(!err.message) {
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error', { err })
})


app.listen(3000, (req, res) => {
    console.log('Serving on port 3000')
})
