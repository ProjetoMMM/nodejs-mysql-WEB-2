const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

// Importando models
const Product = require('./models/Product')
const User = require('./models/User')

// Importando as routes
const authRoutes = require('./routes/authRoutes')
const productsRoutes = require('./routes/productsRoutes')

// Template Engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// Receber dados do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// Middleware para usar css
app.use(express.static('public'))

// Middleware para poder usar o session
app.use(
    session({
        name: 'session',
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions') // caminho para salvar usuarios em sessao
        }),
        cookie: {
            secure: false,
            maxAge: 30*24*60*60*1000,
            expires: new Date(Date.now() + 30*24*60*60*1000),
            httpOnly: true
        }
    })
)

// Usar flash messages
app.use(flash())

// Conseguir mandar dados da sessao de um user pro front
app.use((req, res, next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})

// Routes
app.use('/', authRoutes)
app.use('/products/', productsRoutes)

conn.sync().then(() => {
    app.listen(3000)
}).catch((err) => console.log(err))
