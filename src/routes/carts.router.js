import { Router } from 'express';
import { CartManager } from '../dao/db/cart.manager.db.js'

export const cartsRouter = Router()

const cartManager = new CartManager()

// Create New Cart
cartsRouter.post('/', async (req,res) => {
    try {
        const newCart = await cartManager.addNewCart()
        res.json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error -adding new cart"})
    }
})

// Get cart by Id
cartsRouter.get('/:id', async (req,res) => {
    const { id } = req.params
    try {
        const cartProducts = await cartManager.getCartById(id)
        res.json(cartProducts)      
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - error to access to products cart"})
    }
} )

// add quantity product to cartId
cartsRouter.post('/:cid/product/:pid', async (req,res)  => {
    const { cid, pid } = req.params
    try {
        const quantity = req.body.quantity || 1;
        const cart = await cartManager.addProductToCart(cid,pid,quantity)
        res.status(201).json({message: "Product added successfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - adding product to Cart"})
    }
})

/* // add multiply products to CartId
cartsRouter.post('/:cid/products/:prodArray'), async (req,res) => {
    const {cid, prodArray} = req.params
    try {
        const cart = await addProductsToCart(cid, prodArray)
        res.status(201).json({message: "Products added successfully"})
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - adding array products to Cart"})
    }
} */

// empty specified cart
cartsRouter.delete('/:cid', async (req,resp) => {
    const {cid} = req.params
    try {
        const response = await cartManager.emptyCart(id)
        res.status(200).json({message: "Cart successfully deleted"});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error - deleting Cart"})
    }
})

// Middleware for not defined routes
cartsRouter.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
})




