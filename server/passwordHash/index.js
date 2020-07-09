const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: async (req, res, next) => {
        try {
            let { password } = req.body
            password = await bcrypt.hash(password, 10)
            req.body.password = password
            next()
        } catch (error) {
            next(error)
        }
    },

    comparePasswords: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword)
    }
}