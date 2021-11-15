class ExpressError extends Error {
    constructor(message, statusCode) {
        super()
        this.message = message
        this.status = statusCode
    }
}

<<<<<<< HEAD
module.exports = ExpressError
=======
module.exports = ExpressError
>>>>>>> d2fc601dfaea09d255c4e090e8609d47e80f91f3
