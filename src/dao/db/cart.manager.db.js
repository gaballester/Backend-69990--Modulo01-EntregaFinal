import CartModel from '../../models/cart.model.js'
import ProductModel from '../../models/product.model.js';

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
                throw new Error(`Cannot exist cart with Id ${cartId}. mgs error: ${error.message}`); 
            }
            const productExists = cart.products.find(item => item.product.toString() === productId)
            if (productExists) {
                productExists.quantity += quantity
            } else {
                cart.products.push({product: productId, quantity: quantity})
            }          
            cart.markModified("products") 
            await cart.save()
            return cart
        } catch (error) {
            throw new Error(`Cart not found. ${error.message}`)   
        }
    }
 
     emptyCart = async (cid) => {
        try {
            // drop all documents for specific cart
            await CartModel.deleteMany({ cid });
            return `Cart with id ${cid} has been successfully empty.`
        } catch (error) {
            throw `Error while tey to empty Cart: ${error.message}`
        }
    }

}

  export { CartManager }
  