const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    location: String,
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

RoomSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Room', RoomSchema)