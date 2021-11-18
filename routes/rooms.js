const express = require('express')
const router = express.Router()
const {roomSchema} = require('../schemas')
const {isLoggedIn} = require('../middleware')

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

router.get('/new', isLoggedIn, (req, res) => {
    res.render('rooms/new')
})

router.post('/', isLoggedIn, validateRoom, catchAsync(async (req, res) => {
    const room = new Room(req.body.room);
    await room.save()
    res.redirect(`/rooms/${room._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id).populate('reviews')
    if(!room) {
        req.flash('error', 'Cannot find that room!')
        return res.redirect('/rooms')
    }
    res.render('rooms/show', { room })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id)
    if(!room) {
        req.flash('error', 'Cannot find that room!')
        return res.redirect('/rooms')
    }
    res.render('rooms/edit', { room })
}))

router.put('/:id', isLoggedIn, validateRoom, catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findByIdAndUpdate(id, {... req.body.room })
    req.flash('success', 'Successfully updated room')
    res.redirect(`/rooms/${room._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Room.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted room')
    res.redirect('/rooms')
}))

module.exports = router