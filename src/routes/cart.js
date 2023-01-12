const express = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const { productos, carrito } = require('../class/contenedor')
const Cart = require('../class/cartClass')

const { Router } = express 
const carritoRouter = Router() 


/* ------- router carrito --------*/ 


//------------POST Carrito
carritoRouter.post('/', async (req, res) => {
  const idNewCart = uuidv4()
  const cart = new Cart(`./data/${idNewCart}.txt`)
  cart.saveFile({ id: idNewCart, timestamp: new Date().toLocaleString(), productos: [] })
  carrito.addCart(idNewCart)
  res.send(idNewCart)
})


//----------DELETE carrito
carritoRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  fs.unlink(`./data/${id}.txt`, (error) => {
    error ? console.log('No se ha podido borrar') : console.log('Borrado exitoso')
  })
  await carrito.deleteById(id)
  res.send('Borrado exitoso')
})


//------------GET productos del carrito
carritoRouter.get('/:id/productos', async (req, res) => {
  const id = req.params.id
  const cart = new Cart(`./data/${id}.txt`)
  const productos = await cart.getAll()
  res.send(productos)
})


//---------POST producto en carrito
carritoRouter.post('/:id/productos/:id_prod', async (req, res) => {
  const cartId = req.params.id
  const itemId = req.params.id_prod
  const item = await productos.getById(itemId)
  await fs.readFile(`./data/${cartId}.txt`, 'utf8', (err, data) => {
    const carrito = JSON.parse(data)
    carrito.productos.push(item)
    fs.promises.writeFile(
      `./data/${cartId}.txt`, JSON.stringify( carrito, null, 2 )
    )
  })
  
  res.send('ok')
})


//---------DEL producto en carrito
carritoRouter.delete('/:id/productos/:id_prod', async (req, res) => {
  const cartId = req.params.id
  const itemId = req.params.id_prod
  const cart = new Cart(`./data/${cartId}.txt`)
  await cart.deleteById( itemId )
  res.send('Producto borrado exitosamente')
})


module.exports = carritoRouter