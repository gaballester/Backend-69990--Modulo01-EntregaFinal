import { Router } from 'express';
import  ProductManager  from '../dao/db/product.manager.db.js'

export const productsRouter = Router()

const prodManager = new ProductManager()

productsRouter.get('/', async (req,res) => {
    try {
        const page  = parseInt(req.query.page,10) || 1
        const limit  = parseInt(req.query.limit,10) || 10
        const sort  = req.query.sort || null
        const category = req.query.category || 'All'

        let query = '{}'
        if ( category !== 'All' ) {
            query = `{ category: '${category}'}`
        }

        let options = `{page: ${page}, limit: ${limit}`
  
        if (sort != null) {
            options = options + `,${sort}`
        } else {
            options = options + '}'
        }

        //const productsResult = await prodManager.getProducts(query,options) */
        const productsResult = await prodManager.getProducts(query,options)

        const arrayProducts = productsResult.docs.map( prod => {
            const {_id,...rest} = prod.toObject()
            return rest
        })
        
        res.render( "home", {
            status: 'SUCCESS',
            payloads: arrayProducts,
            prevPage: productsResult.prevPage,
            nextPage: productsResult.nextPage,
            hasPrevPage: productsResult.hasPrevPage,
            hasNextPage: productsResult.hasNextPage,
            prevLink: productsResult.nextLink,
            nextLink: productsResult.prevLink,
            currentPage: productsResult.page,
            totalPages: productsResult.totalPages
        }
        )
        

/*         if (limit){
            const limitedProducts = products.slice(0,limit)
            res.json(limitedProducts)
        } else {
            res.json(products)
        } */
    } catch (error) {
        res.status(500).json({ status: 'ERROR' })
    }
})  

productsRouter.get('/:id', async (req,res) => {
    try {
        const id = req.params.id
        const product = await prodManager.getProductById(id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - reading one product" })
    }
})

productsRouter.post('/', async (req,res) => {
    try {
        // all fields : title,description,code,price,status,stock,category,thumbnails in json ProductObject
        // Updates only the fields that it receives in the json through the body, the rest remains the same
        const response = await prodManager.addProduct(req.body)
        res.status(200).json({message: "Product added successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - added product" })
    }
})

productsRouter.put('/:id', async (req,res) => {
    const id = req.params.id
    try {
        const response = await prodManager.updateProduct(id,req.body)
        res.status(201).json({message: "Product updated successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - update product" })
    }
}
)


productsRouter.delete('/:id', async (req,res) => {
    const id = req.params.id
    try {
        const response = await prodManager.deleteProduct(id)
        res.status(200).json({message: "Product successfully deleted"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - deleting product"})
    }
}
)

// Middleware for not defined routes
productsRouter.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
})