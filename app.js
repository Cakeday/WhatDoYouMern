const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
dotenv.config()

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => console.log('DB connected'))

mongoose.connection.on('error', (err) => {
    console.log(`DB connection error: ${err.message}`)
});

const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(expressValidator())

app.use('/', postRoutes)
app.use('/', authRoutes)

const port = process.env.PORT || 8000
app.listen(8000)