const express = require('express')
const router = express.Router()

const rooms = require('../controllers/rooms')

const {isLoggedIn, validateRoom, isAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const Room = require('../models/room')


router.route('/')
    .get(catchAsync(rooms.index))
    .post(isLoggedIn, validateRoom, catchAsync(rooms.createRoom))

router.get('/new', isLoggedIn, rooms.renderNewForm)

router.route('/:id')
    .get(catchAsync(rooms.showRoom))
    .put(isLoggedIn, validateRoom, catchAsync(rooms.updateRoom))
    .delete(isAuthor, catchAsync(rooms.deleteRoom))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(rooms.renderEditForm))

module.exports = router
