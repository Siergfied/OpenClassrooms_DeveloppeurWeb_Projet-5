export default class Product {
    
    constructor(productJson) {
        this && Object.assign(this, productJson);
    }

    //Displaying product on index page
    toIndex() {
        //Template selection
        var template = document.querySelector("#productCard");

        //Template cloning
        var clone = template.content.cloneNode(true);

        //Template filling
        var link = clone.querySelector("a");
        link.setAttribute("href","./product.html?id=" + this._id);

        var image = clone.querySelector("img");
        image.setAttribute("src", this.imageUrl);
        image.setAttribute("alt", this.altTxt);

        var name = clone.querySelector("h3");
        name.textContent= this.name;

        var description = clone.querySelector("p");
        description.textContent = this.description;

        //Insert
        var container = document.querySelector("#items");
        container.appendChild(clone);
    }

    //Displaying product on product page
    toProductPage() {

        document.querySelector("title").textContent = this.name;

        var template = document.querySelector("#product");

        var clone = document.importNode(template.content, true);

        var image = clone.querySelector("img");
        image.setAttribute("src", this.imageUrl);
        image.setAttribute("alt", this.altTxt);

        var title = clone.querySelector("#title");
        title.textContent = this.name;

        var price = clone.querySelector("#price");
        price.textContent = this.price;

        var description = clone.querySelector("#description");
        description.textContent = this.description;

        //Add an option for each entry in the array
        var color = clone.querySelector("#colors");
        for(let colorOption of this.colors) {
            //console.log(colorOption);
            color.insertAdjacentHTML("beforeend",`<option value="${colorOption}">${colorOption}</option>`);
        }
        
        var container = document.querySelector(".item");
        container.appendChild(clone);
    }

    //Displaying product on cart page
    toCartPage(quantity, color) {
        var template = document.querySelector("#item")

        var clone = template.content.cloneNode(true);

        var article = clone.querySelector("article");
        article.setAttribute("data-id", this._id);
        article.setAttribute("data-color", color);

        var image = clone.querySelector("img");
        image.setAttribute("src", this.imageUrl);
        image.setAttribute("alt", this.altTxt);

        var description = clone.querySelector(".cart__item__content__description");
        description.insertAdjacentHTML("beforeend",`<h2>${this.name}</h2><p>${color}</p><p>${this.price} €</p>`);

        var productQuantity = clone.querySelector(".itemQuantity");
        productQuantity.setAttribute("value", quantity);

        var container = document.querySelector("#cart__items");
        container.appendChild(clone);

        return container;
    }
}