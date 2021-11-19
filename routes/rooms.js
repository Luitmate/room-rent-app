const express = require('express')
const router = express.Router()

const rooms = require('../controllers/rooms')

const {isLoggedIn, validateRoom, isAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')
const Room = require('../models/room')

const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(rooms.index))
    // .post(isLoggedIn, validateRoom, catchAsync(rooms.createRoom))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send('look the console')
    }) 

router.get('/new', isLoggedIn, rooms.renderNewForm)

router.route('/:id')
    .get(catchAsync(rooms.showRoom))
    .put(isLoggedIn, validateRoom, catchAsync(rooms.updateRoom))
    .delete(isAuthor, catchAsync(rooms.deleteRoom))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(rooms.renderEditForm))

module.exports = router
