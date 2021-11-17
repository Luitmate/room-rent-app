const express = require('express')
const router = express.Router({ mergeParams: true})

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const Room = require('../models/room')
const Review = require('../models/review')

const {reviewSchema} = require('../schemas')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next()
    }
}


router.post('/', validateReview, catchAsync(async(req, res) => {
    const room = await Room.findById(req.params.id)
    const review = new Review(req.body.review)
    room.reviews.push(review)
    await review.save()
    await room.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/rooms/${room._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params
    await Room.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Room.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/rooms/${id}`)
}))

module.exports = router