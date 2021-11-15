const express = require('express')
const path = require('path')

const mongoose = require('mongoose')
const Room = require('./models/room')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/room-rent');
}

const app = express()

// EJS CONFIG
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// BODY PARSER
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/rooms', async (req, res) => {
    const rooms = await Room.find({})
    res.render('rooms/index', { rooms })
})

app.get('/rooms/new', (req, res) => {
    res.render('rooms/new')
})

app.post('/rooms', async (req, res) => {
    const room = new Room(req.body.room);
    await room.save()
    res.redirect(`/rooms/${room._id}`)
})

app.get('/rooms/:id', async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id)
    res.render('rooms/show', { room })
})




app.listen(3000, (req, res) => {
    console.log('Serving on port 3000')
})
