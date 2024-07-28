import CartModel from '../../models/cart.model.js'

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
            console.log('cartFind1',cartFind)
            if (!cartFind) {
                throw new Error(`Cannot exist cart with Id ${cartId}`,error); 
            }
            console.log('cartFind2',cartFind)
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
  
    // add one product to cart
    addProductToCart = async (cartId, productId, quantity = 1) => {
        try {
            const cart = await this.getCartbyID(cartId)
            console.log('cartera',cart)
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
 
     emptyCart = async (cid) => {
        try {
            // drop all documents for specific cart
            await CartModel.deleteMany({ cid });
            return `Cart with id ${cid} has been successfully empty.`
        } catch (error) {
            throw `Error while tey to empty Cart: ${error}`
        }
    }

}

  export { CartManager }
  