const express = require('express')
const router = express.Router()

const rooms = require('../controllers/rooms')

const {isLoggedIn, validateRoom, isAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const Room = require('../models/room')


router.get('/', catchAsync(rooms.index))

router.get('/new', isLoggedIn, rooms.renderNewForm)

router.post('/', isLoggedIn, validateRoom, catchAsync(rooms.createRoom))

router.get('/:id', catchAsync(rooms.showRoom))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(rooms.renderEditForm))

router.put('/:id', isLoggedIn, validateRoom, catchAsync(rooms.updateRoom))

router.delete('/:id', isAuthor, catchAsync(rooms.deleteRoom))

module.exports = router
