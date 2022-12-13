const express = require('express')
const morgan = require('morgan')
const router = require('./routes/index.routes')
const path = require('path')
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

//inicializadores
const app = express()
const PORT = 4000

//BBDD
require('./config/database')

//SETTINGS  
app.set("views", path.join(__dirname, "views"))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
    //helpers: require("./lib/handlebars")    
}))

app.set("view engine", ".hbs");

//middlewares
app.use(morgan("dev"))


//PUBLIC
app.use(express.static(path.join(__dirname, './views/public')));

//archivos estáticos
app.use('/src/views/public', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//rutas
app.use('/', router)

//servidor
app.listen(PORT, ()=> {
    console.log("Server escuchando en puerto",PORT)
})