const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: async (req, res, next) => {
        try {
            let { password } = req.body
            console.log(password)
            password = await bcrypt.hash(password, 10)
            console.log(password)
            console.log(req.body.password)
            req.body.password = password
            next()
        } catch (error) {
            next(error)
        }
    },

    comparePasswords: async (req, res, next) => {
        try {
            
        } catch (error) {
            
        }
    }
}