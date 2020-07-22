const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const multer = require('multer')
const expressValidator = require('express-validator')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
dotenv.config()

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => console.log('DB connected'))

mongoose.connection.on('error', (err) => {
    console.log(`DB connection error: ${err.message}`)
});

const myFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("destination() func got invoked")
        cb(null, "./imageFolder")
    }, 
    
    filename: (req, file, cb) => {
        console.log("filename() func got invoked")
        cb(null, new Date().toISOString().replace(/:/g, '-')+"_"+file.originalname)
    } 
})

const myFileFilter = (req, file, cb) => {

    if ( file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        console.log("valid image uploaded successfully")
        cb(null, true)
    } 
    else {
        console.log("invalid image uploaded ! Not accepted")
        cb(null, false) 
    }
  }





const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data)
        res.json(docs)
    })
})

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(multer({storage: myFileStorage , fileFilter: myFileFilter }).single('image'))
app.use(expressValidator())
app.use(cors())

const dir = path.join(__dirname + '/imageFolder')
console.log(dir)
app.use(express.static(dir))

app.use('/', postRoutes)
app.use('/', authRoutes)
app.use('/', userRoutes)

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({error: "Unauthorized; You need to sign in first"})
    }
})

const port = process.env.PORT || 8000
app.listen(8000)