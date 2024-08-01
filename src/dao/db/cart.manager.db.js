import CartModel from '../../models/cart.model.js'
import ProductModel from '../../models/product.model.js';
import mongoose from 'mongoose'


class CartManager {


    addNewCart = async () => {
        try {
            const newCart = new CartModel()
            await newCart.save()
            return newCart
        } catch (error) {
            throw new Error("Cannot create the new cart",error); 
        }
    };


   
    getCartById = async (cartId) => {
        try {
            const cartFind = await CartModel.findById(cartId).populate('products.product')
            if (!cartFind) {
                throw new Error(`Cannot exist cart with Id ${cartId}. mgs error: ${error.message}`); 
            }
            return cartFind
        } catch (error) {
            throw new Error(`Error when return cart with Id ${cartId} : ${error.message}`); 
        }
    }

    getCarts = async () => {
      try {
        let cartsArray = await this.readFile()
        return cartsArray
      } catch (error) {
        throw new { error: `Error getting carts: ${error.message}` }
      }
    }
  
    // add one product to cart
    addProductToCart = async (cartId, productId, quantity = 1) => {
        try {
            const cart = await CartModel.findById(cartId)   
            if (!cart) {
                throw new Error(`Cannot exist cart with Id ${cartId}`); 
            }
            //const result = cart.addOrUpdateProduct(productId, quantity);
            const existingProductIndex = cart.products.findIndex(product => product.product.equals(productId))             
            if (existingProductIndex === -1) {
                cart.products.push({ product: productId, quantity })
            } else {
                cart.products[existingProductIndex].quantity += quantity
            }            
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`)   
        }
    }
 
     emptyCart = async (cid) => {
        try {
            // find cart by id
            const cart = await CartModel.findById(cid);           
            if (!cart) {
                return { success: false, message: 'Cart is not found' };
            }
            // empty products array
            cart.products = [];    
            // save db changes
            await cart.save();   
            return { success: true, message: 'products droped successfull' };
        } catch (error) {
            return { success: false, message: `drop products error,  ${error.message}` };
        }
    }

    dropProductFromCart = async (cartId, productId) => {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error(`Cart with id ${cartId} not found`);
            }
    
            const existingProductIndex = cart.products.findIndex(product => product.product.equals(productId))  
    
            if (existingProductIndex === -1) {
                return { success: false, message: 'Product does not exist in the cart' }
            }
    
            cart.products.splice(existingProductIndex, 1);

            await cart.save();
            return { success: true, message: 'Product removed from cart successfully' }

        } catch (error) {
            throw new Error(`Error dropping product from cart: ${error.message}`)
        }
    }
    
}

export { CartManager }
  