import CartModel from '../../models/cart.model.js'

class CartManager {


    addNewCart = async () => {
        try {
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        } catch (error) {
            throw new Error("Cannot create the new cart",error); 
        }
    };


    //getCartById
    getCartProducts = async (cartId) => {
        try {
            const cartFind = await CartModel.findById(cartId)
            if (!cartFind) {
                throw new Error(`Cannot exist cart with Id ${cartId}`,error); 
            }
            return cartFind
        } catch (error) {
            throw new Error(`Error when return cart with Id ${cartId}`,error); 
        }
    }
    getCarts = async () => {
      try {
        let cartsArray = await this.readFile()
        return cartsArray
      } catch (error) {
        throw new { error: `Error getting carts: ${error}` }
      }
    }
  
    addProducttoCart = async (cartId, productId, quantity = 1) => {
        try {
            const cart = await this.getCartProducts(cartId)
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
            throw new Error("Cart not found",error)   
        }
    }

  }
      
  
  export { CartManager };
  