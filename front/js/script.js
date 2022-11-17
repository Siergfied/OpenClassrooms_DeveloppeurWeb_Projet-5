import Product from './class/Product.js';

const host = "http://localhost:3000/api/products/";
const sectionProduct = document.querySelector('#items');

//Fecthing data from API and displaying items
function productListFetch() {
    fetch(host)
        .then(function(resolution) {
            if(resolution.ok) {
                return resolution.json();
            }
        })

        .then(function(data) {
            //console.log(data);
            productListCreate(data);
        })

        .catch(function(error) {
            console.log(error);
            alert("Une erreur est survenue, veuillez réessayer plus tard.");
        });
}

productListFetch();

//Create an element for each data present
function productListCreate(data) {
    for(let product of data) {
        product = new Product(product);
        product.toIndex();
    }
}