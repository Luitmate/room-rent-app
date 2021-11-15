module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d2fc601dfaea09d255c4e090e8609d47e80f91f3
