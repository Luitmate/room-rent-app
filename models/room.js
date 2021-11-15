const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RoomSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String
})

module.exports = mongoose.model('Room', RoomSchema)