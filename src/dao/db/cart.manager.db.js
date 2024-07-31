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


        try {
            // drop all documents for specific cart
            await CartModel.deleteMany(cid);
            return `Cart with id ${cid} has been successfully empty.`
        } catch (error) {
            throw `Error while tey to empty Cart: ${error.message}`
        }
    }

}

  export { CartManager }
  