const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const router = require('./routes/routes')
const port = process.env.PORT

require('dotenv').config()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            url: process.env.MONGODB_URI,
            mongooseConnection: mongoose.connection,
            autoReconnect: true
        }),
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
)
// app.use((req, res, next) => {
//     res.locals.user = req.user
//     next()
// })
app.use('/', router)

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected')
}).catch(err => {
    console.log(`MongoDB Error: ${err}`)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})