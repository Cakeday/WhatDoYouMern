const bcrypt = require('bcrypt')

module.exports = {
    hashPassword: async (req, res, next) => {
        try {
            const { password } = req.body
            // if statement should only get fire when user updates with an empty password 
            if (!password) return next()
            const hashedPassword = await bcrypt.hash(password, 10)
            req.body.password = hashedPassword
            next()
        } catch (error) {
            next(error)
        }
    },

    comparePasswords: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword)
    }
}