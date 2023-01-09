const express = require('express')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const { products, carts } = require('../class/contenedor')
const Cart = require('../class/cartClass')

const { Router } = express 
const carritoRouter = Router() 


/* ------- router carrito --------*/ 


//------------POST Carrito
carritoRouter.post('/carrito', async (req, res) => {
  const idNewCart = uuidv4()
  const cart = new Cart(`./data/${idNewCart}.txt`)
  cart.saveFile({ id: idNewCart, timestamp: new Date().toLocaleString(), products: [] })
  carts.addCart(idNewCart)
  res.send(idNewCart)
})


//----------DELETE carrito
carritoRouter.delete('/carrito/:id', async (req, res) => {
  const id = req.params.id
  fs.unlink(`./data/${id}.txt`, (error) => {
    error ? console.log('No se ha podido borrar') : console.log('Borrado exitoso')
  })
  await carts.deleteById(id)
  res.send('Borrado exitoso')
})


//------------GET productos del carrito
carritoRouter.get('/carrito/:id/productos', async (req, res) => {
  const id = req.params.id
  const cart = new Cart(`./data/${id}.txt`)
  const products = await cart.getAll()
  res.send(products)
})


//---------POST producto en carrito
carritoRouter.post('/carrito/:id/productos/:id_prod', async (req, res) => {
  const cartId = req.params.id
  const itemId = req.params.id_prod
  const item = await products.getById(itemId)
  await fs.readFile(`./data/${cartId}.txt`, 'utf8', (err, data) => {
    const carrito = JSON.parse(data)
    carrito.products.push(item)
    fs.promises.writeFile(
      `./data/${cartId}.txt`, JSON.stringify( carrito, null, 2 )
    )
  })
  
  res.send('ok')
})


//---------DEL producto en carrito
carritoRouter.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
  const cartId = req.params.id
  const itemId = req.params.id_prod
  const cart = new Cart(`./data/${cartId}.txt`)
  await cart.deleteById( itemId )
  res.send('Producto borrado exitosamente')
})


module.exports = carritoRouter