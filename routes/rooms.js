const express = require('express')
const router = express.Router()

const {isLoggedIn, validateRoom, isAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const Room = require('../models/room')


router.get('/', catchAsync(async (req, res) => {
    const rooms = await Room.find({})
    res.render('rooms/index', { rooms })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('rooms/new')
})

router.post('/', isLoggedIn, validateRoom, catchAsync(async (req, res) => {
    const room = new Room(req.body.room);
    room.author = req.user._id
    await room.save()
    res.redirect(`/rooms/${room._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!room) {
        req.flash('error', 'Cannot find that room!')
        return res.redirect('/rooms')
    }
    res.render('rooms/show', { room })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
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

router.delete('/:id', isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    await Room.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted room')
    res.redirect('/rooms')
}))

module.exports = router