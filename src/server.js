const morgan = require('morgan');
const express = require('express');
const { Server: HTTPServer } = require('http')
const { Server: IOServer } = require('socket.io')

const handlebars = require('express-handlebars')
const path = require('path')

const app = express();

const httpServer = new HTTPServer(app)
const io = new IOServer(httpServer)

const { productos } = require('./class/contenedor')


//Settings
app.set('port', process.env.PORT || 8080)
app.set('json spaces', 2)

//Middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('./public'))

//Starting the server
httpServer.listen(8080, () => {
    console.log('Server On')
})

//websocket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', await productos.getAll());

    // actualizacion de productos
    socket.on('update', async producto => {
        products.save(producto)
        io.sockets.emit('productos', await productos.getAll());
    })
});

//HBS
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs"
    })
);
app.set("view engine", "hbs");
app.set('views', path.resolve(__dirname, '../public'))

//Routes
app.use('/api/productos', require('./routes/products'))
app.use('/api/carrito', require('./routes/cart'))



