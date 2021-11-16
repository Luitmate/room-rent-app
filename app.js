const express = require('express')
const path = require('path')
const engine = require('ejs-mate')
const {roomSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')

const methodOverride = require('method-override')

const mongoose = require('mongoose')
const Room = require('./models/room')
const Review = require('./models/review')

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

const validateRoom = (req, res, next) => {
    const { error } = roomSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/rooms', catchAsync(async (req, res) => {
    const rooms = await Room.find({})
    res.render('rooms/index', { rooms })
}))

app.get('/rooms/new', (req, res) => {
    res.render('rooms/new')
})

app.post('/rooms', validateRoom, catchAsync(async (req, res) => {
    const room = new Room(req.body.room);
    await room.save()
    res.redirect(`/rooms/${room._id}`)
}))

app.get('/rooms/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id)
    res.render('rooms/show', { room })
}))

app.get('/rooms/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id)
    res.render('rooms/edit', { room })
}))

app.put('/rooms/:id', validateRoom, catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findByIdAndUpdate(id, {... req.body.room })
    res.redirect(`/rooms/${room._id}`)
}))

app.delete('/rooms/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Room.findByIdAndDelete(id)
    res.redirect('/rooms')
}))

app.post('/rooms/:id/reviews', catchAsync(async(req, res) => {
    const room = await Room.findById(req.params.id)
    const review = new Review(req.body.review)
    room.reviews.push(review)
    await review.save()
    await room.save()
    res.redirect(`/rooms/${room._id}`)
})) 

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
