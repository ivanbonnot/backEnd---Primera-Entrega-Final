const { Router } = require('express')
const router = new Router()

const { productos } = require('../contenedor')

const adm = true


router.get('/', async (req, res) => {

    const allProducts = await productos.getAll()

    res.render("lista", {
        productos: allProducts,
        hayProductos: allProducts.length
    });
})


router.get('/:id', async (req, res) => {

    const { id } = req.params
    const productById = await productos.getById(parseInt(id))

    if (productById) {
        res.json(productById)

    } else {
        res.status(404).send({ error: 'Product not found' })
    }
})


router.post('/', async (req, res) => {

    if (adm) {
        const { image, title, price, description } = req.body

        if (image && title && price && description) {
            await productos.save(req.body)
            // const productById = await productos.getById(id)
            const allProd = await productos.getAll()
            res.render("lista", {
                productos: allProd,
                hayProductos: allProd.length
            });

        } else {
            res.send('Invalido, todos los campos son obligatorios')

        }

    } else {
        res.send('Error: 401 Ruta: "api/productos" Método: "POST" No Autorizada ')
    }

})


router.put('/:id', async (req, res) => {

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
        res.send('Error: 401 Ruta: "api/productos/:Id" Método: "PUT" No Autorizada ')
    }

})




router.delete('/:id', async (req, res) => {

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
        res.send('Error: 401 Ruta: "api/productos/:Id" Método: "DELETE" No Autorizada ')
    }

})


module.exports = router;

