const express = require('express')
const path = require('path')

const mongoose = require('mongoose')
const Room = require('./models/room')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/room-rent');
}

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/rooms', async (req, res) => {
    const rooms = await Room.find({})
    res.render('index', { rooms })
})


app.listen(3000, (req, res) => {
    console.log('Serving on port 3000')
})
