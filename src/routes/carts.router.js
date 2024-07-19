import { Router } from 'express';
import { CartManager } from '../dao/db/cart.manager.db.js'


const cartManager = new CartManager()

export const cartsRouter = Router()

cartsRouter.post('/', async (req,res) => {
    try {
        const newCart = await cartManager.addNewCart()
        res.json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error -adding new cart"})
    }
})

cartsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    try {
        const cartProducts = await cartManager.getCartProducts(id)
        res.json(cartProducts)      
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - error to access to products cart"})
    }
} )

cartsRouter.post('/:cid/product/:pid', async (req,res)  => {
    const { cid, pid } = req.params
    try {
        const quantity = req.body.quantity || 1;
        const cart = await cartManager.addProducttoCart(cid,pid,quantity)
        res.status(201).json({message: "Product added successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - adding product to Cart"})
    }
})

// Middleware for not defined routes
cartsRouter.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
})

