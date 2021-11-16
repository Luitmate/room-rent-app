const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const engine = require('ejs-mate')

const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')

//ROUTES
const rooms = require('./routes/rooms')
const reviews = require('./routes/reviews')


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


app.use('/rooms', rooms)
app.use('/rooms/:id/reviews', reviews)

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
