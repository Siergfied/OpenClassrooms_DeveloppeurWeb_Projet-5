import Product from './class/Product.js';
import Cart from './class/Cart.js';

const productUrl =  new URL(window.location.href); //Getting URL from actual page
const productId = productUrl.searchParams.get("id"); //Getting id parameter from the URL
const host = "http://localhost:3000/api/products/";
const fetchId = host + productId; //API adress for the product id

//Fecthing product data by it's id and display
function productFetch() {

    fetch(fetchId)
        .then(function(resolution) {
            if(resolution.ok) {
                return resolution.json();
            }
        })

        .then(function(data) {
            let product = new Product(data);
            product.toProductPage();

            quantityInputHandler();

            buttonCartHandler(product);

        })

        .catch(function(error) {
            console.log(error);
            alert("Une erreur est survenue, veuillez réessayer plus tard.");
        })
}

productFetch();

//Handle event on addToCart button, check if color and quantity is valid, if ok add item / add quantity
function buttonCartHandler(product) {
    let cartButton = document.querySelector("#addToCart");
    cartButton.addEventListener("click", function(element) {
        element.preventDefault();
        if(document.querySelector("#colors").value =="") {
            alert("Veuillez choisir une couleur pour votre produit.");
        } else if(document.querySelector("#quantity").reportValidity() && document.querySelector("#colors").reportValidity()) {
            product.quantity = parseInt(document.querySelector("#quantity").value);
            product.color = document.querySelector("#colors").value;
            let item = {_id : product._id, color : product.color, quantity : product.quantity};
            Cart.addToCart(item);
        }
    })
}

//Handle quantity input field, if invalid value alert message and reset input value to 1
function quantityInputHandler() {
    let quantityInput = document.querySelector("#quantity");
    quantityInput.addEventListener("change", function(element) {
        element.preventDefault();
        if(quantityInput.value < 0) {
            alert("Veuillez saisir un nombre d'article(s) compris entre 1 et 100.")
            quantityInput.value = 1;
        }
    })
}