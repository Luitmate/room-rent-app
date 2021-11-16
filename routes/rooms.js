const express = require('express')
const router = express.Router()
const {roomSchema} = require('../schemas')

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const Room = require('../models/room')

const validateRoom = (req, res, next) => {
    const { error } = roomSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const rooms = await Room.find({})
    res.render('rooms/index', { rooms })
}))

router.get('/new', (req, res) => {
    res.render('rooms/new')
})

router.post('/', validateRoom, catchAsync(async (req, res) => {
    const room = new Room(req.body.room);
    await room.save()
    res.redirect(`/rooms/${room._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id).populate('reviews')
    res.render('rooms/show', { room })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id)
    res.render('rooms/edit', { room })
}))

router.put('/:id', validateRoom, catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findByIdAndUpdate(id, {... req.body.room })
    res.redirect(`/rooms/${room._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Room.findByIdAndDelete(id)
    res.redirect('/rooms')
}))

module.exports = router