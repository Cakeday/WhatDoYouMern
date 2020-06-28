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
        const potentialMatch = await bcrypt.compare(password, hashedPassword)
        if (!potentialMatch) throw new Error("Incorrect password")
        return potentialMatch
    }
}