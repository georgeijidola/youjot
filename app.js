const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express()

// Load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport Congig
require('./config/passport')(passport)

// Connect to mongoose
mongoose.connect('mongodb://localhost/youjot-dev', {
    useNewUrlParser: true
})
.then(()=> console.log('Mongodb connected...'))
.catch(err => console.log(err))

// Handlebars Middleware
// app.engine('.hbs', exphbs({
//     defaultLayout: 'main',
//     extname: '.hbs'
// }))
// app.set('view engine', '.hbs')

app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}))
app.set('view engine', '.hbs')

// Parse Express static middleware
app.use(express.static(__dirname + '/public'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

// Parse method-override
app.use(methodOverride('_method'))

// Parse Connect Flash
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Parse Express-session
app.use(flash())

// Global variables
app.use( (req, res, next) => {
    res.locals.successMsg = req.flash('successMsg')
    res.locals.errorMsg = req.flash('errorMsg')
    next()
})

// Index Route
app.get('/', (req, res) => {
    res.render('index')
})

// About Route
app.get('/about', (req, res) => {
    res.render('about')
})

// Use Idea routes
app.use('/ideas', ideas)

// Use User routes
app.use('/users', users)

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})