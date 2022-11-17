import Product from "./Product.js";

export default class Cart {

    //Get cart from localStorage
    static getCart() {
        let cart = localStorage.getItem("panier");
        if(cart == null) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }
        return cart;
    }
    
    //Save cart to localStorage
    static saveCart(cart) {
        localStorage.setItem("panier", JSON.stringify(cart));
    }

    //Add a product to cart or add quantity if already present
    static addToCart(product) {
        let cart = this.getCart();
        let productFound = cart.find(element => element._id == product._id && element.color == product.color);
        if(productFound == null) {
            cart.push(product);
        } else {
            productFound.quantity += product.quantity;
        }
        this.saveCart(cart);
    }

    //Change item quantity
    static changeItemQuantity(product) {
        let cart = this.getCart();
        let productFound = cart.find(element => element._id == product._id && element.color == product.color);
        productFound.quantity = product.quantity;
        this.saveCart(cart);
    }
    
    //Remove item from cart
    static removeItem(product) {
        let cart = this.getCart();
        cart = cart.filter(element => element._id != product._id || element.color != product.color);
        this.saveCart(cart);
    }

    //Get a product quantity
    static getQuantity() {
        let cart = this.getCart();
        if(cart.length > 0) {
            let quantity = cart.map(product => product.quantity);
            return quantity;
        } else {
            return 0;
        }
    }

    //Compute card total quantity
    static getTotalQuantity() {
        let cart = this.getCart();
        if(cart.length > 0) {
            let total = cart.map(product => product.quantity).reduce((total, quantity) => total += quantity);
            return total;
        } else {
            return 0;
        }
    }

    //Get list of product id from cart
    static getProductIdList() {
        let cart = this.getCart();
        let idList = cart.map(product => product._id);
        return idList
    }
}