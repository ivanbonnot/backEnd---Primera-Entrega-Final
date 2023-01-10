const { Router } = require('express')
const productosRouter = new Router()

const { productos } = require('../class/contenedor')

const adm = true


productosRouter.get('/', async (req, res) => {
    const allProducts = await productos.getAll()
    res.json(
        allProducts
    );
})


productosRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    const productById = await productos.getById(parseInt(id))

    if (productById) {
        res.json(productById)
    } else {
        res.status(404).send({ error: 'Product not found' })
    }
})


productosRouter.post('/', async (req, res) => {
    if (adm) {
        const { foto, title, price, description } = req.body

        if (foto && title && price && description) {
            await productos.save(req.body)
            res.redirect('/')
        } else {
            res.send('Invalido, todos los campos son obligatorios')
        }

    } else {
        res.send('Error: 403 Ruta: "api/productos" Método: "POST" No Autorizada ')
    }
})


productosRouter.put('/:id', async (req, res) => {

    if (adm) {
        const id = Number(req.params.id)
        const { image, title, price, description } = req.body

        if (await productos.getById(id) && (image && title && price && description)) {
            let allProducts = await productos.getAll()
            allProducts[id - 1] = { "id": id, ...req.body }
            productos.saveFile(allProducts)
            res.send(req.body)
        } else {
            res.status(404).send({ error: 'id invalid / missing fields' })
        }

    } else {
        res.send('Error: 403 Ruta: "api/productos/:Id" Método: "PUT" No Autorizada ')
    }

})




productosRouter.delete('/:id', async (req, res) => {

    if (adm) {
        const { id } = req.params
        const deleteProdById = await productos.getById(parseInt(id))

        if (deleteProdById) {
            await productos.deleteById(parseInt(id))
            res.send({ deleted: deleteProdById })

        } else {
            res.status(404).send({ error: 'Product not found' })
        }

    } else {
        res.send('Error: 403 Ruta: "api/productos/:Id" Método: "DELETE" No Autorizada ')
    }

})


module.exports = productosRouter;

