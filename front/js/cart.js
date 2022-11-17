import Product from './class/Product.js';
import Cart from './class/Cart.js';

const host = "http://localhost:3000/api/products/";

let priceArray = [];

//Displaying cart items and handling event
async function cartDisplay() {
  let cart = Cart.getCart();

  for(let product of cart) {
    let id = product._id;
    let color = product.color;
    let quantity = product.quantity;

    let fetchId = host + id;
    let data = await fetchData(fetchId);

    let item = new Product(data);
    item.toCartPage(quantity, color);

    let price = data.price;
    priceArray.push(price);
  }

  quantityInputHandler();
  deleteButtonHandler();
  displayTotalQuantity();
  displayTotalPrice();
}

cartDisplay();

async function fetchData(url) {
  return fetch(url)

  .then(function(resolution) {
    if(resolution.ok) {
      return resolution.json();
    }
  })

  .then(function(data) {
    return data;
  })

  .catch(function(error) {
    console.log(error);
    alert("Une erreur est survenue, veuillez réessayer plus tard.");
  })
}

//Add event listener to each quantity input and change localStorge accordingly
function quantityInputHandler() {
  let quantityInput = document.querySelectorAll(".itemQuantity");

  quantityInput.forEach(input => {
    input.addEventListener("change", function(element) {
      if(input.value < 0) {
        alert("Veuillez saisir une quantité comprise entre 1 et 100.");
        input.value = 1;
      }

      let product = {
        _id : element.target.closest(".cart__item").dataset.id,
        color : element.target.closest(".cart__item").dataset.color,
        quantity : parseInt(element.target.value)
      }

      Cart.changeItemQuantity(product);
      displayTotalQuantity();
      displayTotalPrice();
    })
  })
}

//Add event listener to each remove button and change localStorage accordingly
function deleteButtonHandler() {
  let deleteButton = document.querySelectorAll(".deleteItem");

  deleteButton.forEach(button => {
    button.addEventListener("click", function(element) {
      let product = {
        _id : element.target.closest(".cart__item").dataset.id,
        color : element.target.closest(".cart__item").dataset.color
      }

      Cart.removeItem(product);
      element.target.closest(".cart__item").remove();
      displayTotalQuantity();
      displayTotalPrice();
    })
  })
}

//Display total number of item in cart
function displayTotalQuantity() {
  let total = Cart.getTotalQuantity();
  document.querySelector("#totalQuantity").textContent=total;
}

//Get the total price for items in cart
function getTotalPrice() {
  let quantityArray = Cart.getQuantity();
  let totalPrice = 0;
  for(let i = 0; i < quantityArray.length ; i++) {
    let productPrice = quantityArray[i] * priceArray[i];
    totalPrice += productPrice;
  }
  return totalPrice;
}

//Display total price of item in cart
function displayTotalPrice() {
  let total = getTotalPrice();
  document.querySelector("#totalPrice").textContent = total;
}

//Form

//Form input selector
let firstName = document.querySelector("#firstName");
let lastName = document.querySelector("#lastName");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let email = document.querySelector("#email");

//Form error message selector
let firstNameError = document.querySelector("#firstNameErrorMsg");
let lastNameError = document.querySelector("#lastNameErrorMsg");
let addressError = document.querySelector("#addressErrorMsg");
let cityError = document.querySelector("#cityErrorMsg");
let emailError = document.querySelector("#emailErrorMsg");

//Regex
const regexName = /^[\p{Letter} ,'-]+$/mui;
const regexText = /[a-zA-Z]+/;
const regexEmail = /^([\w].+)@([\w]+.*[\w]{2,4})$/i;

//Add event listener to an input selector and display error message if fail regex test
function formInputHandler(inputSelector, regex, errorSelector, errorMessage) {
  inputSelector.addEventListener("input", function(element) {
    element.preventDefault();
    if(regex.test(inputSelector.value)) {
      errorSelector.textContent = null;
    } else {
      errorSelector.textContent = errorMessage;
    }
  })
}

formInputHandler(firstName, regexName, firstNameError, "Entrez un prénom valide.");
formInputHandler(lastName, regexName, lastNameError, "Entrez un nom valide.");
formInputHandler(address, regexText, addressError, "Entrez votre adresse.");
formInputHandler(city, regexText, cityError, "Entrez votre ville.");
formInputHandler(email, regexEmail, emailError, "Entrez une adresse email valide.");

//Create JSON element for the API POST request
/* Expects request to contain:
* contact: {
*   firstName: string,
*   lastName: string,
*   address: string,
*   city: string,
*   email: string
* }
* products: [string] <-- array of product _id
*/
function createJSON() {
  let contact = {
    firstName : firstName.value,
    lastName : lastName.value,
    address : address.value,
    city : city.value,
    email : email.value,
  };

  let products = Cart.getProductIdList();
  let json = JSON.stringify({contact, products});
  return json;
}

function postOrder() {
  let orderData = createJSON();
  let postUrl = host + "order/";

  fetch(postUrl, {
    method: 'POST',
    headers: {'Content-Type' : 'application/json; charset=utf-8'},
    body: orderData,
  })

  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
  })

  .then(function(data) {
    console.log(data);
    localStorage.clear();
    let orderConfirmationUrl = "./confirmation.html?id=" + data.orderId;
    window.location.href = orderConfirmationUrl;
  })

  .catch(function(error) {
    console.log(error);
    alert("Une erreur est survenue, veuillez réessayer plus tard.");
  })
}

//Check if no error are present on the form and post order if that's the case
const order = document.querySelector("#order");
order.addEventListener("click", function(element) {
  element.preventDefault();
  let errorCheck = (
    firstNameError.textContent == ""
    && lastNameError.textContent == ""
    && addressError.textContent == ""
    && cityError.textContent == ""
    && emailError.textContent == ""
  )

  let inputCheck = (
    firstName.value != ""
    && lastName.value != ""
    && address.value != ""
    && city.value != ""
    && email.value != ""
  )

  if(errorCheck && inputCheck) {
      postOrder();
  } else {
    alert("Veuillez remplir correctement tout les champs.");
    return;
  }
})